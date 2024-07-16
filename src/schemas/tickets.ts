import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Ticket from '../models/tickets';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['movieId', 'showtimeId', 'date', 'time', 'status', 'ticketNumber'],
    additionalProperties: false,
    properties: {
      _id: {
        description: 'A unique identifier automatically assigned by mongoDB for a ticket'
      },
      movieId: {
        bsonType: 'string',
        description: 'Movie ID should be the object Id for the movie'
      },
      showtimeId: {
        bsonType: 'string',
        description: 'Showtime ID should be the object Id for the showtime'
      },
      date: {
        bsonType: 'string',
        description: 'Date of movie formatted as YYYY-MM-DD'
      },
      time: {
        bsonType: 'string',
        description: 'Time should be the time the movie begins'
      },
      status: {
        bsonType: 'string',
        enum: ['available', 'reserved', 'sold'],
        default: 'available',
        description: 'Status should be Available, Reserved, or Sold'
      },
      ticketNumber: {
        bsonType: 'number'
      },
      buyerId: {
        bsonType: 'string',
        description: 'BuyerId is the userId of the purchaser and is added to the ticket when the ticket is sold.'
      },
      addedAt: {
        bsonType: 'date',
        default: Date.now,
        description: 'Added at is a date object to record the time tickets are added to a shopping cart.'
      }
    }
  };

  await db
    .command({
      collMod: process.env.TICKETS_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.TICKETS_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
