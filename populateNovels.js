// populateNovels.js
// skroz ignore
// Import the Item and Category models
const Item = require('./models/Item');
const Category = require('./models/Category');

// Example data for novels
const novelsData = [
  { name: 'To Kill a Mockingbird', author: 'Harper Lee', price: 10 },
  { name: '1984', author: 'George Orwell', price: 12 },
  { name: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 8 },
  // Add more novels as needed
];

// Function to fetch ObjectId for "Novels" category
const getNovelsCategoryId = async () => {
  try {
    const category = await Category.findOne({ name: 'Novels' });
    if (!category) {
        throw new Error('Category "Novels" not found.');
      }
    return category._id; // Return ObjectId of "Novels" category
  } catch (err) {
    throw new Error('Error fetching ObjectId for "Novels" category:', err);
  }
};

// Populate the "novels" category with example data
const populateNovels = async () => {
  try {
    const categoryId = await getNovelsCategoryId(); // Get ObjectId for "Novels" category
    await Item.deleteMany({ category: categoryId }); // Clear existing data
    await Item.insertMany(novelsData.map(item => ({ ...item, category: categoryId })));
    console.log('Novels category populated with example data.');
  } catch (err) {
    console.error('Error populating novels category:', err);
  }
};

populateNovels();
