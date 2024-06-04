const express = require("express");
const router = express.Router();
const passport = require("passport");

// require("../middlewares/passport")(passport)
const {register,registerPage,login, loginPage ,logoutAll, logoutOthers, logout} = require('../controllers/register.controller');
// const { auth } = require("../middlewares/auth");
router.get('/register', registerPage);
router.post('/register', register);
router.post('/login', login);
router.get('/login', loginPage);
router.post('/logout-others',passport.authenticate('jwt',{session: false}), logoutOthers);
router.post('/logout-all',passport.authenticate('jwt',{session: false}), logoutAll);
router.post('/logout',passport.authenticate('jwt',{session: false}), logout);
module.exports = router;
