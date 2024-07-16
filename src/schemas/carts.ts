import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Cart from '../models/carts';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['userId'],
    additionalProperties: false,
    properties: {
      _id: {
        description: 'A unique identifier automatically assigned by mongoDB for a ticket'
      },
      userId: {
        bsonType: 'string',
        description: 'User ID is pulled from Auth0 params'
      },
      tickets: [
        {
          ticketId: {
            type: 'string',
            description: 'Ticket ID is the object Id for the ticket'
          },
          addedAt: {
            type: 'date',
            default: Date.now
          },
          priceType: {
            type: 'string'
          }
        }
      ],
      createdAt: {
        bsonType: 'date',
        default: Date.now
      },
      updatedAt: {
        bsonType: 'date',
        default: Date.now
      }
    }
  };

  await db
    .command({
      collMod: process.env.CARTS_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.CARTS_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
