const router = require('express').Router();
const {searchProduct,GetProductByCategory,GetProduct} = require ('../controller/SearchController')

router.route ('/').post(searchProduct).get(GetProduct)
router.route ('/:id').get(GetProductByCategory)

module.exports = router;