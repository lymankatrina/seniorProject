import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';

import type { Movie } from '../models/movies';
import type { 
  CreateMovieInput, 
  UpdateMovieInput 
} from '../dto/movies.dto';

import { collections } from '../services/database.services';
import { getTodayDateString } from '../helpers/helpers';


export class MoviesController {
  getMovies = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
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

  getMovieById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { movieId } = matchedData(req, {
        locations: ['params']
      });
      const movie = await collections.movies.findOne({
        _id: new ObjectId(movieId) 
      });
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

  searchByTitle = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { title } = matchedData(req, {
        locations: ['params']
      });
      const escapedTitle = title.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      const movies = await collections.movies
        .find({
          title: {
            $regex: escapedTitle,
            $options: 'i'
          }
        })
        .sort({ title: 1 })
        .toArray();
      if (movies.length === 0) {
        res.status(404).json({
          message:
            `Unable to find a movie with '${title}' in the title`
        });
        return;
      }
      res.status(200).json(movies);
    } catch (error) {
      console.error(
        'Error searching by title', 
        error
      );
      res.status(500).json({ 
        message: 'Error searching by movie title' 
      });
    }
  };

  getNowPlayingMovies = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const today = getTodayDateString();
      const movieRuns = await collections.showtimes
        .aggregate<{
          _id: ObjectId;
          firstShowtime: string;
          lastShowtime: string;
        }>([
          {
            $group: {
              _id: '$movieId',
              firstShowtime: {
                $min: '$date'
              },
              lastShowtime: {
                $max: '$date'
              }
            }
          },
          {
            $match: {
              firstShowtime: {
                $lte: today
              },
              lastShowtime: {
                $gte: today
              }
            }
          }
        ])
        .toArray();
      const movieIds = movieRuns.map(
        movie => movie._id
      );
      const movies = await collections.movies
        .find({
          _id: {
            $in: movieIds
          }
        })
        .sort({ title: 1 })
        .toArray();
      res.status(200).json(movies);
    } catch (error) {
      console.error(
        'Error getting now playing movies:',
        error
      );
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
      const today = getTodayDateString();
      const movieRuns = await collections.showtimes
        .aggregate<{
          _id: ObjectId;
          firstShowtime: string;
        }>([
          {
            $group: {
              _id: '$movieId',
              firstShowtime: {
                $min: '$date'
              },
            }
          },
          {
            $match: {
              firstShowtime: {
                $gt: today
              }
            }
          }
        ])
        .toArray();
      const movieIds = movieRuns.map(
        movie => movie._id
      );
      const movies = await collections.movies
        .find({
          _id: {
            $in: movieIds
          }
        })
        .sort({ title: 1 })
        .toArray();
      res.status(200).json(movies);
    } catch (error) {
      console.error(
        'Error getting coming soon movies:',
        error
      );
      res.status(500).json({
        message: 'Error getting coming soon movies'
      });
    }
  };

  createMovie = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const data = matchedData(req, {
        locations: ['body']
      }) as CreateMovieInput;
      const newMovie: Movie = {
        ...data
      };
      const result = 
        await collections.movies.insertOne(
          newMovie
        );
      res.status(201).json({ 
        message: 'Successfully created a new movie',
        movieId: result.insertedId
      });
    } catch (error) {
      console.error(
        'Error creating movie', 
        error
      );
      res.status(500).json({ 
        message: 'Unable to create movie' 
      });
    }
  };

  updateMovieById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { movieId } = matchedData(req, {
        locations: ['params']
      }); 
      const data = matchedData(req, {
        locations: ['body'] 
      }) as UpdateMovieInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No movie fields provided for update'
        });
        return;
      }
      const updatedMovie: Partial<Movie> = {
        ...data
      };
      const result = 
        await collections.movies.updateOne(
          { 
            _id: new ObjectId(movieId) 
          }, 
          { 
            $set: updatedMovie 
          }
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
      console.error(
        'Error updating movie', 
        error
      );
      res.status(500).json({
        message: 'Unable to update movie'
      });
    }
  };

  deleteMovieById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const { movieId } = matchedData(req, {
        locations: ['params']
      });
      const movieObjectId = 
        new ObjectId(id);
      const existingShowtime = 
        await collections.showtimes.findOne({
          movieId: movieObjectId
        });
      if (existingShowtime) {
        res.status(409).json({
          message:
            'Movie cannot be deleted because it has associated showtimes'
        });
        return;
      }
      const result = 
        await collections.movies.deleteOne({ 
          _id: movieObjectId 
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
      console.error(
        'Error deleting movie', 
        error
      );
      res.status(500).json({
        message: 'Unable to delete movie'
      });
    }
  };
}
