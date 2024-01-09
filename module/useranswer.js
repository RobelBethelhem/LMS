const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const useranswerSchema = new Schema({
    course_id:{
        type: String,
    },
    user_id:{
        type:String
    },
    correct_answer:{
        type: String, 
    },
    incorrect_answer:{
        type: String,
    }
},{timestamps: true});


  
    //creating user module and exporting
    const Useranswer = mongoose.model('Useranswer', answerSchema);
    module.exports = Useranswer;