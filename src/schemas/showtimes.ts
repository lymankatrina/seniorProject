import * as mongoDB from 'mongodb';
import type { Db } from 'mongodb';
import { SHOWTIME_TYPES } from '../types/showtimeTypes';
import { getEnv } from '../config/env';

export async function applySchemaValidation(
  db: Db
): Promise<void> {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id', 
      'movieId', 
      'startDate', 
      'endDate', 
      'time', 
      'showtimeType', 
      'seatCapacity'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      movieId: {
        bsonType: 'objectId',
        description: 'Movie ID should be the object Id for the movie'
      },
      startDate: {
        bsonType: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'Start Date must be in YYYY-MM-DD format'
      },
      endDate: {
        bsonType: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'End Date must be in YYYY-MM-DD format'
      },
      time: {
        bsonType: 'string',
        pattern: '^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$',
        description: 'Enter start time in the hh:mm AM/PM format'
      },
      showtimeType: {
        bsonType: 'string',
        enum: [...SHOWTIME_TYPES],
        description: 'Must be a valid showtime type'
      },
      seatCapacity: {
        bsonType: 'int',
        minimum: 1,
        maximum: 225,
        description: 'Seat Capacity should be between 1 and 225'
      },
    }
  };
  const collectionName = getEnv('SHOWTIMES_COLLECTION_NAME');
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
