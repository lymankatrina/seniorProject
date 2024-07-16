import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class NewsController {
  getActivePublicNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const activePublicNews = await collections.news.find({ status: 'public', isActive: true }).sort({ date: 1 }).toArray();
      if (activePublicNews.length > 0) {
        res.status(200).json(activePublicNews);
      } else {
        res.status(404).send(`Unable to find any current public news items.`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getAllNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const news = await collections.news.find().sort({ date: 1 }).toArray();
      if (news.length > 0) {
        res.status(200).json(news);
      } else {
        res.status(400).send(`No news found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getActiveNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const activeNews = await collections.news.find({ isActive: true }).sort({ date: 1 }).toArray();
      if (activeNews.length > 0) {
        res.status(200).json(activeNews);
      } else {
        res.status(404).send(`Unable to find any active news items`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getNewsByStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.params;
    try {
      const newsByStatus = await collections.news.find({ status: status.toLowerCase() }).sort({ date: 1 }).toArray();
      if (newsByStatus.length > 0) {
        res.status(200).json(newsByStatus);
      } else {
        res.status(404).send(`Unable to find any ${status} news items.`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getNewsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const newsId = new ObjectId(id);
      const news = await collections.news.findOne({ _id: newsId });
      if (news) {
        res.status(200).json(news);
      } else {
        res.status(404).send(`Unable to find any news with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  postNews = async (req: Request, res: Response): Promise<void> => {
    try {
      const newNews = req.body;
      const result = await collections.news.insertOne(newNews);
      if (result.acknowledged) {
        res.status(201).send(`Successfully created a news item with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a news event' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateNewsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedNews = req.body;
      const newsId = new ObjectId(id);
      const result = await collections.news.updateOne({ _id: newsId }, { $set: updatedNews });

      if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated news item with id ${id}`);
      } else {
        res.status(304).send(`News item with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  deleteNewsById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const newsId = new ObjectId(id);
      const result = await collections.news.deleteOne({ _id: newsId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed news item with id ${id}`);
      } else {
        res.status(404).send(`News item with id ${id} does not exist`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
