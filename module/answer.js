const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    course_id:{
        type: String,
    },
   
    answers:{
        type: String, 
    },
},{timestamps: true});


  
    //creating user module and exporting
    const Answer = mongoose.model('Answer', answerSchema);
    module.exports = Answer;