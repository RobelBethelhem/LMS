const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    course_title:{
        type: String,
    },
    course_id:{
        type: String,
    },
    course_description:{
        type: String,
    },
    position:{
        type: String,
    },
    department:{
        type: String,
    },
    course_objective:{
        type: String,
    },
    course_status:{
        type: String,
    },
    certeficate_needed:{
        type: String,
    },
    passing_score:{
        type: String,
    },
    sensetivity:{
        type: String,
    },

    total_hour:{
        type: String,
    },
    user_complete_course:{
        type: String,
    },
    thumbnail:{
        type: String,
    },
    material:{
        type: String,
    },
    video:{
        type: String,
    },
    password:{
        type: String,
    },

},{timestamps: true});

    //creating user module and exporting
    const Course = mongoose.model('Course', courseSchema);
    module.exports = Course;