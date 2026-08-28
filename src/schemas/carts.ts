import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';

import { CUSTOMER_TYPES } from '../types/customerTypes';

export async function applySchemaValidation(
  db: Db
): Promise<void> {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'userId',
      'items',
      'createdAt',
      'updatedAt'
    ],

    additionalProperties: false,
    
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'A unique identifier automatically assigned by mongoDB for a ticket'
      },

      userId: {
        bsonType: 'objectId',
        description: 'ObjectId of the user who owns the cart'
      },

      items: {
        bsonType: 'array',
        description: 'Items currently stored in the shopping cart',

        items: {
          bsonType: 'object',

          required: [
            'itemType',
            'itemId',
            'quantity',
            'addedAt'
          ],

          additionalProperties: false,

          properties: {
            itemType: {
              bsonType: 'string',
              enum: ['ticket', 'product'],
              description: 'Identifies whether the cart item is a ticket or product'
            },

            itemId: {
              bsonType: 'objectId',
              description: 'ObjectId of the ticket or product'
            },

            quantity: {
              bsonType: 'int',
              minimum: 1,
              description: 'Number of this item in the cart'
            },

            addedAt: {
              bsonType: 'date',
              description: 'Date and time the item was added to the cart'
            },

            customerType: {
              bsonType: 'string',
              enum: [...CUSTOMER_TYPES],
              description: 'Customer pricing category for ticket items'
            }
          }
        }
      },

      createdAt: {
        bsonType: 'date',
        description: 'Date and time the cart was created'
      },

      updatedAt: {
        bsonType: 'date',
        description: 'Date and time the cart was last updated'
      }
    }
  };

  const collectionName = 
    process.env.CARTS_COLLECTION_NAME;

    if (!collectionName) {
      throw new Error(
        'CARTS_COLLECTION_NAME environment variable is missing'
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
