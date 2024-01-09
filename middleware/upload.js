const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pp') {
      cb(null, 'assets/profile_picture/');
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'pp') {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      // Check if file size exceeds the limit (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return cb(new multer.MulterError('File too large', 'File size limit exceeded.'));
      }
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
