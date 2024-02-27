const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const indexRouter = require('./routes/index');

const app = express();

// Set EJS as the default view engine
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/bookstore-inventory');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
