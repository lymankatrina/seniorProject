import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { CONTENT_STATUSES } from '../types/contentStatuses';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'title',
      'tagline',
      'description',
      'startDate',
      'endDate',
      'startTime',
      'endTime',
      'image',
      'link',
      'type',
      'postStartDate',
      'postEndDate',
      'status'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      title: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' is required and is a string"
      },
      tagline: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 85,
        description: "'title' is required and is a string"
      },
      description: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 850,
        description: "'description' is required and is a string"
      },
      startDate: {
        bsonType: 'date',
        description: "'date' is required and must be in the format YYYY-MM-DD"
      },
      endDate: {
        bsonType: 'date',
        description: "'date' is required and must be in the format YYYY-MM-DD"
      },
      startTime: {
        bsonType: 'string',
        pattern: '^(0?[1-9]|1[02]):[0-5][0-9] (AM|PM)$',
        description: 'Start time must be in hh:mm AM/PM format'
      },
      endTime: {
        bsonType: 'string',
        pattern: '^(0?[1-9]|1[02]):[0-5][0-9] (AM|PM)$',
        description: 'End time must be in hh:mm AM/PM format'
      },
      image: {
        bsonType: 'string',
        description: 'Image must be a url link to a publicly shared image'
      },
      link: {
        bsonType: 'string',
        description: 'Link must be a url link to a shareable source'
      },
      type: {
        bsonType: 'string',
        description: 'type must describe the event type'
      },
      postStartDate: {
        bsonType: 'date',
        description: 'Post Start Date must be valid'
      },
      postEndDate: {
        bsonType: 'date',
        description: 'Post End Date must be valid'
      },
      status: {
        bsonType: 'string',
        enum: [...CONTENT_STATUSES],
        description: 'Status must be Public or Private'
      }
    }
  };

    const collectionName = 
      process.env.EVENTS_COLLECTION_NAME;
  
      if (!collectionName) {
        throw new Error(
          'EVENTS_COLLECTION_NAME environment variable is missing'
        );
      }
  
      const validator = {
        $jsonSchema: jsonSchema
      };
  
      try {
        await db.command({
          collMod: collectionName,
          validator
        });
      } catch (error) {
        if (
          error instanceof mongoDB.MongoServerError &&
          error.codeName === 'NamespaceNotFound'
        ){
          await db.createCollection(
            collectionName,
            { validator }
          );
  
          return;
        }
  
        throw error;
      }
    }
