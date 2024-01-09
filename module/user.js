const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name:{
        type: String,
    },
    username:{
        type: String,
    },
    position:{
        type: String,
    },
    department:{
        type: String,
    },
    phonenumber:{
        type: String,
    },
    email:{
        type: String,
    },
    pp:{
        type: String,
    },
    password:{
        type: String,
    },
},{timestamps: true});

// fire a function before doc saved to db
 
userSchema.pre('save', async function(next) {
    console.log(this.password);
    if(!containsSpecialChars(this.password)){
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

//creating a static login function
userSchema.statics.log_in = async function(email,password){
    const user = await this.findOne({email});
    if(user ){

                const auth = await bcrypt.compare(password, user.password);
           if(auth){
               return user;
           } throw Error('incorrect password');

    } throw Error('incorrect email');

}

//checking special character
function containsSpecialChars(str) {
    if(str.length > 40){
        return true;
    }
    else{
        return false;
    }
  }

    //creating user module and exporting
    const User = mongoose.model('User', userSchema);
    module.exports = User;