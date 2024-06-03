// // let JwtStrategy = require("passport-jwt").Strategy;
// // let JwtExtract = require("passport-jwt").ExtractJwt;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../models/index');
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
