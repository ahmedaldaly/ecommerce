const router = require ('express').Router();
const {getUser,getOneUser,deleteUser,updateUser,tokenUser} = require ('../controller/UserContoller');
const {verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization,
    vrifayToken} = require('../middleware/authratition')

// /api/vi/users
router.get('/',verifyTokenAndAdmin, getUser);
router.get('/token',vrifayToken, tokenUser);
router.route('/:id').get (getOneUser).delete (verifyTokenAndAdmin,deleteUser).put(verifyTokenAndAdmin,updateUser);
module.exports =router;