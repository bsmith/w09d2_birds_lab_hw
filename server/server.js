import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { MongoClient } from 'mongodb';

import createRouter from './helpers/create_router.js';

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(json());

MongoClient.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true })
  .then((client) => {
    const db = client.db('birds');
    const sightingsCollection = db.collection('sightings');
    const sightingsRouter = createRouter(sightingsCollection);
    app.use('/api/sightings', sightingsRouter);
  })
  .catch(console.err);

app.listen(9000, function () {
  console.log(`Listening on port ${ this.address().port }`);
});
