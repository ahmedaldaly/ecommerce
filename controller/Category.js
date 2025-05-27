const fs = require('fs');
const path = require('path');
const { Category } = require('../models/Categores');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/connectFireBase');
const streamifier = require('streamifier');

// Get all categories
module.exports.GettGategory = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  if (!categories.length) {
    return res.status(404).json({ message: 'No categories found' });
  }
  res.status(200).json(categories);
});

// Get one category
module.exports.OneCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  res.status(200).json(category);
});

// Delete category

module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log(category)
  if (!category) {
    return res.status(404).json({ message: 'category not found' }); // أضف return هنا
  }

  try {
    // حذف المنتج
    await Category.findByIdAndDelete(req.params.id);
   
    // التحقق من وجود الصورة وحذفها
    if (category.image && category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // إرسال استجابة نجاح
    return res.status(200).json({ message: 'category deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports.AddCategory = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image found' });
  }

  try {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    
        // حذف الصورة من السيرفر المحلي
        
    
    // إنشاء الفئة الجديدة
    const newCategory = new Category({
      name: req.body.name,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },  // حفظ الرابط في قاعدة البيانات
    });

    const category = await newCategory.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
});
