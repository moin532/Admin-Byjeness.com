const express = require('express');
const app = express();
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors())
app.set('trust proxy',1);


//Routes import
const Product = require('./modules/MainRouter');

//acessing routes
app.use('/api/v1',Product)

module.exports = app
