const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({   
    questions:{
        type: String,
       
    },
    choices:{
        type: String,
    },
    course_id:{
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    }
    ,
    duration: {
        type: Number,
    },
    creatorid:{
        type: String,
    }
},{timestamps: true});


  
    //creating user module and exporting
    const Question = mongoose.model('Question', questionSchema);
    module.exports = Question;
