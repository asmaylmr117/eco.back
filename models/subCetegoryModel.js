const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim:true, 
        unique: [true, 'SubCategory must be uniq'],
        minlength:[2, 'To short shb Category name'],
        maxlength:[32, 'to long shbCategory name'],
 },
  slug: {
    type: String,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref:'Category',
    required:[true,'SubCategory must belong to parent category'],
  },   
}, { timestamps: true }

);

module.exports = mongoose.model('SubCategory',subCategorySchema );