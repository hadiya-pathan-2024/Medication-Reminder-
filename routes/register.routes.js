const express = require("express");
const router = express.Router();
const passport = require("passport");
// require("../middlewares/passport")(passport)
const {register,registerPage,login, loginPage} = require('../controllers/register.controller');
const { auth } = require("../middlewares/auth");
router.get('/register', registerPage)
router.post('/register', register);
router.post('/login', login);
router.get('/login', loginPage)
module.exports = router;
