const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const OtherBook = require('../models/OtherBook');
const mongoose = require('mongoose');
const path = require('path');

// Route for the homepage
router.get('/', async (req, res) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/bookstore-inventory');
    console.log('Connected to MongoDB');

    // Fetch all books from the database
    const books = await OtherBook.find();

    // Return the fetched books as JSON response
    res.render('index', { otherBooks: books });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to render books by language
router.get('/language/:language', async (req, res) => {
  const language = req.params.language.toLowerCase();
  try {
    // Filter OtherBook data by language
    const books = await OtherBook.find({ language: { $regex: new RegExp('^' + language, 'i') } });
    console.log("Language:", language);
    

    // Render the template with filtered data
    res.render('index', { category: language.toUpperCase(), otherBooks: books });
  } catch (err) {
    console.error('Error fetching books by language:', err);
    res.status(500).json({ message: 'Error fetching books by language' });
  }
});

// Route to fetch all books
router.get('/novels', async (req, res) => {
  try {
     //Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/bookstore-inventory');
    console.log('Connected to MongoDB');

    // Fetch all books from the database
    const books = await OtherBook.find();

    // Return the fetched books as JSON response
    res.render('index', { otherBooks: books });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

//Route to render the book details page
router.get('/book/:number', async (req, res) => {
  const bookNumber = req.params.number;
  try {
    // Retrieve the book from the database based on the index provided in the URL
    const book = await OtherBook.findOne().skip(bookNumber - 1).limit(1);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    // Render the book details page with the book data
    res.render('book', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the book details page
router.get('/book/:category/:number', async (req, res) => {
  const category = req.params.category;
  console.log('Category', category);
  const bookNumber = req.params.number;
  try {
    // Retrieve the books for the specified category from the database with case-insensitive comparison
    const books = await OtherBook.find({ language: { $regex: new RegExp('^' + category + '$', 'i') } });

    // Check if any books are found for the category
    if (books.length === 0) {
      return res.status(404).send('No books found for the specified category');
    }

    // Check if the requested book number is within the range of the books for the category
    if (bookNumber <= 0 || bookNumber > books.length) {
      return res.status(404).send('Book not found');
    }

    // Retrieve the book based on the index within the subset of books for the category
    const book = books[bookNumber - 1];

    // Render the book details page with the book data
    res.render('book', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/new-book', async (req, res) => {
  try {
    // Fetch the list of languages from wherever they are stored
    const languages = ["English", "French", "Italian", "German", "Spanish", "Greek", "Portuguese", "Japanese", "Norwegian", "Arabic"];

    // Render the add book form and pass the languages data
    res.render('add_book', { book: {}, languages });
  } catch (error) {
    // Handle error
    console.error('Error:', error);
    res.status(500).json({ message: 'Error rendering add book form' });
  }
});


// Route to handle form submission and add book to the database
router.post('/new-book', async (req, res) => {
  const { author, country, imageLink, language, link, pages, title, year } = req.body;
  const newBook = new OtherBook({ author, country, imageLink, language, link, pages, title, year });
  try {
      await newBook.save();
      res.redirect('/'); // Redirect to the homepage after adding the book
  } catch (err) {
      console.error(err);
      res.status(500).send('Error adding book');
  }
});

// Route to render the add book form
router.get('/update-book', async (req, res) => {
  try {
      // Check if book ID is provided in the query params
      const bookId = req.query.id;
      let book;
      if (bookId) {
          // If book ID is provided, fetch the book from the database
          book = await OtherBook.findById(bookId);
      }
      const languages = ["English", "French", "Italian", "German", "Spanish", "Greek", "Portuguese", "Japanese","Norwegian","Arabic"];
      // Render the add book form and pass the book data if available
      res.render('add_book', { book, languages });
  } catch (error) {
      // Handle error
      console.error('Error:', error);
      res.status(500).json({ message: 'Error rendering add book form' });
  }
});

module.exports = router;
