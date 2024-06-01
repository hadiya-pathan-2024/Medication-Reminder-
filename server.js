const express = require('express');
const { config } = require('dotenv');
const router = require('./routes/index.routes');
const path = require("path");
const cookieParser = require('cookie-parser');
const passport = require('passport');
// Load environment variables from .env file
config({ path: `.env` });
require("./middlewares/passport")(passport)
const app = express();

/**
 * Basic Configuration
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(passport.initialize())
/**
 * Routes Configuration
 */
app.use('/', router);

/**
 * Cron job functions
 */
const cron = require('./cron')
cron.OneTimeScheduler();
/**
 * Spinning up server
 */
const PORT = 3000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 App listening on the port ${PORT}`);
    console.log('=================================');
});
