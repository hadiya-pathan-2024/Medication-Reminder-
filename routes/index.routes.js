const {Router} = require("express");
const router = Router();
const userRoutes = require("./register.routes");
const homeRoutes = require("./home.routes");

router.use('/',  userRoutes);
router.use('/', homeRoutes);

module.exports = router;