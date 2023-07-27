/// <reference path="./index.d.ts" />

import express from 'express';
import morgan from 'morgan';
import routes from './routes';
import { CLIENT_ORIGIN_URL, MONGO_URI, PORT } from './env';
import cors from 'cors';
import { connect } from 'mongoose';

const app = express();
app.use(morgan('short'));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.get('/health', (req, res) => {
  return res.json({ message: 'epic' });
});

connect(MONGO_URI)
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server listening at ${PORT}`);
      console.log({CLIENT_ORIGIN_URL});
    });
  })
  .catch((err) => {
    console.log('Error while connecting to MongoDB');
    console.error(err.message);
    process.exit(1);
  });
app.use(routes);
