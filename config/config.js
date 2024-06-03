const dotEnv = require("dotenv")
dotEnv.config({ path: `.env` });
module.exports = {
    "development": {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    logging: false
    }
};