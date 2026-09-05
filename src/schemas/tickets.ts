import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { TICKET_STATUSES } from '../types/ticketStatuses';
import { getEnv } from '../config/env';

export async function applySchemaValidation(
  db: Db
): Promise<void> {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'movieId', 
      'showtimeId',
      'seatId',
      'date', 
      'time', 
      'status'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique identifier automatically assigned by MongoDB'
      },
      movieId: {
        bsonType: 'objectId',
        description: 'Movie ID must be the object Id of the movie'
      },
      showtimeId: {
        bsonType: 'objectId',
        description: 'Showtime ID must be the object Id of the showtime'
      },
      seatId: {
        bsonType: 'objectId',
        description: 'Seat ID must be the ObjectId of the physical seat'
      },
      date: {
        bsonType: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'Date must be in YYYY-MM-DD format'
      },
      time: {
        bsonType: 'string',
        pattern: '^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$',
        description: 'Time should be the time the movie begins'
      },
      status: {
        bsonType: 'string',
        enum: [...TICKET_STATUSES],
        description: 'Status should be a valid ticket status'
      },
      buyerId: {
        bsonType: 'string',
        description: 'Auth0 user ID of the buyer'
      },
      addedAt: {
        bsonType: 'date',
        description: 'Date and time the ticket was reserved'
      }
    }
  };

  const collectionName = getEnv('TICKETS_COLLECTION_NAME');
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
    } else {
      throw error;
    }
  }
  await db.collection(collectionName).createIndex(
    {
      showtimeId: 1,
      date: 1,
      seatId: 1
    },
    {
      unique: true
    }
  );
}
