const mongoose = require('mongoose');

const otherBookSchema = new mongoose.Schema({
  author: String,
  country: String,
  imageLink: String,
  language: String,
  link: String,
  pages: Number,
  title: String,
  year: Number
});

otherBookSchema.statics.removeDuplicates = async function () {
  try {
    const result = await this.aggregate([
      {
        $group: {
          _id: { title: "$title", author: "$author" },
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).exec();

    const model = this; // Save a reference to the model object

    result.forEach(async function (doc) {
      const idsToRemove = doc.uniqueIds.slice(1);
      await model.deleteMany({ _id: { $in: idsToRemove } }); // Access deleteMany using the model object
      console.log(`Removed ${idsToRemove.length} duplicates for "${doc._id.title}" by ${doc._id.author}`);
    });
  } catch (err) {
    console.error('Error removing duplicates:', err);
  }
};

const OtherBook = mongoose.model('OtherBook', otherBookSchema);

module.exports = OtherBook;