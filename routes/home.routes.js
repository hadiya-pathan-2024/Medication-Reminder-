const express = require("express");
const router = express.Router();
const {home, newMedication} = require('../controllers/home.controller');
const { auth } = require("../middlewares/auth");
const passport = require("passport");
router.get('/home',passport.authenticate('jwt',{session: false}), home);
router.post('/medications',passport.authenticate('jwt',{session: false}), newMedication);
module.exports = router;