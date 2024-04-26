import express, { Express } from 'express';
import mongoose, { MongooseError } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { router as userRoute } from './routes/user';
import { router as authRoute } from './routes/auth';
import { router as productRoute } from './routes/product';
import { router as orderRoute } from './routes/order';
import { router as cartRoute } from './routes/cart';
import { router as checkoutRoute } from './routes/stripe';

dotenv.config();

const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || '';

const app: Express = express();

mongoose
  .connect(mongoUrl)
  .then(() => console.log('DBconnection successful'))
  .catch((error: MongooseError) => console.log(error));

app.use(express.json());
app.use(cors());
app.use('/api/auth/', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/carts', cartRoute);
app.use('/api/checkout', checkoutRoute);

app.listen(port, () => {
  console.log(`API server is up and running at ${port}`);
});
