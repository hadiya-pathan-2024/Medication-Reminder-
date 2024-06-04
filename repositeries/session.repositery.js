const jwt = require('jsonwebtoken');
const db = require('../models/index');
const { Op } = require('sequelize');
const { sessions } = db;

const createSession = async (token_id,user_id, device) => {
  const session = await sessions.create({token_id,user_id, device });
  return session;
};

const deleteSessions = async (user_id, excludeSessionId = null) => {
  const condition = excludeSessionId ? { user_id, token_id: { [Op.ne]: excludeSessionId } } : { user_id };
  await sessions.destroy({ where: condition });
};

const deleteSessionsOne = async (user_id,token_id) => {
  await sessions.destroy({ where: {
    user_id,
    token_id
  } });
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { createSession, deleteSessions, generateToken , deleteSessionsOne};
