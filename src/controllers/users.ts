import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class UsersController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await collections.users.find().toArray();
      res.status(200).send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getUsersById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const query = { _id: new ObjectId(id) };
      const user = await collections.users.findOne(query);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send(`Unable to find a user with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getAllEmails() {
    try {
      const emails = await collections.users.find({}, { projection: { email: 1 } }).toArray();
      return emails;
    } catch (error) {
      return error.message;
    }
  }

  async getUserByEmail(userEmail: string) {
    try {
      const result = await collections.users.findOne({ email: userEmail });
      return result;
    } catch (error) {
      console.log('error getting user email');
    }
  }

  async getByEmail(req: Request, res: Response) {
    const email = req.params.email;
    try {
      const user = await collections.users.findOne({ email: email });
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send(`Unable to find a user with email: ${email}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async postUsers(req: Request, res: Response) {
    try {
      const newUser = req.body;
      const result = await collections.users.insertOne(newUser);
      result
        ? res.status(201).send(`Successfully created a new user with id ${result.insertedId}`)
        : res.status(500).send({ error: 'Failed to create a new user' });
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: error.message });
    }
  }

  async updateById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const updatedUser = req.body;
      const query = { _id: new ObjectId(id) };
      const result = await collections.users.updateOne(query, { $set: updatedUser });

      result ? res.status(200).send(`Successfully updated user with id ${id}`) : res.status(304).send(`User with id: ${id} not updated`);
    } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }

  async deleteById(req: Request, res: Response) {
    const id = req?.params?.id;
    try {
      const query = { _id: new ObjectId(id) };
      const result = await collections.users.deleteOne(query);
      if (result && result.deletedCount) {
        res.status(202).send(`Successfully removed user with id ${id}`);
      } else if (!result) {
        res.status(400).send(`Failed to remove user with id ${id}`);
      } else if (!result.deletedCount) {
        res.status(404).send(`User with id ${id} does not exist`);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
}
