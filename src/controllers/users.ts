import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class UsersController {
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await collections.users.find().sort({ lastName: 1, firstName: 1 }).toArray();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(404).send(`No users found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getCurrentUserAdminStatus = async (req: Request, res: Response): Promise<void> => {
    if (!req.oidc.isAuthenticated()) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const userEmail = req.oidc.user.email;

    try {
      const user = await collections.users?.findOne({ email: userEmail });

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Error fetching user admin status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };
  
  getUsersById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);
      const user = await collections.users.findOne({ _id: userId });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send(`Unable to find a user with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getAllEmails = async () => {
    try {
      const emails = await collections.users.find({}, { projection: { email: 1 } }).toArray();
      return emails;
    } catch (error) {
      return error.message;
    }
  };

  getUserByEmail = async (userEmail: string) => {
    try {
      const result = await collections.users.findOne({ email: userEmail });
      return result;
    } catch (error) {
      console.log('error getting user email');
    }
  };

  getByEmail = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params;
    try {
      const user = await collections.users.findOne({ email: email });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send(`Unable to find a user with email: ${email}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  postUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = req.body;
      const result = await collections.users.insertOne(newUser);
      if (result.acknowledged) {
        res.status(201).send(`Successfully created a new user with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a new user' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedUser = req.body;
      const userId = new ObjectId(id);
      const result = await collections.users.updateOne({ _id: userId }, { $set: updatedUser });
      if (result.matchedCount === 0) {
        res.status(404).send(`User with id: ${id} not found`);
      } else if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated user with id ${id}`);
      } else {
        res.status(304).send(`User with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const userId = new ObjectId(id);
      const result = await collections.users.deleteOne({ _id: userId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed user with id ${id}`);
      } else {
        res.status(404).send(`User with id ${id} does not exist`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
