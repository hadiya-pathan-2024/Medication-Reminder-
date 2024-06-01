const jwt = require('jsonwebtoken');
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
const {generalResponse} = require("../helpers/response.helper");

async function auth(req,res, next){
    const { token } = req.cookies;
    console.log("cookie: ", req.cookies);
    if (!token) {
        return generalResponse(
            res,
            {success: false},
            "Please login first",
            "error",
            false
        )
    }
    try {
        const decodeCookie = jwt.verify( token,process.env.JWT_SECRET)
        console.log("decodeCookie: ", decodeCookie);
    } catch (error) {
        console.log("Error", error);
        return generalResponse(
            res,
            {success: false},
            "Invalid Token",
            "error",
            false
        )
    }
    return next()
}

module.exports = {auth}