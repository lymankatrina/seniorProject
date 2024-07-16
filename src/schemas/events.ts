import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Event from '../models/events';

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
      _id: {},
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
        description: 'Start time is required and should be valid'
      },
      endTime: {
        bsonType: 'string',
        description: 'End time is required and should be valid'
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
        enum: ['Public', 'Private'],
        description: 'Status must be Public or Private'
      }
    }
  };

  await db
    .command({
      collMod: process.env.EVENTS_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.EVENTS_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
