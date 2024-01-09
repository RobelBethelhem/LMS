const { Router } = require('express');
const authcontroller = require('../Controller/authcontroller');
const upload = require('../middleware/upload');

const router = Router();

// router.js
router.post('/log_in', authcontroller.post_log_in);
router.get('/logout', authcontroller.get_log_out);
router.get('/register_user', authcontroller.get_register_user);
router.post('/register_user', upload.single('pp'), authcontroller.post_register_user);
router.post('/manage_user', authcontroller.post_manage_user);

router.get('/log_in', authcontroller.get_log_in);

module.exports = router;


