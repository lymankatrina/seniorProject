import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { News } from '../models/news';
import type { CreateNewsInput, UpdateNewsInput } from '../dto/news.dto';
import { collections } from '../services/database.services';
import { CONTENT_STATUSES } from '../types/contentStatuses';
import type { ContentStatus } from '../types/contentStatuses';

export class NewsController {
  getActivePublicNews = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const activePublicNews = await collections.news
        .find({ status: 'public', isActive: true })
        .sort({ date: 1 })
        .toArray();
      res.status(200).json(activePublicNews);
    } catch (error) {
      console.error('Error getting active public news:', error);
      res.status(500).json({
        message: 'Error getting active public news'
      });
    }
  };

  getAllNews = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const news = await collections.news
        .find()
        .sort({ date: 1 })
        .toArray();
      res.status(200).json(news);
    } catch (error) {
      console.error('Error getting all news:', error);
      res.status(500).json({
        message: 'Error getting all news'
      });
    }
  };

  getActiveNews = async (
    _req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const activeNews = await collections.news
        .find({ isActive: true })
        .sort({ date: 1 })
        .toArray();
      res.status(200).json(activeNews);
    } catch (error) {
      console.error('Error getting active news:', error);
      res.status(500).json({
        message: 'Error getting active news'
      });
    }
  };

  getNewsByStatus = async (
      req: Request, 
      res: Response
    ): Promise<void> => {
    const { status } = req.params;
    if (typeof status !== 'string' || !status.trim()) {
      res.status(400).json({
        message: 'News status is required'
      });
      return;
    }
    const normalizedStatus = status
      .trim()
      .toLowerCase();
    if (
      !CONTENT_STATUSES.includes(
        normalizedStatus as ContentStatus
      )
    ) {
      res.status(400).json({
        message: 'Invalid news status'
      });
      return;
    }
    try {
      const newsByStatus = await collections.news
        .find({ status: normalizedStatus as ContentStatus })
        .sort({ date: 1 })
        .toArray();
      res.status(200).json(newsByStatus);
    } catch (error) {
      console.error('Error getting news by status:', error);
      res.status(500).json({
        message: 'Error getting news by status'
      });
    }
  };

  getNewsById = async (
      req: Request, 
      res: Response
    ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid news id'
      });
      return;
    }
    try {
      const news = await collections.news.findOne({ _id: new ObjectId(id) });
      if (!news) {
        res.status(404).json({
          message: 'News not found'
        });
        return;
      }
      res.status(200).json(news);
    } catch (error) {
      console.error('Error getting news by ID:', error);
      res.status(500).json({
        message: 'Error getting active news by ID'
      });
    }
  };

  postNews = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    try {
      const data = matchedData(req) as CreateNewsInput;
      const newNews: News = {
        ...data,
        date: new Date(
          `${data.date}T00:00:00.000Z`
        )
      };
      const result = await collections.news.insertOne(newNews);
      res.status(201).json({
        message: 'Successfully created news item',
        newsId: result.insertedId
      });
    } catch (error) {
      console.error('Error creating a news item', error);
      res.status(500).json({
        message: 'Unable to create news item'
      });
    }
  };

  updateNewsById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid news ID'
      });
      return;
    }
    try {
      const data = matchedData(req) as UpdateNewsInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No news item fields provided for update'
        });
        return;
      }
      const {
        date,
        ...newsData
      } = data;
      const updatedNews: Partial<News> = {
        ...newsData,
        ...(date !== undefined && {
          date: new Date(
            `${date}T00:00:00.000Z`
          )
        })
      };
      const result = await collections.news.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedNews }
      );
      if (result.matchedCount === 0) {
        res.status(404).json({
          message: 'News item not found'
        });
        return;
      }
      res.status(200).json({
        message:
        result.modifiedCount > 0
        ? `Successfully updated news item with id ${id}`
        : 'News item is already up to date'
      });
    } catch (error) {
      console.error('Error updating news item', error);
      res.status(500).json({ 
        message: 'Unable to update news item' 
      });
    }
  };

  deleteNewsById = async (
    req: Request, 
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid news item ID'
      });
      return;
    }
    try {
      const newsId = new ObjectId(id);
      const result = await collections.news.deleteOne({ _id: newsId });
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: 'News item not found'
        });
        return;
      }
      res.status(200).json({
        message: 'Successfully deleted news item'
      });
    } catch (error) {
      console.error('Error deleting news item', error);
      res.status(500).json({
        message: 'Unable to delete news item'
      });
    }
  };
}