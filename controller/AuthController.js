const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User, validateRegister, validateLogin } = require('../models/User');

const passport = require("passport"); // مكتبة المصادقة Passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;


// إعداد استراتيجية Google OAuth
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID, // معرف العميل من Google
        clientSecret: process.env.GOOGLE_SECRIT, // المفتاح السري للعميل
        callbackURL: "https://ecommerce-coral-eta.vercel.app/api/vi/auth/google/callback"
  
   // رابط الاسترجاع بعد تسجيل الدخول
      },
      async (accessToken, refreshToken, profile, done) => { // دالة تنفيذية بعد نجاح المصادقة
        try {
          let existingUser = await User.findOne({ email: profile.emails[0].value }); // البحث عن المستخدم في قاعدة البيانات
  
          if (!existingUser) { // إذا لم يكن المستخدم موجودًا
            existingUser = new User({
              email: profile.emails[0].value, // تخزين البريد الإلكتروني من Google
              username: profile.displayName, // تخزين اسم المستخدم من Google
              passwoard: "google-auth", // كلمة مرور افتراضية (لأننا لا نستخدمها مع Google)
            });
  
            await existingUser.save(); // حفظ المستخدم الجديد في قاعدة البيانات
          }
  
          // إنشاء توكن JWT للمصادقة
          const token = jwt.sign(
            { id: existingUser._id, isAdmin: existingUser.isAdmin }, // تضمين معرف المستخدم وصلاحيته
            process.env.JWT_SECRET || "secret12727", // استخدام مفتاح سري لتشفير التوكن
            { expiresIn: "7d" } // مدة صلاحية التوكن (7 أيام)
          );
  
          existingUser.token = token; // تخزين التوكن في بيانات المستخدم
          await existingUser.save(); // حفظ التحديث في قاعدة البيانات
  
          return done(null, existingUser); // إنهاء العملية وإرجاع المستخدم
        } catch (error) {
          return done(error, null); // إذا حدث خطأ، يتم إرجاعه
        }
      }
    )
  );
  
  // مسار بدء تسجيل الدخول عبر Google
  module.exports.googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"], // طلب الوصول إلى الملف الشخصي والبريد الإلكتروني
    prompt: "consent", // إجبار Google على إظهار نافذة الإذن
  });
  
  // مسار رد Google بعد تسجيل الدخول
  module.exports.googleCallback = async (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.redirect("/login");
      }
  
      req.user = user;
      console.log("User authenticated successfully:", req.user);
      res.redirect(`https://ecommerce-front-orcin-ten.vercel.app/en/profile?token=${req.user.token}`);
    })(req, res, next);
  };
  
  
  // تسجيل خروج المستخدم
  module.exports.logout = (req, res) => {
    req.logout(() => { // حذف الجلسة
      res.redirect("/"); // إعادة التوجيه إلى الصفحة الرئيسية
    });
  };



module.exports.register = asyncHandler(async (req, res) => {
    // التحقق من صحة البيانات المدخلة
    const { error } = validateRegister(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // التحقق إذا كان المستخدم موجودًا بالفعل
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ message: 'User already registered' });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.passwoard, salt);

    // إنشاء مستخدم جديد
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        passwoard: hashedPassword,
    });

    // حفظ المستخدم في قاعدة البيانات
    const savedUser = await newUser.save();

    // إنشاء Token باستخدام بيانات المستخدم المحفوظ
    const token = jwt.sign(
        {
            id: savedUser._id,
            isAdmin: savedUser.isAdmin,
        },
        process.env.JWT_SECRET || 'secret12727', // استبدل بمفتاحك السري
        { expiresIn: '1d' } // مدة صلاحية التوكن
    );

    // تحديث التوكن في المستخدم
    savedUser.token = token;

    // إرسال استجابة إلى العميل
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin,
            token: savedUser.token,
        },
    });
});


module.exports.login = asyncHandler(async (req, res) => {
    // التحقق من صحة البيانات المدخلة
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // البحث عن المستخدم بالبريد الإلكتروني
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // التحقق من صحة كلمة المرور
    const validPassword = await bcrypt.compare(req.body.passwoard, user.passwoard);
    if (!validPassword) return res.status(400).json({ message: 'Invalid email or password' });

    // إنشاء التوكن باستخدام بيانات المستخدم الذي تم العثور عليه
    const token = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || 'secret12727', // المفتاح السري
        { expiresIn: '1d' } // مدة صلاحية التوكن
    );

    // إرسال استجابة تحتوي على التوكن وبيانات المستخدم
    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        },
    });
});
