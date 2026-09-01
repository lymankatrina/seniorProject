import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { matchedData } from 'express-validator';
import type { Survey } from '../models/surveys';
import type { CreateSurveyInput, UpdateSurveyInput } from '../dto/surveys.dto';
import { collections } from '../services/database.services';

export class SurveysController {
  getSurveys = async (_req: Request, res: Response): Promise<void> => {
    try {
      const surveys = await collections.surveys
        .find()
        .toArray();
      res.status(200).json(surveys);
    } catch (error) {
      console.error('Error getting surveys:', error);
      res.status(500).json({
        message: 'Error getting surveys'
      });
    }
  };

  getActiveSurveys = async (_req: Request, res: Response): Promise<void> => {
    try {
      const activeSurveys = await collections.surveys
        .find({ isActive: true })
        .toArray();
      res.status(200).json(activeSurveys);
    } catch (error) {
      console.error('Error getting active surveys', error);
      res.status(500).send({
        message: 'Error getting active surveys'
      });
    }
  };

  getSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid survey ID'
      });
      return;
    }
    try {
      const survey = await collections.surveys.findOne({ 
        _id: new ObjectId(id) 
      });
      if (!survey) {
        res.status(404).json({
          message: `Unable to find a survey with id: ${id}`
        });
        return;
      }
      res.status(200).json(survey);
    } catch (error) {
      console.error('Error getting survey by ID:', error);
      res.status(500).json({
        message: 'Error getting survey by ID'
      });
    }
  };

  createSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = matchedData(req) as CreateSurveyInput;
      const newSurvey: Survey = {
        ...data
      };
      const result = await collections.surveys.insertOne(newSurvey);
      res.status(201).json({
        message: 'Successfully created new survey',
        surveyId: result.insertedId
      });
    } catch (error) {
      console.error('Error creating a new survey:', error);
      res.status(500).json({ 
        message: 'Error creating a new survey' 
      });
    }
  };

  updateSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid survey ID'
      });
      return;
    }
    try {
      const data = matchedData(req) as UpdateSurveyInput;
      if (Object.keys(data).length === 0) {
        res.status(400).json({
          message: 'No survey item fields provided for update'
        });
        return;
      }
      const updatedSurvey: Partial<Survey> = {
        ...data
      };
      const result = await collections.surveys.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: updatedSurvey }
      );
      if (result.matchedCount === 0) {
        res.status(404).json({
          message: 'Survey not found'
        });
        return;
      }
      res.status(200).json({
        message:
        result.modifiedCount > 0
        ? `Successfully updated survey with id ${id}`
        : 'Survey is already up to date'
      });
    } catch (error) {
      console.error('Error updating survey', error);
      res.status(500).json({
        message: 'Error updating survey'
      });
    }
  };

  deleteSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (typeof id !== 'string' || !ObjectId.isValid(id)) {
      res.status(400).json({
        message: 'Invalid survey ID'
      });
      return;
    }
    try {
      const surveyId = new ObjectId(id);
      const result = await collections.surveys.deleteOne({ _id: surveyId });
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: `Survey with id ${id} not found.`
        });
        return;
      }
      res.status(200).json({
        message: 'Successfully deleted survey'
      });
    } catch (error) {
      console.error('Error deleting survey:', error);
      res.status(500).json({
        message: 'Error deleting survey'
      });
    }
  };
}
