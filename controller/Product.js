const { Product, validateProduct } = require('../models/Product');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/connectFireBase');
const { Category } = require('../models/Categores');

// رفع صورة واحدة باستخدام buffer
const uploadFromBuffer = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(fileBuffer);
  });
};

// عرض جميع المنتجات
module.exports.GetProduct = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (!products) return res.status(404).json('No Product Found');
  res.status(200).json(products);
});

// عرض منتج واحد
module.exports.GetOneProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json('No Product Found');
  res.status(200).json([product]);
});

// إضافة منتج جديد مع صور متعددة
module.exports.AddProduct = asyncHandler(async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const category = await Category.findOne({ name: req.body.category });
  if (!category) return res.status(400).json({ message: 'Category not found' });

  if (!req.files || req.files.length === 0) return res.status(400).json('No Images Found');

  try {
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const uploadResult = await uploadFromBuffer(file.buffer);
        return { public_id: uploadResult.public_id, url: uploadResult.secure_url };
      })
    );

    const newProduct = new Product({
      title: req.body.title,
      desc: req.body.desc,
      category: category.name,
      price: req.body.price,
      review: req.body.review,
      sale: req.body.sale,
      image: uploadedImages,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error });
  }
});

// تحديث المنتج مع صور متعددة
module.exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  try {
    let newImages = [...product.image];

    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const uploadResult = await uploadFromBuffer(file.buffer);
          return { public_id: uploadResult.public_id, url: uploadResult.secure_url };
        })
      );

      await Promise.all(product.image.map(img => removeImage(img.public_id)));
      newImages = uploadedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title || product.title,
          desc: req.body.desc || product.desc,
          sale: req.body.sale || product.sale,
          review: req.body.review || product.review,
          price: req.body.price || product.price,
          category: req.body.category || product.category,
          image: newImages,
        }
      },
      { new: true }
    );

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// حذف منتج وجميع صوره
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  try {
    await Promise.all(product.image.map(img => cloudinary.uploader.destroy(img.public_id)));
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});
