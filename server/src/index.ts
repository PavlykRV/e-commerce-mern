import { MongooseError } from 'mongoose';

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('DBconnection successful'))
  .catch((error: MongooseError) => console.log(error));

app.get('/api/ping', () => {
  console.log('test request is successful');
});

app.listen(port, () => {
  console.log(`API server is up and running at ${port}`);
});
