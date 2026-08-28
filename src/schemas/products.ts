import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { PRODUCT_TYPES } from '../types/productTypes';
import { PRODUCT_STATUSES } from '../types/productStatuses';


export async function applySchemaValidation(db: Db) {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id', 
      'name', 
      'description', 
      'productType', 
      'priceInCents',
      'inventory',
      'image',
      'status'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId'
      },
      name: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 100
      },
      description: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 500
      },
      productType: {
        bsonType: 'string',
        enum: [...PRODUCT_TYPES]
      },
      priceInCents: {
        bsonType: 'int',
        minimum: 0
      },
      inventory: {
        bsonType: 'int',
        minimum: 0
      },
      image: {
        bsonType: 'string'
      },
      status: {
        bsonType: 'string',
        enum: [...PRODUCT_STATUSES]
      }
    }
  };

    const collectionName = 
      process.env.PRODUCTS_COLLECTION_NAME;
  
      if (!collectionName) {
        throw new Error(
          'PRODUCTS_COLLECTION_NAME environment variable is missing'
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
  
