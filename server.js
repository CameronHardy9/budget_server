const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const api = require('./routes/api');

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', api);

MongoClient.connect(process.env.MONGO_DB_URI, {promiseLibrary: Promise}, (err, client) => {
    if(err) {
        console.error(err)
    }
    app.locals.client = client;
    app.listen(port, () => {
        console.log('Listening on port', port);
    });
});