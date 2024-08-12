const db = require('../models');
const ChatMessage = db.ChatMessage;

exports.sendMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.findAll({ include: 'Users' });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};