// External Dependencies
import * as mongoDB from 'mongodb';

import User from '../models/users';
import { Event } from '../models/events';
import { News } from '../models/news';
import { Survey } from '../models/surveys';
import { Movie } from '../models/movies';
import { Ticket } from '../models/tickets';
import { Seat } from '../models/seats';
import { Showtime } from '../models/showtimes';
import { Cart } from '../models/carts';
import Price from '../models/prices';
import Order from '../models/orders';
import Product from '../models/products';

import { getEnv } from '../config/env';
import { COLLECTION_NAMES } from '../config/collectionNames';

interface Collections {
  users: mongoDB.Collection<User>;
  events: mongoDB.Collection<Event>;
  news: mongoDB.Collection<News>;
  surveys: mongoDB.Collection<Survey>;
  movies: mongoDB.Collection<Movie>;
  tickets: mongoDB.Collection<Ticket>;
  seats: mongoDB.Collection<Seat>;
  showtimes: mongoDB.Collection<Showtime>;
  carts: mongoDB.Collection<Cart>;
  prices: mongoDB.Collection<Price>;
  orders: mongoDB.Collection<Order>;
  products: mongoDB.Collection<Product>;
}
// Global Variables
export let collections: Collections;
export let mongoClient: mongoDB.MongoClient;

export async function connectToDatabase(): Promise<void> {
  const connectionString = getEnv('DB_CONN_STRING');
  const databaseName = getEnv('DB_NAME');

  mongoClient = new mongoDB.MongoClient(
    connectionString
  );

  await mongoClient.connect();

  const db = mongoClient.db(databaseName);

  collections = {
    users: db.collection<User>(COLLECTION_NAMES.users),
    events: db.collection<Event>(COLLECTION_NAMES.users),
    news: db.collection<News>(COLLECTION_NAMES.users),
    surveys: db.collection<Survey>(COLLECTION_NAMES.users),
    movies: db.collection<Movie>(COLLECTION_NAMES.users),
    tickets: db.collection<Ticket>(COLLECTION_NAMES.users),
    seats: db.collection<Seat>(COLLECTION_NAMES.users),
    showtimes: db.collection<Showtime>(COLLECTION_NAMES.users),
    carts: db.collection<Cart>(COLLECTION_NAMES.users),
    prices: db.collection<Price>(COLLECTION_NAMES.users),
    orders: db.collection<Order>(COLLECTION_NAMES.users),
    products: db.collection<Product>(COLLECTION_NAMES.users)
  };

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
