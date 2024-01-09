const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'assets/thumbnail/');
    } else if (file.fieldname === 'material') {
      cb(null, 'assets/coursematerialpdf/');
    } else if (file.fieldname === 'video') {
      cb(null, 'assets/coursevideo/');
    }
  },
  filename: (req, file, cb) => {
    let name = Date.now() + path.extname(file.originalname);
    // let name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
  limits: {
    fileSize: 1000 * 1024 * 1024,
  }
});

module.exports = upload;