import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';
import Showtime from '../models/showtimes';

export class ShowtimesController {
  getShowtimes = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const showtimes = await collections.showtimes
      .find()
      .toArray();
      
      res.status(200).json(showtimes);
    } catch (error) {
      console.error('Error getting showtimes:', error);
      res.status(500).json({
        message: 'Error getting showtimes'
      });
    }
  };

  getShowtimeById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    // Validate showtime ID
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    const showtimeId = new ObjectId(id);
    
    try {
      const showtime = await collections.showtimes
      .findOne({ 
        _id: showtimeId 
      });

      if (!showtime) {
        res.status(404).json({
          message: `Unable to find showtime with id: ${id}`
        });
      return;
      }
      
      res.status(200).json(showtime);
    } catch (error) {
      console.error('Error getting showtime:', error);

      res.status(500).json({
        message: 'Error getting showtime'
      });
    }
  };

  getNowPlayingMovies = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const showtimes = await collections.showtimes
        .find({
          startDate: { $lte: today },
          endDate: { $gte: today }
        })
        .toArray();

      if (showtimes.length === 0) {
        res.status(200).json([]);
        return;
      }
        
      const movieIds = showtimes.map(
        showtime => showtime.movieId
      );
      
      const movies = await collections.movies
      .find({ 
        _id: { $in: movieIds } 
      })
      .toArray();

      const nowPlayingMovies = movies.map(movie => ({
        ...movie,
        showtimes: showtimes.filter(showtime => 
          showtime.movieId.equals(movie._id)
        )
      }));
      
      res.status(200).json(nowPlayingMovies);
    } catch (error) {
      console.error('Error getting now playing movies:', error);

      res.status(500).json({
        message: 'Error getting now playing movies'
      });
    }
  };

  getComingSoonMovies = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const showtimes = await collections.showtimes
        .find({
          startDate: { $gt: today }
        })
        .toArray();

      if (showtimes.length === 0) {
        res.status(200).json([]);
        return;
      }

      const movieIds = showtimes.map(
        showtime => showtime.movieId
      );

      const movies = await collections.movies
        .find({
          _id: { $in: movieIds } 
        })
        .toArray();

      const comingSoonMovies = movies.map(movie => ({
        ...movie,
        showtimes: showtimes.filter(showtime => 
          showtime.movieId.equals(movie._id)
        )
      }));

      res.status(200).json(comingSoonMovies);
    } catch (error) {
      console.error('Error getting coming soon movies', error);

      res.status(500).json({
        message: 'Error getting coming soon movies'
      });
    }
  };

  getShowtimesByMovie = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { movieId } = req.params;

    // Validate movie ID
    if (!ObjectId.isValid(movieId)) {
      res.status(400).json({
        message: 'Invalid movie ID'
      });
      return;
    }

    const movieObjectId = new ObjectId(movieId);

    try {
      const showtimes = await collections.showtimes
        .find({ 
          movieId: movieObjectId 
        })
        .toArray();
      
        res.status(200).json(showtimes);
      } catch (error) {
        console.error('Error getting showtimes by movie:', error);

        res.status(500).json({
          message: 'Error getting showtimes by movie'
        });
      }
    };

  postShowtime = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const newShowtime = new Showtime(
        new ObjectId(req.body.movieId),
        req.body.startDate,
        req.body.endDate,
        req.body.time,
        req.body.type,
        req.body.seatCapacity
      );

      const result = await collections.showtimes.insertOne(
        newShowtime
      );
      
      res.status(201).json({
        message: 'Showtime created successfully',
        showtimeId: result?.insertedId
      });
    } catch (error) {
      console.error('Error creating showtime:', error);

      res.status(500).json({
        message: 'Error creating showtime'
      });
    }
  };

  updateShowtimeById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    // Validate showtime ID
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    const showtimeId = new ObjectId(id);
    
    try {
      const updatedShowtime = {
        movieId: new ObjectId(req.body.movieId),
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        time: req.body.time,
        type: req.body.type,
        seatCapacity: req.body.seatCapacity
      };

      const result = await collections.showtimes.updateOne(
        { 
          _id: showtimeId 
        }, 
        { 
          $set: updatedShowtime 
        }
      );

      if (result.matchedCount === 0) {
        res.status(404).json({
          message: `Showtime with id ${id} not found`
        });
        return;
      }
      
      if (result.modifiedCount === 0) {
        res.status(200).json({
          message: `Showtime with id ${id} is already up to date`
        });
        return;
      }
      res.status(200).json({
        message: `Successfully updated showtime with id ${id}`
      });
    } catch (error) {
      console.error('Error updating showtime:', error);

      res.status(500).json({
        message: 'Error updating showtime'
      });
    }
  };

  deleteShowtimeById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    // Validate showtime ID
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }

    const showtimeId = new ObjectId(id);

    try {
      const result = await collections.showtimes.deleteOne({ 
        _id: showtimeId 
      });
      
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: `Showtime with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        message: `Successfully removed showtime with id ${id}`
      });
    } catch (error) {
      console.error('Error deleting showtime:', error);

      res.status(500).json({
        message: 'Error deleting showtime'
      });
    }
  };
}
