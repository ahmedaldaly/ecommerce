const router = require ('express').Router();
const {register,login,googleAuth, googleCallback, logout} = require ('../controller/AuthController');
// /api/vi/auth/register
router.post('/register', register);
router.post('/login', login);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
// تسجيل خروج
router.get("/logout", logout);
module.exports =router;