const router = require('express').Router();
const { GetProduct, AddProduct, deleteProduct, updateProduct, GetOneProduct } = require('../controller/Product');
const { verifyTokenAndAdmin } = require('../middleware/authratition');
const multer = require('multer');
const storage = multer.memoryStorage();

// ✅ إعداد التحقق من الحجم والنوع
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 ميجا
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فقط الصور من نوع JPEG أو PNG أو WEBP مسموح بها.'));
    }
  }
});
router.route('/')
  .get(GetProduct)
  .post(verifyTokenAndAdmin, upload.array('image', 5), AddProduct);

router.route('/:id')
  .delete(verifyTokenAndAdmin, deleteProduct)
  .put(verifyTokenAndAdmin, upload.array('image', 5), updateProduct)
  .get(GetOneProduct);

module.exports = router;
