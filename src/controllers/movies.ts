import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Movie } from '../models/movies';
import type { CreateMovieInput, UpdateMovieInput } from '../dto/movies.dto';
import { collections } from '../services/database.services';


export class MoviesController {
  getMovies = async (_req: Request, res: Response): Promise<void> => {
    try {
      const movies = await collections.movies
        .find()
        .sort({ title: 1 })
        .toArray();
      res.status(200).json(movies);
    } catch (error) {
      console.error('Error getting movies:', error);
      res.status(500).json({
        message: 'Error getting movies'
      });
    }
  };

  getMoviesById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid movie id'
      });
      return;
    }
    try {
      const movie = await collections.movies.findOne({ _id: new ObjectId(id) });
      if (!movie) {
        res.status(404).json({
          message: 'Movie not found'
        });
        return;
      } 
      res.status(200).json(movie);
    } catch (error) {
      console.error('Error getting movie:', error);
      res.status(500).json({
        message: 'Error getting movie'
      });
    }
  };

  searchByTitle = async (req: Request, res: Response): Promise<void> => {
    const { title } = req.params;
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({
        message: 'Movie title is required'
      });
      return;
    }
    try {
      const movies = await collections.movies
        .find()
        .toArray();
      const filteredMovies = movies.filter((movie) => 
        movie.title
          .toLowerCase()
          .includes(title.toLowerCase())
      );
      if (filteredMovies.length === 0) {
        res.status(404).json({
          message: `Unable to find a movie with '${title}' in the title`
        });
        return;
      }
      res.status(200).json(filteredMovies);
    } catch (error) {
      console.error('Error searching by title', error);
      res.status(500).json({ 
        message: 'Error searching by movie title' 
      });
    }
  };

  postMovie = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const data = matchedData(req) as CreateMovieInput;
      const newMovie: Movie = {
        ...data,
        releaseDate: new Date(
          `${data.releaseDate}T00:00:00.000Z`
        )
      };
      const result = await collections.movies.insertOne(newMovie);
      res.status(201).json({ 
        message: 'Successfully created a new movie',
        movieId: result.insertedId
      });
    } catch (error) {
      console.error('Error creating movie', error);
      res.status(500).json({ 
        message: 'Unable to create movie' 
      });
    }
  };

  updateMovieById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid movie id'
      });
      return;
    }
    try {
      const data = matchedData(req) as UpdateMovieInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No movie fields provided for update'
        });
        return;
      }
      const {
        releaseDate,
        ...movieData
      } = data;
      const updatedMovie: Partial<Movie> = {
        ...movieData,
        ...(releaseDate !== undefined && {
          releaseDate: new Date(
            `${releaseDate}T00:00:00.000Z`
          )
        })
      };
      const result = await collections.movies.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedMovie }
      );
      if (result.matchedCount === 0) {
        res.status(404).json({
          message: 'Movie not found'
        });
        return;
      }
      res.status(200).json({
        message:
          result.modifiedCount > 0
            ? 'Successfully updated movie'
            : 'Movie is already up to date'
      });
    } catch (error) {
      console.error('Error updating movie', error);
      res.status(500).json({
        message: 'Unable to update movie'
      });
    }
  };

  deleteMovieById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid movie id'
      });
      return;
    }
    try {
      const movieId = new ObjectId(id);
      const existingShowtime = 
        await collections.showtimes.findOne({
          movieId
        });
      if (existingShowtime) {
        res.status(409).json({
          message:
            'Movie cannot be deleted because it has associated showtimes'
        });
        return;
      }
      const result = await collections.movies.deleteOne({ 
        _id: movieId 
      });
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: 'Movie not found'
        });
        return;
      }
      res.status(200).json({
        message: 'Successfully deleted movie'
      });
    } catch (error) {
      console.error('Error deleting movie', error);
      res.status(500).json({
        message: 'Unable to delete movie'
      });
    }
  };
}
