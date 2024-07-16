// External Dependencies
import * as mongoDB from 'mongodb';
import * as dotenv from 'dotenv';
import Cart from '../models/carts';
import Ticket from '../models/tickets';

// Global Variables
export const collections: {
  users?: mongoDB.Collection;
  events?: mongoDB.Collection;
  news?: mongoDB.Collection;
  surveys?: mongoDB.Collection;
  movies?: mongoDB.Collection;
  tickets?: mongoDB.Collection<Ticket>;
  store?: mongoDB.Collection;
  showtimes?: mongoDB.Collection;
  carts?: mongoDB.Collection<Cart>;
  prices?: mongoDB.Collection;
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
  const newsCollection: mongoDB.Collection = db.collection(process.env.NEWS_COLLECTION_NAME);
  const surveysCollection: mongoDB.Collection = db.collection(process.env.SURVEYS_COLLECTION_NAME);
  const moviesCollection: mongoDB.Collection = db.collection(process.env.MOVIES_COLLECTION_NAME);
  const ticketsCollection: mongoDB.Collection<Ticket> = db.collection(process.env.TICKETS_COLLECTION_NAME);
  const storeCollection: mongoDB.Collection = db.collection(process.env.STORE_COLLECTION_NAME);
  const showtimesCollection: mongoDB.Collection = db.collection(process.env.SHOWTIMES_COLLECTION_NAME);
  const cartsCollection: mongoDB.Collection<Cart> = db.collection(process.env.CARTS_COLLECTION_NAME);
  const pricesCollection: mongoDB.Collection = db.collection(process.env.PRICES_COLLECTION_NAME);

  collections.users = usersCollection;
  collections.events = eventsCollection;
  collections.news = newsCollection;
  collections.surveys = surveysCollection;
  collections.movies = moviesCollection;
  collections.tickets = ticketsCollection;
  collections.store = storeCollection;
  collections.showtimes = showtimesCollection;
  collections.carts = cartsCollection;
  collections.prices = pricesCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
