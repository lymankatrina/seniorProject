import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { collections } from '../services/database.services';

export class SurveysController {
  getSurveys = async (req: Request, res: Response): Promise<void> => {
    try {
      const surveys = await collections.surveys.find().toArray();
      if (surveys.length > 0) {
        res.status(200).json(surveys);
      } else {
        res.status(404).send(`No surveys found`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getActiveSurveys = async (req: Request, res: Response): Promise<void> => {
    try {
      const activeSurveys = await collections.surveys.find({ isActive: true }).toArray();
      if (activeSurveys.length > 0) {
        res.status(200).json(activeSurveys);
      } else {
        res.status(404).send(`Unable to find any active surveys.`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  getSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const surveyId = new ObjectId(id);
      const survey = await collections.surveys.findOne({ _id: surveyId });
      if (survey) {
        res.status(200).json(survey);
      } else {
        res.status(404).send(`Unable to find a survey with id: ${id}`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  createSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
      const newSurvey = req.body;
      const result = await collections.surveys.insertOne(newSurvey);
      if (result.acknowledged) {
        res.status(201).send(`Successfully created a new survey with id ${result.insertedId}`);
      } else {
        res.status(500).send({ error: 'Failed to create a new survey' });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  updateSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const surveyId = new ObjectId(id);
      const updatedSurvey = req.body;
      const result = await collections.surveys.updateOne({ _id: surveyId }, { $set: updatedSurvey });
      if (result.modifiedCount > 0) {
        res.status(200).send(`Successfully updated survey with id ${id}`);
      } else {
        res.status(304).send(`Survey with id: ${id} not updated`);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  deleteSurveyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      if (!ObjectId.isValid(id)) {
        res.status(400).send('Invalid survey ID.');
      }
      const surveyId = new ObjectId(id);
      const result = await collections.surveys.deleteOne({ _id: surveyId });
      if (result.deletedCount === 1) {
        res.status(202).send(`Successfully removed survey with id ${id}`);
      } else {
        res.status(404).send(`Survey with id ${id} does not exist.`);
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}
