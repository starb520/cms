var express = require('express');
var router = express.Router();

const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');


// GET: return all messages
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find().populate('sender').exec();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching messages',
      error: error
    });
  }
});


// POST: add a new message
router.post('/', async (req, res, next) => {
  try {
    const id = await sequenceGenerator.nextId('messages');

    const message = new Message({
      id: id.toString(),
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
    });

    const savedMessage = await message.save();

    res.status(201).json({
      message: 'Message added successfully',
      messageId: savedMessage._id
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating message',
      error: error
    });
  }
});


// PUT: update an existing message
router.put('/:id', async (req, res, next) => {
  try {
    const message = await Message.findOne({ id: req.params.id }).exec();

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.subject = req.body.subject;
    message.msgText = req.body.msgText;
    message.sender = req.body.sender;

    await message.save();

    res.status(204).send();

  } catch (error) {
    res.status(500).json({
      message: 'Error updating message',
      error: error
    });
  }
});


// DELETE: delete a message
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Message.deleteOne({ id: req.params.id }).exec();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting message',
      error: error
    });
  }
});


module.exports = router;
