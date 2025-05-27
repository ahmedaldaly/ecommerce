const {Order} =require('../models/Order');
const asyncHandler = require('express-async-handler')
const {Product} = require('../models/Product')
const{User} = require('../models/User')
const jwt = require ('jsonwebtoken')

module.exports.addOrder = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // فك تشفير التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await User.findById(decoded.id);

        if (!findUser) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const findProduct = await Product.findById(req.body.product);
        if (!findProduct) {
            return res.status(404).json({ message: 'Product Not Found' });
        }

        // التحقق من وجود الطلب مسبقًا لنفس المستخدم ونفس المنتج
        const existingOrder = await Order.findOne({ user: decoded.id, product: req.body.product });
        if (existingOrder) {
            return res.status(400).json({ message: 'Order already exists for this user and product' });
        }

        // إنشاء طلب جديد
        const newOrder = new Order({
            user: decoded.id,
            product: req.body.product,
        });

        await newOrder.save();
        return res.status(201).json({ message: 'Order added successfully', data: newOrder });

    } catch (err) {
        return res.status(400).json({ message: "Invalid token or request error", error: err.message });
    }
});
module.exports.updateOrder  =asyncHandler(async(req,res)=> {
    const order = await Order.findById(req.params.id)
    if(!order){
       return res.status(404).json({message:'Order not Found'})
    }
    const Update =await Order.findByIdAndUpdate(req.params.id,{
        $set:{
            quantity:req.body.quantity,
            address:req.body.address,
            status:req.body.status,
        },
    },{new:true})
    res.status(201).json(Update)
})
module.exports.getAllOrder = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find(); // جلب كل الأوامر
        
        // تحقق من وجود بيانات للأوامر
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        // نستخدم map لجلب تفاصيل كل أمر
        const ordersDetails = await Promise.all(orders.map(async (order) => {
            const productId = order.product;
            const userId = order.user;

            const users = await User.findById(userId);
            const products = await Product.findById(productId);

            // إذا كان المستخدم أو المنتج غير موجودين
            if (!users || !products) {
                return null;  // تجاهل هذا الأمر في حال لم يتم العثور على المستخدم أو المنتج
            }

            return {
                id: order._id,
                user: users.email,
                image: products.image,
                title: products.title,
                status: order.status,
                address: order.address,
                quantity: order.quantity,
            };
        }));

        // تصفية العناصر التي تحتوي على قيمة null (أي التي لم يتم العثور على مستخدم أو منتج لها)
        const validOrders = ordersDetails.filter(order => order !== null);

        // إرجاع جميع الأوامر التي تم العثور عليها
        return res.status(200).json(validOrders);

    } catch (err) {
        return res.status(400).json({ message: "Not found order", error: err.message });
    }
});

module.exports.getUserOrder = asyncHandler(async (req, res) => {
    try {
        // التحقق من وجود التوكن
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];

        // التحقق من صحة التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // استرجاع جميع الطلبات الخاصة بالمستخدم
        const orders = await Order.find({ user: decoded.id });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        // استخراج معرفات المنتجات من الطلبات
        const productIds = orders.map(order => order.product).filter(id => id);

        if (productIds.length === 0) {
            return res.status(404).json({ message: "No products found in orders" });
        }

        // استرجاع جميع المنتجات بناءً على المعرفات
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        // هيكلة البيانات التي ستُرسل
        const orderDetails = orders.map(order => {
            const product = products.find(p => p._id.toString() === order.product.toString());
            return {
                id: order._id,
                image: product.image,
                title: product.title,
                desc: product.desc,
                category: product.category,
                price: product.price,
                review: product.review,
                sale: product.sale,
                quantity: order.quantity,
                address: order.address,
                status: order.status
            };
        });

        // إرسال المنتجات كاستجابة
        res.status(200).json(orderDetails);
    } catch (error) {
        console.error("Error in getUserOrder:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


module.exports.delet = asyncHandler(async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
      
        return res.status(201).json({ message: 'Order delete successfully'});

    } catch (err) {
        return res.status(400).json({ message: "Invalid token or request error", error: err.message });
    }
});