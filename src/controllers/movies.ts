import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class MoviesController {
  async getMovies(req: Request, res: Response) {
    try {
      const movies = await collections.movies
        .aggregate([
          {
            $lookup: {
              from: 'genres',
              let: { genreIds: '$genres' },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ['$_id', '$$genreIds'] }
                  }
                },
                {
                  $project: { _id: 0, genre: 1 }
                }
              ],
              as: 'genresData'
            }
          },
          {
            $addFields: {
              genres: '$genresData.genre'
            }
          },
          {
            $project: {
              genresData: 0
            }
          }
        ])
        .toArray();

      res.status(200).send(movies);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getNowPlaying(req: Request, res: Response) {
    let date = new Date();
    const currentDate = date.toISOString().slice(0, 10);
    try {
      const movies = await collections.movies
        .aggregate([
          {
            $match: {
              $or: [{ startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, { startDate: currentDate }, { endDate: currentDate }]
            }
          },
          {
            $lookup: {
              from: 'genres',
              let: { genreIds: '$genres' },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ['$_id', '$$genreIds'] }
                  }
                },
                {
                  $project: { _id: 0, genre: 1 }
                }
              ],
              as: 'genresData'
            }
          },
          {
            $addFields: {
              genres: '$genresData.genre'
            }
          },
          {
            $project: {
              genresData: 0
            }
          }
        ])
        .toArray();
      if (movies.length > 0) {
        res.status(200).send(movies);
      } else {
        res.status(404).send(`Unable to find a movie playing on ${currentDate}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getComingSoon(req: Request, res: Response) {
    let date = new Date();
    const currentDate = date.toISOString().slice(0, 10);
    try {
      const movies = await collections.movies
        .aggregate([
          {
            $match: {
              startDate: { $gt: currentDate },
              endDate: { $gt: currentDate },
              isActive: true
            }
          },
          {
            $lookup: {
              from: 'genres',
              let: { genreIds: '$genres' },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ['$_id', '$$genreIds'] }
                  }
                },
                {
                  $project: { _id: 0, genre: 1 }
                }
              ],
              as: 'genresData'
            }
          },
          {
            $addFields: {
              genres: '$genresData.genre'
            }
          },
          {
            $project: {
              genresData: 0
            }
          }
        ])
        .toArray();
      if (movies.length > 0) {
        res.status(200).send(movies);
      } else {
        res.status(404).send(`Unable to find any movies coming soon`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getMoviesById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const query = { _id: new ObjectId(id) };
      const movie = await collections.movies.findOne(query);
      if (movie) {
        res.status(200).send(movie);
      } else {
        res.status(404).send(`Unable to find a movie with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getByTitle(req: Request, res: Response) {
    const title = req.params.title;
    try {
      const movie = await collections.movies.findOne({ title: title });
      if (movie) {
        res.status(200).send(movie);
      } else {
        res.status(404).send(`Unable to find a movie with title: ${title}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async postMovie(req: Request, res: Response) {
    try {
      const newMovie = req.body;
      const result = await collections.movies.insertOne(newMovie);
      result
        ? res.status(201).send(`Successfully created a new movie with id ${result.insertedId}`)
        : res.status(500).send({ error: 'Failed to create a new movie' });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  }

  async updateById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const updatedMovie = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await collections.movies.updateOne(query, { $set: updatedMovie });

      result ? res.status(200).send(`Successfully updated movie with id ${id}`) : res.status(304).send(`Movie with id: ${id} not updated`);
    } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }

  async deleteById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const query = { _id: new ObjectId(id) };
      const result = await collections.movies.deleteOne(query);
      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed movie with id ${id}`);
      } else if (!result) {
        res.status(400).send(`Failed to remove movie with id ${id}`);
      } else if (!result.deletedCount) {
        res.status(404).send(`Movie with id ${id} does not exist`);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
}
