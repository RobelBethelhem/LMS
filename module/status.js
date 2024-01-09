const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    user_id: {
        type: String,
    },
   
    video_index:{
        type: String,
       
    },
    course_code:{
        type: String,
    },
   
    total_videos:{
        type: String,
       
    },
    progress_percentage:{
        type: String,
    },
    total_duration:{
        type: String,
    }

},{timestamps: true});


  
    //creating user module and exporting
    const Status = mongoose.model('Status', statusSchema);
    module.exports = Status;


   
