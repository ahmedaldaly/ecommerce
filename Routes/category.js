const router = require('express').Router();
const {
  GettGategory,
  AddCategory,
  deleteCategory,
  OneCategory,
} = require('../controller/Category');
const {verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
  vrifayToken} = require('../middleware/authratition')

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
router
  .route('/')
  .get(GettGategory)
  .post(verifyTokenAndAdmin,upload.single('image'), AddCategory);

router
  .route('/:id')
  .delete(verifyTokenAndAdmin, deleteCategory)
  .get(verifyTokenAndAdmin, OneCategory)
module.exports = router;
