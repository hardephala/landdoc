const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { promises: fsPromises } = require('fs');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dest = path.join(__dirname, '..', 'uploads');
    try {
      await fsPromises.mkdir(dest, { recursive: true });
      cb(null, dest);
    } catch (err) {
      cb(err, dest);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const uploadFiles = upload.array('file', 10);

const handleFileUploads = async (req, res) => {
  try {
    const uploadedFile = req.files[0];
    if (req.body.status === 'Completed') {
      const hash = await getHash(uploadedFile);
      const url = path.join('uploads', uploadedFile.filename);
      console.log(hash, url)
      return res.json({ hash, url });
    }
    const url = path.join('uploads', uploadedFile.filename);

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'File upload failed',
    });
  }
};

const getHash = async (file) => {
  try {
    const fileData = await fsPromises.readFile(file.path);
    const hash = crypto.createHash('sha256');
    hash.update(fileData);
    return hash.digest('hex');
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFiles,
  handleFileUploads,
};
