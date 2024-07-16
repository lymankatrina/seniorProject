import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class ShowtimesController {
  getShowtimes = async (req: Request, res: Response): Promise<void> => {
    try {
      const showtimes = await collections.showtimes.find().toArray();
      if (showtimes.length > 0) {
        res.status(200).json(showtimes);
      } else {
        res.status(404).send(`No showtimes found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getShowtimeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const showtimeId = new ObjectId(id);
      const showtime = await collections.showtimes.findOne({ _id: showtimeId });
      if (showtime) {
        res.status(200).json(showtime);
      } else {
        res.status(404).send(`Unable to find any showtimes with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getNowPlayingMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const showtimes = await collections.showtimes
        .find({
          startDate: { $lte: today },
          endDate: { $gte: today }
        })
        .toArray();

      if (showtimes.length > 0) {
        const movieIds = showtimes.map((showtime) => new ObjectId(showtime.movieId));
        const movies = await collections.movies.find({ _id: { $in: movieIds } }).toArray();

        const nowPlayingMovies = movies.map((movie) => {
          return {
            ...movie,
            showtimes: showtimes.filter((showtime) => showtime.movieId.toString() === movie._id.toString())
          };
        });

        res.status(200).json(nowPlayingMovies);
      } else {
        res.status(404).send('No movies are currently playing');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getComingSoonMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const showtimes = await collections.showtimes
        .find({
          startDate: { $gt: today }
        })
        .toArray();

      if (showtimes.length > 0) {
        const movieIds = showtimes.map((showtime) => new ObjectId(showtime.movieId));
        const movies = await collections.movies.find({ _id: { $in: movieIds } }).toArray();

        const comingSoonMovies = movies.map((movie) => {
          return {
            ...movie,
            showtimes: showtimes.filter((showtime) => showtime.movieId.toString() === movie._id.toString())
          };
        });

        res.status(200).json(comingSoonMovies);
      } else {
        res.status(404).send('No coming soon movies to display');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getShowtimesByMovie = async (req: Request, res: Response): Promise<void> => {
    const { movieId } = req.params;
    try {
      const showtimes = await collections.showtimes.find({ movieId: movieId }).toArray();
      if (showtimes.length > 0) {
        res.status(200).json(showtimes);
      } else {
        res.status(404).send(`Unable to find any showtimes for movieId: ${movieId}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  postShowtime = async (req: Request, res: Response): Promise<void> => {
    try {
      const newShowtime = req.body;
      const result = await collections.showtimes.insertOne(newShowtime);
      if (result) {
        res.status(201).send(`Successfully created a new showtime with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a new showtime' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateShowtimeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const showtimeId = new ObjectId(id);
      const updatedShowtime = req.body;
      const result = await collections.showtimes.updateOne({ _id: showtimeId }, { $set: updatedShowtime });
      if (result.matchedCount === 0) {
        res.status(404).send(`Showtime with id: ${id} not found`);
      } else if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated showtime with id ${id}`);
      } else {
        res.status(304).send(`Showtime with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  deleteShowtimeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const showtimeId = new ObjectId(id);
      const result = await collections.showtimes.deleteOne({ _id: showtimeId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed showtime with id ${id}`);
      } else {
        res.status(404).send(`Showtime with id ${id} not found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
