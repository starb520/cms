const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');
const sequenceGenerator = require('./sequenceGenerator');


// GET: fetch all contacts with populated group
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find().populate('group').exec();

    res.status(200).json({
      message: "Contacts fetched successfully",
      contacts: contacts
    });

  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error
    });
  }
});


// POST: create a new contact
router.post('/', async (req, res, next) => {
  try {
    const id = await sequenceGenerator.nextId('contacts');

    const contact = new Contact({
      id: id.toString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group || []
    });

    const savedContact = await contact.save();

    res.status(201).json({
      message: 'Contact added successfully',
      contact: savedContact
    });

  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});


// PUT: update an existing contact
router.put('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id }).exec();

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.imageUrl = req.body.imageUrl;
    contact.group = req.body.group || [];

    await Contact.updateOne({ id: req.params.id }, contact).exec();

    res.status(204).json({
      message: 'Contact updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});


// DELETE: delete a contact
router.delete('/:id', async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ id: req.params.id }).exec();

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    await Contact.deleteOne({ id: req.params.id }).exec();

    res.status(204).json({
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});


module.exports = router;
