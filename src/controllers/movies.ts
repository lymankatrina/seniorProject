import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';
import Movie from '../models/movies';
import Showtime from '../models/showtimes';

export class MoviesController {
  getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const movies = await collections.movies.find().sort({ title: 1 }).toArray();
      if (movies.length > 0) {
        res.status(200).json(movies);
      } else {
        res.status(400).send(`No movies found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getMoviesById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const movieId = new ObjectId(id);
      const movie = await collections.movies.findOne({ _id: movieId });
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(404).send(`Unable to find any movies with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  searchByTitle = async (req: Request, res: Response): Promise<void> => {
    const { title } = req.params;
    try {
      const movies = await collections.movies.find().toArray();
      const filteredMovies = movies.filter((m) => m.title.toLowerCase().includes(title.toLowerCase()));
      if (filteredMovies.length > 0) {
        res.status(200).json(filteredMovies);
      } else {
        res.status(404).send(`Unable to find a movie with '${title}' in the title`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  postMovie = async (req: Request, res: Response): Promise<void> => {
    try {
      const newMovie = req.body;
      const result = await collections.movies.insertOne(newMovie);
      if (result) {
        res.status(201).send(`Successfully created a new movie with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a new movie' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateMovieById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const movieId = new ObjectId(id);
      const updatedMovie = req.body;
      const result = await collections.movies.updateOne({ _id: movieId }, { $set: updatedMovie });
      if (result.matchedCount === 0) {
        res.status(404).send(`Movie with id: ${id} not found`);
      } else if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated movie with id ${id}`);
      } else {
        res.status(304).send(`Movie with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  deleteMovieById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const movieId = new ObjectId(id);
      const result = await collections.movies.deleteOne({ _id: movieId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed movie with id ${id}`);
      } else {
        res.status(404).send(`Movie with id ${id} not found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
