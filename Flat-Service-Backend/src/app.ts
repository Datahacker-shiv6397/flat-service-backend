import 'express-async-errors';

import cors from 'cors';
import * as dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';
import express, { json } from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { verifyJWT } from './middlewares/authMiddleware';
import authRoute from './routes/auth';
import userRoute from './routes/handleUser';
import inspectionRoute from './routes/inspections';
import propertyRoute from './routes/properties';

dotenv.config();

const app = express();

app.use(json());
app.use(helmet());
app.use(cors());

app.use('/auth', authRoute);
app.use(verifyJWT);
app.use('/user', userRoute);
app.use('/property', propertyRoute);
app.use('/inspection', inspectionRoute);

app.get('/', (_, res) => {
  res.json({
    msg: 'Welcome to FlatService',
  });
});

// app.use((_, res, _2) => {
//   res.status(404).json({ error: 'NOT FOUND' });
// });

mongoose.connect(process.env.MONGO_URI as string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection failed'));
db.once('open', async () => {
  console.log('Database conencted successfully!');
});
mongoose.set('strictQuery', true);

export { app };
