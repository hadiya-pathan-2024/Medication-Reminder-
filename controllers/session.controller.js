const jwt = require('jsonwebtoken');
const { Session } = require('../models');

const createSession = async (userId, device) => {
  const session = await Session.create({ userId, device });
  return session;
};

const deleteSessions = async (userId, excludeSessionId = null) => {
  const condition = excludeSessionId ? { userId, sessionId: { [Op.ne]: excludeSessionId } } : { userId };
  await Session.destroy({ where: condition });
};

const generateToken = (user, sessionId) => {
  return jwt.sign({ id: user.id, sessionId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { createSession, deleteSessions, generateToken };

//////////////////////////////////
const { createSession, deleteSessions, generateToken } = require('../middleware/session');
const { Session } = require('../models');

const login = async (req, res) => {
  const { email, password, device } = req.body;
  // Authentication logic here
  const user = await authenticateUser(email, password);
  
  if (user) {
    const session = await createSession(user.id, device);
    const token = generateToken(user, session.sessionId);
    res.json({ token });
  } else {
    res.status(401).send('Unauthorized');
  }
};

const logoutAll = async (req, res) => {
  await deleteSessions(req.user.id);
  res.status(200).send('Logged out from all devices');
};

const logoutOthers = async (req, res) => {
  await deleteSessions(req.user.id, req.user.sessionId);
  res.status(200).send('Logged out from other devices');
};

module.exports = { login, logoutAll, logoutOthers };
