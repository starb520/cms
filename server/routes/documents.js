const express = require('express');
const router = express.Router();

const Document = require('../models/document');
const sequenceGenerator = require('./sequenceGenerator');


// GET: return all documents
router.get('/', async (req, res, next) => {
  try {
    const documents = await Document.find().exec();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching documents',
      error: error
    });
  }
});


// POST: add a new document
router.post('/', async (req, res, next) => {
  try {
    const id = await sequenceGenerator.nextId('documents');

    const document = new Document({
      id: id.toString(),
      name: req.body.name,
      url: req.body.url,
      children: req.body.children || []
    });

    const savedDocument = await document.save();

    res.status(201).json({
      message: 'Document added successfully',
      document: savedDocument
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating document',
      error: error
    });
  }
});


// PUT: update an existing document
router.put('/:id', async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id }).exec();

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    document.name = req.body.name;
    document.url = req.body.url;
    document.children = req.body.children || [];

    await Document.updateOne({ id: req.params.id }, document).exec();

    res.status(204).json({
      message: 'Document updated successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating document',
      error: error
    });
  }
});


// DELETE: delete an existing document
router.delete('/:id', async (req, res, next) => {
  try {
    const document = await Document.findOne({ id: req.params.id }).exec();

    if (!document) {
      return res.status(404).json({
        message: 'Document not found'
      });
    }

    await Document.deleteOne({ id: req.params.id }).exec();

    res.status(204).json({
      message: 'Document deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting document',
      error: error
    });
  }
});


module.exports = router;
