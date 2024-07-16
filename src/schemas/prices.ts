import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import Price from '../models/prices';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: ['type', 'price'],
    additionalProperties: false,
    properties: {
      _id: {
        description: 'A unique identifier automatically assigned by mongoDB for a ticket'
      },
      type: {
        bsonType: 'string',
        enum: ['adult', 'child', 'student', 'senior'],
        default: 'adult',
        description: 'Type should be Adult, Child, Student, or Senior'
      },
      price: {
        bsonType: 'number'
      }
    }
  };

  await db
    .command({
      collMod: process.env.PRICES_COLLECTION_NAME,
      validator: jsonSchema
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(process.env.PRICES_COLLECTION_NAME, { validator: jsonSchema });
      }
    });
}
