import express, { Express } from 'express';
import mongoose, { MongooseError } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || '';

const app: Express = express();

mongoose
  .connect(mongoUrl)
  .then(() => console.log('DBconnection successful'))
  .catch((error: MongooseError) => console.log(error));

app.get('/api/ping', () => {
  console.log('test request is successful');
});

app.listen(port, () => {
  console.log(`API server is up and running at ${port}`);
});
