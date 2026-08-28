import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { SHOWTIME_TYPES } from '../types/showtimeTypes';
import { CUSTOMER_TYPES } from '../types/customerTypes';

export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      'itemType', 
      'showtimeType',
      'customerType',
      'price'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique identifier automatically assigned by mongoDB'
      },
      itemType: {
        bsonType: 'string',
        enum: ['ticket'],
        description: 'Item Type should be ticket'
      },
      showtimeType: {
        bsonType: 'string',
        enum: [...SHOWTIME_TYPES],
        description: 'Must be either standard, premiere, or special'
      },
     customerType: {
        bsonType: 'string',
        enum: [...CUSTOMER_TYPES],
        description: 'Customer type should be adult, child, student, or senior'
      },
      price: {
        bsonType: 'number',
        minimum: 0,
        description: 'Price must be zero or greater'
      }
    }
  };

  const collectionName = 
    process.env.PRICES_COLLECTION_NAME;

    if (!collectionName) {
      throw new Error(
        'PRICES_COLLECTION_NAME environment variable is missing'
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

