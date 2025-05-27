const router = require ('express').Router();
const {addFavourites,getUserFavorites,removeItem} = require('../controller/FavoritesController')
const {verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization,
    vrifayToken} = require('../middleware/authratition')
//  /api/vi/favorites/add
router.route('/add').post(vrifayToken,addFavourites);
router.route('/').get(vrifayToken,getUserFavorites)
router.route ('/:id').delete(verifyTokenAndOnlyUser,removeItem)
module.exports=router;