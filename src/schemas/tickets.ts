import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { TICKET_STATUSES } from '../types/ticketStatuses';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['movieId', 'showtimeId', 'date', 'time', 'status', 'ticketNumber'],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      movieId: {
        bsonType: 'objectId',
        description: 'Movie ID must be the object Id of the movie'
      },
      showtimeId: {
        bsonType: 'objectId',
        description: 'Showtime ID must be the object Id of the showtime'
      },
      date: {
        bsonType: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        description: 'Date must be in YYYY-MM-DD format'
      },
      time: {
        bsonType: 'string',
        pattern: '^(0?[1-9]|1[0-2]:[0-5][0-9] (AM|PM)$',
        description: 'Time should be the time the movie begins'
      },
      status: {
        bsonType: 'string',
        enum: [...TICKET_STATUSES],
        description: 'Status should be available, reserved, or sold'
      },
      ticketNumber: {
        bsonType: 'int',
        minimum: 1,
        description: 'Ticket number must be a positive integer'
      }
    }
  };

    const collectionName = 
      process.env.TICKETS_COLLECTION_NAME;
  
      if (!collectionName) {
        throw new Error(
          'TICKETS_COLLECTION_NAME environment variable is missing'
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
  
