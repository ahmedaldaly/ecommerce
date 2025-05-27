const {validateFavorites, Favorites} = require('../models/Favoriteslist')
const asyncHandler = require ('express-async-handler');
const {User} = require('../models/User')
const {Product} = require('../models/Product');
const jwt = require ('jsonwebtoken')
module.exports.addFavourites =asyncHandler (async(req,res)=> {
    const {error} = validateFavorites(req.body);
    if (error){
        return res.status(400).json({message:'error data'})
    }
    const found = await Favorites.findOne({user:req.body.user , product: req.body.product})
    if (found) {
        res.status(400).json({message:'product orady added Favorites'})
    }else {
        const favorites = new Favorites ({
            user: req.body.user,
            product: req.body.product,
        });
        await favorites.save()
        res.status(201).json(favorites)
    }
})
module.exports.getUserFavorites = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // استرجاع جميع المفضلات الخاصة بالمستخدم
        const favorites = await Favorites.find({ user: decoded.id });

        if (favorites.length === 0) {
            return res.status(404).json({ message: "No favorite items found" });
        } else {
            // استخراج معرّفات المنتجات من الـ favorites
            const productIds = favorites.map(favorite => favorite.product);

            // استرجاع جميع المنتجات بناءً على المعرفات
            const products = await Product.find({ '_id': { $in: productIds } });

            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found' });
            } else {
                // إرجاع جميع المنتجات المفضلة
                res.status(200).json(products);
            }
        }
    } catch (error) {
        console.error(error);  // طباعة الأخطاء لتصحيحها
        res.status(400).json({ message: error.message });
    }
});

module.exports.removeItem = asyncHandler(async(req,res)=> {
    // const foundItem = Favorites.findById(req.params.id)
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundIte = await Favorites.findOne({product:req.params.id, user:decoded.id})
    if(!foundIte){
        res.status(404).json({message:'item is not favorites'});
    }else {
        const delet = await Favorites.findByIdAndDelete(foundIte._id);
        res.status(200).json({message:'item is removed in favorites'});
    }
})