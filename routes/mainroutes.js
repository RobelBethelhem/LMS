const { Router } = require('express');
const maincontroller = require('../Controller/maincontroller');
const router = Router();
const upload = require('../middleware/uploadpdfvideo')


 router.get('/discusion', maincontroller.get_discussion);
  router.get('/generate_certificate', maincontroller.get_generate_certificate);
router.get('/discusion:room',maincontroller.get_room);
router.post('/add_question', maincontroller.post_add_question);
router.get('/course_detail/:id', maincontroller.get_course_detail);
router.post('/update_course', maincontroller.post_update_course);
router.get('/search', maincontroller.searchCourses);
router.get('/courses', maincontroller.get_courses);
router.get('/add_courses', maincontroller.get_add_course);
router.get('/add_question', maincontroller.get_add_question);
router.get('/users', maincontroller.get_users);
router.get('/take_quizes', maincontroller.get_take_quizes);
router.get('/course_management', maincontroller.get_course_management);

router.get('/certeficates', maincontroller.get_certeficates);
router.get('/profile', maincontroller.get_profile);
router.post('/register_course', upload.any(), maincontroller.post_register_course);
router.get('/add_answer', maincontroller.get_add_answer);
router.post('/selected_courseid', maincontroller.post_selected_courseid);
router.post('/submit_answer', maincontroller.post_submit_answer);
router.post('/selectedCourseIdForQuiz', maincontroller.post_selectedCourseIdForQuiz);
router.post('/checktheanswer', maincontroller.post_checktheanswer);
router.post('/status', maincontroller.post_status);


// router.post('/register_course', upload.array("thumbnail",10),upload.array("material",10),upload.array("video",10)), maincontroller.post_register_course;



module.exports = router;


