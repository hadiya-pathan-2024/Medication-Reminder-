const db = require('../models/index');
const { users } = db;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
const { generalResponse } = require('../helpers/response.helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { where } = require('sequelize');

async function registerPage(req,res){
    res.render("pages/register")
}

async function register(req, res) {
    try {
        const { id,first_name, last_name, email, password, dob } = req.body;
        console.log(req.body);
        if (!(first_name && last_name && email && password)) {
            return generalResponse(
                res,
                { success: false },
                "All fields are required",
                "error",
                true
            )
        }
        const existingUser = await users.findOne({ 
            where: {
                email:email
            }
         })
        if (existingUser) {
            return generalResponse(
                res,
                { success: false },
                "User already exists",
                "error",
                true
            )
        }
        const hashPassword = await bcrypt.hash(password, 8)
        const saveUser = await users.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
            dob
        })
        console.log("user: ", saveUser);
        const token = jwt.sign(
            { id:saveUser.id },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        )
    } catch (error) {
        console.log("Error", error);
    }
}

async function loginPage(req,res){
   res.render("pages/login")
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log("login: ", req.body);
        if (!(email && password)) {
            return generalResponse(
                res,
                { success: false },
                "Fields are required",
                "error",
                true
            )
        }
        const findUser = await users.findOne({ 
            where: {
                email
            }
         })
        if (findUser && (bcrypt.compare(password, findUser.password)))
         {
            const token = jwt.sign(
                { id: findUser.id },
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            )
            //cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                success: true,
                token
            })
        }

    } catch (error) {
        console.log("Error", error);
    }
}

module.exports = { register, login, registerPage, loginPage }