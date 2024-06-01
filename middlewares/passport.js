// // let JwtStrategy = require("passport-jwt").Strategy;
// // let JwtExtract = require("passport-jwt").ExtractJwt;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
// // const { ExtractJwt } = require("passport-jwt");

// // const db = require("../models/index");
// // const { where } = require("sequelize");
// // const passport = require("passport");
// // const {users} = db;
// // const LocalStrategy = require('passport-local').Strategy;
// // module.exports = async function (passport){
// //     passport.use(
// //         new JwtStrategy(
// //             {
// //                 secretOrKey: process.env.JWT_SECRET,
// //                 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
// //             },
// //             function (jwt_payload,callback){
// //                 console.log("payload: ", jwt_payload);
// //                 users.findOne({
// //                     where: {
// //                         email: jwt_payload.email
// //                     },function(err,res){
// //                         if(err){
// //                             return callback(err,false)
// //                         }
// //                         if(res){
// //                             callback(null,res)
// //                         }
// //                         else{
// //                             callback(null,false)
// //                         }
// //                     }
// //                 })
// //                 callback(null,false);

// //             }
// //         )
// //     )
// // }

// // exports.initializingPassport = (passport) => {
// //     // console.log("Yes");
// //     passport.use(new LocalStrategy(async(email, password, done)=>{
// //         try {
// //             console.log("try");
// //             const findUser = await users.findOne({
// //                 where: {
// //                     email:email
// //                 }
// //             })
// //             console.log("user: ", findUser);
// //             if (!findUser) return done(null, false);
// //             if(findUser.password !== password) return done(null,false);
// //             return done(null,findUser);
// //         } catch (error) {
// //             console.log("catch");
// //             return done(error, false)
// //         }
// //     }))

// //     passport.serializeUser(async(findUser,done)=> {
// //         done(null, findUser.id)
// //     });

// //     passport.deserializeUser(async(id,done)=>{
// //         try {
// //             const findUserById = await users.findByPk({
// //                 where: {
// //                     id
// //                 }
// //             })
// //             done(null, findUserById)
// //         } catch (error) {
// //             done(error, false)
// //         }
// //     })
// // }

// const passport = require("passport");
// // const connection = require("../config/connection");
// let JwtStrategy = require("passport-jwt").Strategy;
// // const envConf = require("../config/env");
// const db = require("../models/index");
// const { where } = require("sequelize");
// const {users} = db;
// let urlCheck;
// const getToken = (req) => {
//   const url = req.originalUrl;
//   urlCheck = url;
//   return req.cookies.access_token;
// };

// let opts = {};
// opts.jwtFromRequest = getToken;
// opts.secretOrKey = process.env.JWT_SECRET;

// passport.use(
//   new JwtStrategy(opts, async function (jwt_payload, done) {
//     try {
//       let user = await users.findOne({
//         where: {
//             email:jwt_payload.email
//         }
//       })
//       if (user) {
//           return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     } catch (err) {
//       return done(err);
//     }
//   })
// );


const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../models/index');
const { where } = require("sequelize");
const {users} = db;
const jwtSecret = process.env.JWT_SECRET;

let cookieExtractor = function(req){
  return req.cookies?.token;
}
const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtSecret
};
module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log("jwt: ", jwt_payload);
      const user = await users.findByPk(jwt_payload.id);
      if (user) {
        return done(null, user.dataValues);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));
};
