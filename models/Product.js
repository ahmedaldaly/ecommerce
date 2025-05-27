const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 400,
  },
  category: {
    type: String, // مرجع إلى التصنيف
    required: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  review: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5],
  },
  sale: {
    type: Number,
    trim: true,
  },
  image: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  ]
});

const Product = mongoose.model('Product', productSchema);

function validateProduct(obj) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(100).required(),
    desc: Joi.string().min(5).max(400).required(),
    category: Joi.string().required(),
    price: Joi.number().min(1).required(),
    review: Joi.number().valid(1, 2, 3, 4, 5).required(),
    sale: Joi.number().optional(),
    image: Joi.array().items(
      Joi.object({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
      })
    ).min(1) // يجب أن تحتوي على صورة واحدة على الأقل
  });

  return schema.validate(obj);
}

module.exports = {
  Product,
  validateProduct,
};
