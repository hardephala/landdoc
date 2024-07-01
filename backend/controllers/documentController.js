const Document = require('../models/DocumentModel.js');
const Application = require('../models/ApplicationModel.js');

const createDocument = async (req, res) => {
  try {
    const { appId } = req.params;
    const { documentName } = req.body;

    const application = await Application.findById(appId);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const document = new Document({
      user: application.userId,
      document: documentName,
    });
    await document.save();

    application.documents.push(document);
    await application.save();

    res.json({ message: 'Document created and associated with the application' });
  } catch (error) {
    res.status(500).json({ error: 'Document creation failed' });
  }
};

const getDocument = async (req, res) => {
    try {
      const { docId } = req.params;
      const document = await Document.findById(docId);
  
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
  
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve document details' });
    }
};

const updateDocumentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { documentId } = req.params;

    console.log(status, documentId)
    await Document.findByIdAndUpdate(documentId, { status });
    res.json({ success: true, message: 'Document status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document status' });
  }
};


module.exports = { createDocument, getDocument, updateDocumentStatus }