// // let JwtStrategy = require("passport-jwt").Strategy;
// // let JwtExtract = require("passport-jwt").ExtractJwt;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
const JwtStrategy = require('passport-jwt').Strategy;
const db = require('../models/index');
const { users, sessions } = db;
const jwtSecret = process.env.JWT_SECRET;

let cookieExtractor = function (req) {
  return req.cookies?.token_id;
}
const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtSecret,
  passReqToCallback: true
};

module.exports = (passport) => {
  try {
    passport.use(new JwtStrategy(opts, async (req, jwt_payload, next) => {
      try {
        const token = cookieExtractor(req);
        req.token = token
        let session = await sessions.findOne({ 
          attributes: ['token_id'],
          where: { token_id:token } });
          if (!session) {
            return next(null, false);
          }
        const user = await users.findByPk(jwt_payload.id);
        if (user) {
          return next(null, user);
        }
        return next(null, false);
      } catch (error) {
        return next(error, false);
      }
    }));
  } catch (error) {
    console.log(error)
  }
};
