const express = require("express");
const router = express.Router();
const {home, newMedication, fileUpload} = require('../controllers/home.controller');
const { auth } = require("../middlewares/auth");
const passport = require("passport");
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  const upload = multer({storage})
router.get('/home',passport.authenticate('jwt',{session: false}), home);
router.post('/medications',passport.authenticate('jwt',{session: false}), newMedication);
router.post('/uploads', upload.single('profileImage'), fileUpload);
module.exports = router;