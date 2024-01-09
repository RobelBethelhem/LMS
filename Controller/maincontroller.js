const User = require('../module/user');
const Status = require('../module/status');
const Course = require('../module/courses');
const Question = require('../module/question');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');
const Answer = require('../module/answer');


function getID(req) {
  const token = req.cookies.jwt;
  let user;

  if (token) {
    try {
      user = jwt.verify(token, 'zb hq lms by roba');
    } catch (err) {
      console.log(err.message);
    }
  }

  const userId = user.id;
  return userId;
}



module.exports.post_add_question = async(req,res) => {
  let questions = [];
  let choices = [];

  for(let i =0 ; i<req.body.questions.length; i++){
    // req.body.video = totalvideo.join(';');
     questions.push(req.body.questions[i].question);
     choices.push(req.body.questions[i].choices.A);
     choices.push(req.body.questions[i].choices.B);
     choices.push(req.body.questions[i].choices.C);
     choices.push(req.body.questions[i].choices.D);
  }
 let questionss = questions.join(';');
 let choicess = choices.join(';');

 const token = req.cookies.jwt;
let userid;
if(token){
  jwt.verify(token, 'zb hq lms by roba', (err,decodedToken)=>{
      if(err){
          console.log(err.message);
      } else{
          userid = decodedToken.id
      }
  })
}
console.log('userid', userid);

  const question = {
    course_id: req.body.courseCode,
    date:req.body.date,
    time: req.body.time,
    duration: req.body.duration,
    questions: questionss,
    choices: choicess,
    creatorid: userid
  }

const newquestion = new Question(question);
          await newquestion.save();
          res.status(200).json({ message: 'Successfully added Question' });

  // let userId= req.session.userId;
  // if(!userId){
  //   res.redirect('/login')
  //   }else {
  //     //checking the user is a teacher or not
  //     User.findById(userId).then((result)=>{
  //       if (!result.isTeacher) {
  //         return res.send({'status':'fail','message':"You are not authorized to add question."});
  //         } else {
  //           var courseCode = req.body.course;
  //           Course.getCourseByCode(courseCode).then((courseInfo)=> {
  //             if (!courseInfo) {
  //               return res.send({'status':'fail', 'message': "The course you entered does not exist."})
  //               } else {
  //                 for (var i = 0 ;i < req.body.questions.length; i++) {
  //                   req.body.questions[i].teacherID = result._id;
  //                   req.body.questions[i].dateTime = new Date();
  //                   };
  //                   Questions.createQuestions(req.body.questions, courseInfo._id).then((data)=>{
  //                     res.json({'status':'success', 'message': data});
  //                     }).catch((err)=>{
  //                       console.log("Error in adding questions");
  //                       console.error(err);
  //                       res.json({'status':'fail', 'message': err});
  //                       })
  //                       }
  //                       });
  //                       }
  //                       }
  
 

}


module.exports.get_course_detail = (req, res) => {

    const id = req.params.id;
    const user_id =  getID(req)
    Course.findById(id)
       .then((course) => {
        const course_id = course.course_id;
        console.log("course_id", course_id)
       
        Status.findOne({ user_id: user_id, course_code: course_id })
          .then(foundStatus => {
            if (foundStatus) {
              // Document found, use the foundStatus data
              console.log("Hani", foundStatus)
              res.render("course_detail", { title: 'courses_detail', course, savedstatus: foundStatus.progress_percentage});
            } else {
              // No document found
              res.render("course_detail", { title: 'courses_detail', course, savedstatus:'0' });
            }
          })
          .catch(error => {
            console.error("Error:", error);
          });
       
        
       })
       .catch((error) => {
         console.error(error);
         res.status(404).send('Course not found');
       });
}


module.exports.searchCourses = async(req, res) => {
    const searchQuery = req.query.query; // Get the search query from the query parameter
    console.log("searchQuery",searchQuery);
  
      const userId = getID(req);
   
    const { position, department } = await User.findById(userId);
     
  
   
        // Use the search query to filter the courses
    Course.find({ course_title: { $regex: searchQuery, $options: 'i' } })
    .then(courses => {
      const Course=courses.filter((course) => {
        const positionArray = course.position.split(';');
        const departmentArray = course.department.split(';');
    
        return (
          (positionArray.includes(position) || course.position === 'all') &&
          (departmentArray.includes(department) || course.department === 'all')
        );
    })
      

      res.json(Course); // Send the filtered courses as JSON response
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
    

     

    
   
  };

  module.exports.get_courses = async (req, res) => {
    const userId = getID(req);
   
    const { position, department } = await User.findById(userId);
  
    const courses = await Course.find();
  
    const Courses = courses.filter((course) => {
      const positionArray = course.position.split(';');
      const departmentArray = course.department.split(';');
  
      return (
        (positionArray.includes(position) || course.position === 'all') &&
        (departmentArray.includes(department) || course.department === 'all')
      );
    });
  
    res.render('index', { title: 'courses', Courses });
  };

  module.exports.get_add_answer = async(req,res)=>{
    const modules = await Question.find();
    res.render('add_answer.ejs', { title: 'add_answer', modules });

  }
 
  module.exports.post_selected_courseid = async (req, res) => {
    try {
      let course_id = req.body.courseCode;
      const question = await Question.findOne({ "course_id": course_id });
      const questionArray = question.questions.split(';');
      const question_length = questionArray.length;
      const courseId = question.course_id;
  
      res.json({ question_length, courseId });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  };

  module.exports.post_submit_answer = async (req, res) => {
    const answer = await Answer.findOne({ course_id: req.body.course_id });
    if(answer) {
    return res.status(500).json({error: 'Already Stored'})  
    console.log('Not successfull added') }
    else {
      console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
      req.body.answers =req.body.answers.join(';');
      let ans = Answer(req.body);
      ans.save().then((e)=>{
        res.status(200).json({success: 'Sussefuly Added'})
        console.log('successfully added')
      }).catch((e)=>console.log(e))
      
    }
    
  };
  
  

module.exports.get_add_course = (req,res) =>{
    res.render("add_course",{title:'add_course'});
}
module.exports.get_add_question = (req,res) =>{
    Course.find().then((courses)=>{
      res.render("add_question",{title:'add_question', courses});
    })
}
module.exports.get_users = (req,res) =>{
  User.find().then((users)=>{
    res.render("users",{title:'users',users});
  })
   
}
module.exports.post_update_course = async(req,res) =>{
try{
  let course_id = req.body.course_id;
  course_id = course_id.trim();
  let position = req.body.position;
  let positionArray = JSON.parse(position);
  let department = req.body.department;
  let departmentArray = JSON.parse(department);
   position = positionArray.join(';');
   department = departmentArray.join(';');
   req.body.position = position;
   req.body.department = department;

   const update = {
    course_title: req.body.course_title,
    course_id: req.body.course_id,
    position: req.body.position,
    department: req.body.department,
    course_description: req.body.course_description,
    course_objective: req.body.course_objective,
    course_status: req.body.course_status,
    certeficate_needed: req.body.certeficate_needed,
    sensetivity: req.body.sensetivity,
    passing_score: req.body.passing_score,
    total_hour: req.body.total_hour,
  };

  const updatedCourse = await Course.findOneAndUpdate({ course_id: course_id }, update, {
    new: true, // Return the updated document
  });
  console.log("Updated Course:", updatedCourse);
  res.status(200).json(updatedCourse);

}
catch(err){
  console.log(err);
    res.status(500).json({ error: "An error occurred while updating the user." });
}
}

module.exports.get_course_management = (req,res) =>{
  Course.find().then((courses)=>{
    res.render("course_management",{title:'Course Managment', courses})
  })
}

module.exports.get_generate_certificate = (req,res)=>{
  res.render('get_certeficate', { title:'Certeficate', name: req.query.name }); 
}

module.exports.get_take_quizes = (req,res) =>{
    res.render("take_quizes",{title:'take_quizes'});
}

module.exports.post_status = async(req,res)=>{
  console.log("req.body",req.body);
  const course_code = req.body.course_code;
 
  const user_id =  getID(req)
  req.body.video_index =  req.body.video_index + 1;
  const frontvideo_index = req.body.video_index;
  req.body.progress_percentage =  (req.body.video_index/req.body.total_videos);
  const frontprogress_percentage =   req.body.progress_percentage;
  console.log("req.body2",req.body);
 




  try {
    const savedstatus = await Status.findOne({ user_id: user_id, course_code: course_code });
  
    if (savedstatus) {
      const backvideo_index = savedstatus.video_index;
      if (frontvideo_index > backvideo_index) {
        const update = {
          video_index: frontvideo_index,
          progress_percentage: frontprogress_percentage,
        };
  
        console.log("update", update);
  
        const updatedStatus = await Status.findOneAndUpdate(
          { user_id: user_id, course_code: course_code },
          update,
          {
            new: true, // Return the updated document
          }
        );
  
        console.log("Updated Status:", updatedStatus);
        res.status(200).json(updatedStatus);
      } else {
        // frontvideo_index <= backvideo_index
        // Handle the case when frontvideo_index is not greater than backvideo_index
        // ...
      }
    } else {
      // No document found
      const newStatus = new Status(req.body);
      await newStatus.save();
      console.log("Saved for the first time:", newStatus);
      res.status(200).json(newStatus);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the status update." });
  }

}




module.exports.get_discussion = (req, res) => {
  res.redirect(`/discusion${uuidv4()}`);
};

module.exports.get_room = (req,res) =>{
  res.render('discusion',{title:'discusion',roomId:req.params.room})
}


module.exports.get_certeficates = (req,res) =>{
    res.render("certeficate",{title:'certeficates'});
}
module.exports.get_profile = async(req,res) =>{
  const exams = await Question.find()
    res.render("profile",{title:'profile', exams});
}

module.exports.post_selectedCourseIdForQuiz = async(req,res) =>{
  console.log(req.body)
  const Exam = await Question.findOne({ course_id: req.body.courseCode });
  const exam = Exam.questions;
  const choice = Exam.choices;
  const choiceArray = choice.split(';')
  const examArray = exam.split(';');
  const duration = Exam.duration;


  return res.status(200).json({ examArray:examArray , course_id: req.body. courseCode,choiceArray:choiceArray, duration:duration });
    
}

module.exports.post_checktheanswer = async (req,res) =>{
  const check = await Answer.findOne({ course_id: req.body.courseId });
  console.log(check.answers)
  var convertedArray = [];
  var array = req.body.answers;
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "G") {
    convertedArray.push("G");
    } 
    else if(array[i] == "0"){
      convertedArray.push("A");
    }
    else if(array[i] == "1"){
      convertedArray.push("B");
    }
    else if(array[i] == "2"){
      convertedArray.push("C");
    }
    else if(array[i] == "3"){
      convertedArray.push("D");
    }
    }
    var correctAnswer = 0;
    let checkk = [];
    if (check.answers.includes(';')) {
      checkk = check.answers.split(';');
    }
    else{
      console.log("check.answers",check.answers)
      checkk.push(check.answers);
      checkk.push(check.answers);
      console.log("checkk",checkk)
    }
    
    
    for (var i = 0; i < array.length; i++) {
      if(convertedArray[i] === checkk[i]){
        correctAnswer ++;
      }
    }
    let percent = (correctAnswer/array.length) * 100 
    res.status(200).json({totalLength: array.length, correctAnswer: correctAnswer, percent:percent});
 
}


module.exports.post_register_course = async(req,res) =>{
   console.log(req.body);
   let positions = [];
   let departments = [];
   let dpt = '';
   let psn= '';
   if (Array.isArray(req.body.position)) {
    positions = req.body.position.slice();
    psn = req.body.position.join(';');
    req.body.position = psn;
    console.log('position', psn)
  }
  if(Array.isArray(req.body.department)){
    departments = req.body.department.slice();
    dpt = req.body.department.join(';');
    req.body.department = dpt;
    console.log('department', dpt)
  }
  departments.push(req.body.department);
  positions.push(req.body.position);
    // req.body.department = departments.join(';');
    // req.body.position = positions.join(';');


    try{
        if(req.files){
            console.log('roba');
                       req.body.user_complete_course = '';
            let totalmaterial = [];
            let totalvideo = [];
           
            total_file_length = req.files.length;
           for(let i = 0; i< total_file_length; i++){
                if(req.files[i].fieldname == 'thumbnail'){
                    req.body.thumbnail = req.files[i].filename;
                }
                if(req.files[i].fieldname == 'material'){
                    totalmaterial.push(req.files[i].filename)
                }
                if(req.files[i].fieldname == 'video'){
                    totalvideo.push(req.files[i].filename)
                }
           }
          
          
           req.body.material = totalmaterial.join(';');
           req.body.video = totalvideo.join(';');
           const existingCourseByTitle = await Course.findOne({ course_title: req.body.course_title });
           const existingCourseBycourseid = await Course.findOne({ course_id: req.body.course_id });
           const existingCourseBycoursedescription = await Course.findOne({ course_description: req.body.course_description });
           const existingCourseBycourseobjective = await Course.findOne({ course_objective: req.body.course_objective });
           if (existingCourseByTitle) {
            return res.status(400).json({ message: 'Course Title already exists' });
          }
          if (existingCourseBycourseid) {
            return res.status(400).json({ message: 'Course_ID  already exists' });
          }
          if (existingCourseBycoursedescription) {
            return res.status(400).json({ message: 'Course Description Title already exists' });
          }
          if (existingCourseBycourseobjective) {
            return res.status(400).json({ message: 'Course Objective Title already exists' });
          }
          const newCourse = new Course(req.body);
          await newCourse.save();
         



          //broadcast the message
          User.find()
          .then((users)=>{
            let emailAddresses = [];
            console.log('ems', positions[0]);
            console.log('ems', users.length);
            let length = users.length;
            for(let i=0 ; i < length; i++){
                  for(let j=0;j<positions.length; j++){
                    if(users[i].position === positions[j] || users[i].position === 'all')
                    {
                      for(let k=0; k<departments.length; k++){
                        if(users[i].department === departments[k] || users[i].department === 'all'){
                          console.log('found email email')
                          emailAddresses.push(users[i].email);
                        }
                      }

                    }
                  }
            }
             // Send email confirmation to multiple users
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'robelbethelhem@gmail.com',
                    pass: 'zharbowsydpvlcfb',
                  },
                });

                for (const emailAddress of emailAddresses) {
                  const mailOptions = {
                    from: 'robelbethelhem@gmail.com',
                    to: emailAddress,
                    subject: 'Courses Are Added that Mach With With your Current Position and Department',
                  };
            
                  const info =  transporter.sendMail(mailOptions);
                  console.log(`Email sent to ${emailAddress}: ${info.response}`);
                  
                }

          }
          )
          .catch(e=>console.log(e))
          res.status(200).json({ message: 'Successfully added Course' });

        }

    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }


}

// add_course
// const courseregform = document.querySelector('form.name.courseregform');
  // const loginpasswordError = document.querySelector('.loginpassword.error'); 

  // courseregform.addEventListener('submit', async (e) => {
  //   e.preventDefault();

  //   loginpasswordError.textContent = '';

  //   const formData = new FormData(courseregform);

  //   try {
  //     const res = await fetch('/register_course', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       loginpasswordError.textContent = data.message;
  //       // You can handle the success response here, such as redirecting the user.
  //     } else {
  //       loginpasswordError.textContent = data.message;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });
