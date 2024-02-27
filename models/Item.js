const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  imageLink: {
    type: String
  },
  language: {
    type: String
  },
  link: {
    type: String
  },
  pages: {
    type: Number
  },
  title: {
    type: String,
    required: true
  },
  year: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema);
