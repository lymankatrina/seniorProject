import * as mongoDB from 'mongodb';
import { Db } from 'mongodb';
import { getEnv } from '../config/env';
import { SECTION_TYPES } from '../types/section';

export async function applySchemaValidation(
  db: Db
): Promise<void> {
  const jsonSchema = {
    bsonType: 'object',
    required: [
      '_id',
      'seat',
      'row',
      'section'
    ],
    additionalProperties: false,
    properties: {
      _id: {
        bsonType: 'objectId',
        description: 'Unique identifier automatically assigned by MongoDB'
      },
      seat: {
        bsonType: 'int',
        minimum: 1,
        maximum: 20,
        description: 'Seat must be a number between 1 and 20'
      },
      row: {
        bsonType: 'string',
        minLength: 1,
        maxLength: 1,
        pattern: '^[A-Z]$',
        description: 'Row must be a single uppercase letter'
      },
      section: {
        bsonType: 'string',
        enum: [...SECTION_TYPES],
        description: 'Must be a valid section'
      }
    }
  };
  const collectionName = getEnv('SEATS_COLLECTION_NAME');
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
      section: 1,
      row: 1,
      seat: 1
    },
    {
      unique: true
    }
  );
}
