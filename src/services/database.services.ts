// External Dependencies
import * as mongoDB from 'mongodb';

import User from '../models/users';
import Event from '../models/events';
import News from '../models/news';
import Survey from '../models/surveys';
import { Movie } from '../models/movies';
import Ticket from '../models/tickets';
import Showtime from '../models/showtimes';
import Cart from '../models/carts';
import Price from '../models/prices';
import Order from '../models/orders';
import Product from '../models/products';

import { getEnv } from '../config/env';

interface Collections {
  users: mongoDB.Collection<User>;
  events: mongoDB.Collection<Event>;
  news: mongoDB.Collection<News>;
  surveys: mongoDB.Collection<Survey>;
  movies: mongoDB.Collection<Movie>;
  tickets: mongoDB.Collection<Ticket>;
  showtimes: mongoDB.Collection<Showtime>;
  carts: mongoDB.Collection<Cart>;
  prices: mongoDB.Collection<Price>;
  orders: mongoDB.Collection<Order>;
  products: mongoDB.Collection<Product>;
}
// Global Variables
export let collections: Collections;

export async function connectToDatabase(): Promise<void> {
  const connectionString = getEnv('DB_CONN_STRING');
  const databaseName = getEnv('DB_NAME');

  const client = new mongoDB.MongoClient(connectionString);

  await client.connect();

  const db = client.db(databaseName);

  collections = {
    users: db.collection<User>(getEnv('USERS_COLLECTION_NAME')),
    events: db.collection<Event>(getEnv('EVENTS_COLLECTION_NAME')),
    news: db.collection<News>(getEnv('NEWS_COLLECTION_NAME')),
    surveys: db.collection<Survey>(getEnv('SURVEYS_COLLECTION_NAME')),
    movies: db.collection<Movie>(getEnv('MOVIES_COLLECTION_NAME')),
    tickets: db.collection<Ticket>(getEnv('TICKETS_COLLECTION_NAME')),
    showtimes: db.collection<Showtime>(getEnv('SHOWTIMES_COLLECTION_NAME')),
    carts: db.collection<Cart>(getEnv('CARTS_COLLECTION_NAME')),
    prices: db.collection<Price>(getEnv('PRICES_COLLECTION_NAME')),
    orders: db.collection<Order>(getEnv('ORDERS_COLLECTION_NAME')),
    products: db.collection<Product>(getEnv('PRODUCTS_COLLECTION_NAME'))
  };

  console.log(`Successfully connected to database: ${db.databaseName}`);
}
