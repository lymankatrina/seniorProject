import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class GenresController {
  async getGenres(req: Request, res: Response) {
    try {
      const genres = await collections.genres.find().toArray();
      res.status(200).send(genres);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getGenresById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const query = { _id: new ObjectId(id) };
      const genre = await collections.genres.findOne(query);
      if (genre) {
        res.status(200).send(genre);
      } else {
        res.status(404).send(`Unable to find a genre with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
  async postGenre(req: Request, res: Response) {
    try {
      const newGenre = req.body;
      const result = await collections.genres.insertOne(newGenre);
      result
        ? res.status(201).send(`Successfully created a new genre with id ${result.insertedId}`)
        : res.status(500).send({ error: 'Failed to create a new genre' });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  }

  async updateById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const updatedGenres = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await collections.genres.updateOne(query, { $set: updatedGenres });

      result ? res.status(200).send(`Successfully updated genre with id ${id}`) : res.status(304).send(`Genre with id: ${id} not updated`);
    } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }

  async deleteById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const query = { _id: new ObjectId(id) };
      const result = await collections.genres.deleteOne(query);
      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed genre with id ${id}`);
      } else if (!result) {
        res.status(400).send(`Failed to remove genre with id ${id}`);
      } else if (!result.deletedCount) {
        res.status(404).send(`Genre with id ${id} does not exist`);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
}
