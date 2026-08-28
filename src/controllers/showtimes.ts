import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Showtime } from '../models/showtimes';
import type { CreateShowtimeInput, UpdateShowtimeInput } from '../dto/showtimes.dto';
import { collections } from '../services/database.services';
import { showtimeValidationRules } from '../middleware/validator';


export class ShowtimesController {
  getShowtimes = async (
    _req: Request, 
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
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }
    try {
      const showtime = await collections.showtimes.findOne({ _id: new ObjectId(id) });
      if (!showtime) {
        res.status(404).json({
          message: 'Showtime not found'
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
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const today = new Date()
        .toISOString()
        .slice(0, 10);
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
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const today = new Date()
        .toISOString()
        .slice(0, 10);
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
    if (
      typeof movieId !== 'string' ||
      !ObjectId.isValid(movieId)
    ) {
      res.status(400).json({
        message: 'Invalid movie ID'
      });
      return;
    }
    try {
      const showtimes = await collections.showtimes
        .find({ 
          movieId: new ObjectId(movieId) 
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
      const data = matchedData(req) as CreateShowtimeInput;
      const movieId = new ObjectId(data.movieId);
      const movieExists = await collections.movies.findOne({
        _id: movieId
      });
      if (!movieExists) {
        res.status(404).json({
          message: 'Movie not found'
        });
        return;
      }
      const newShowtime: Showtime = {
        ...data,
        movieId
      };
      const result = await collections.showtimes.insertOne(
        newShowtime
      );
      res.status(201).json({
        message: 'Showtime created successfully',
        showtimeId: result.insertedId
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
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }
    try {
      const showtimeId = new ObjectId(id);
      const existingShowtime =
        await collections.showtimes.findOne({
          _id: showtimeId
        });
      if(!existingShowtime) {
        res.status(404).json({
          message: 'Showtime not found'
        });
        return;
      }
      const data = matchedData(req) as UpdateShowtimeInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No showtime fields provided for update'
        });
        return;
      }
      const existingTicket = await collections.tickets.findOne({
        showtimeId
      });
      if (existingTicket) {
        res.status(409).json({
          message: 'Showtime cannot be updated because tickets have already been generated'
        });
        return;
      }
      const finalStartDate =
        data.startDate ?? existingShowtime.startDate;
      const finalEndDate =
        data.endDate ?? existingShowtime.endDate;
      if (finalEndDate < finalStartDate) {
        res.status(400).json({
          message:
            'End date must be on or after start date'
        });
        return;
      }
      const {
        movieId,
        ...showtimeData
      } = data;
      const updatedShowtime: Partial<Showtime> = {
        ...showtimeData
      };
      if (movieId !== undefined) {
        const movieObjectId = new ObjectId(movieId);
        const movieExists = await collections.movies.findOne({
          _id: movieObjectId
        });
        if (!movieExists) {
          res.status(404).json({
            message: 'Movie not found'
          });
          return;
        }
        updatedShowtime.movieId = movieObjectId;
      }
      const result = await collections.showtimes.updateOne(
        { _id: showtimeId },
        { $set: updatedShowtime }
      );
      if (result.matchedCount === 0) {
        res.status(404).json({
          message: 'Showtime not found'
        });
        return;
      }
      res.status(200).json({
        message: 
          result.modifiedCount > 0
          ? 'Successfully updated showtime'
          : 'Showtime is already up to date'
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
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid showtime ID'
      });
      return;
    }
    try {
      const showtimeId = new ObjectId(id);
      const showtime = await collections.showtimes.findOne({
        _id: showtimeId
      });
      if (!showtime) {
        res.status(404).json({
          message: 'Showtime not found'
        });
        return;
      }
      const existingTicket = await collections.tickets.findOne({
        showtimeId
      });
      if (existingTicket) {
        res.status(409).json({
          message:
          'Showtime cannot be deleted because tickets have already been generated'
        });
        return;
      }
      await collections.showtimes.deleteOne({ 
        _id: showtimeId 
      });
      res.status(200).json({
        message: 'Successfully deleted showtime'
      });
    } catch (error) {
      console.error('Error deleting showtime:', error);
      res.status(500).json({
        message: 'Error deleting showtime'
      });
    }
  };
}
