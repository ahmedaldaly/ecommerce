const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
//المستخدم مسجل دخول علشان يوصل للحاجه دي

function vrifayToken (req, res ,next){
    const auth =  req.headers.authorization;
    if(auth) {
        const token = auth.split(' ')[1];
        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decoded;
            next()
        }catch(error){
            return res.status(401).json({ message: "invalid token, access denied" });
        }
    } else {
        return res
          .status(401)
          .json({ message: "no token provided, access denied" });
      }
}

// Verify Token & Admin
function verifyTokenAndAdmin(req, res, next) {
    vrifayToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: "not allowed, only admin" });
      }
    });
  }
  
// Verify Token & Only User Himself
function verifyTokenAndOnlyUser(req, res, next) {

   // const foundItem = Favorites.findById(req.params.id)
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

    vrifayToken(req, res, () => {
      if (req.user.id === decoded.id) {
        next();
      } else {
        return res.status(403).json({ message: "not allowed, only user himself" });
      }
    });
  }

  // Verify Token & Authorization
function verifyTokenAndAuthorization(req, res, next) {
  vrifayToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: "not allowed, only user himself or admin" });
      }
    });
  }

  module.exports = {
    vrifayToken,
    verifyTokenAndAuthorization,
    verifyTokenAndOnlyUser,
    verifyTokenAndAdmin
  }