import express, { Express } from 'express';
import mongoose, { MongooseError } from 'mongoose';
import dotenv from 'dotenv';
import { router as userRoute } from './routes/user';
import { router as authRoute } from './routes/auth';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || '';

const app: Express = express();

mongoose
  .connect(mongoUrl)
  .then(() => console.log('DBconnection successful'))
  .catch((error: MongooseError) => console.log(error));

app.use(express.json());
app.use('/api/users', userRoute);
app.use('/api/auth/', authRoute);

app.listen(port, () => {
  console.log(`API server is up and running at ${port}`);
});
