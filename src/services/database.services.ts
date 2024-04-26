// External Dependencies
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';

// Global Variables
export const collections: {
    users?: mongoDB.Collection;
    events?: mongoDB.Collection;
    surveys?: mongoDB.Collection;
    movies?: mongoDB.Collection;
    tickets?: mongoDB.Collection;
    store?: mongoDB.Collection;
} = {};

export const port = process.env.SERVER_PORT || 3000;
export const host = process.env.DEV_HOSTNAME;

// Initialize Connection
export async function connectToDatabase() {
    dotenv.config();
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    const usersCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME);
    const eventsCollection: mongoDB.Collection = db.collection(process.env.EVENTS_COLLECTION_NAME);
    const surveysCollection: mongoDB.Collection = db.collection(process.env.SURVEYS_COLLECTION_NAME);
    const moviesCollection: mongoDB.Collection = db.collection(process.env.MOVIES_COLLECTION_NAME);
    const ticketsCollection: mongoDB.Collection = db.collection(process.env.TICKETS_COLLECTION_NAME);
    const storeCollection: mongoDB.Collection = db.collection(process.env.STORE_COLLECTION_NAME);

    collections.users = usersCollection;
    collections.events = eventsCollection;
    collections.surveys = surveysCollection;
    collections.movies = moviesCollection;
    collections.tickets = ticketsCollection;
    collections.store = storeCollection;

    console.log(`Successfully connected to database: ${db.databaseName}`);
}
