const express = require("express");
const router = express.Router();
const { home, newMedication, fileUpload } = require('../controllers/home.controller');
const { auth } = require("../middlewares/auth");
const passport = require("passport");
const { upload } = require("../services/multer")
// console.log(upload);
router.get('/home', passport.authenticate('jwt', { session: false }), home);
router.post('/medications', passport.authenticate('jwt', { session: false }),upload.single('profileImage'), newMedication);
// router.post('/uploads', upload.single('profileImage'), fileUpload);
module.exports = router;