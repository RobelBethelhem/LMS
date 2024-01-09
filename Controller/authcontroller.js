const User = require('../module/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const upload = require('../middleware/upload');
const nodemailer = require('nodemailer');

const secretKey = 'zb hq lms by roba';
// const maxAge = 3 * 24 * 60 * 60;
const maxAge = 6 * 60 * 60*1000;
const createToken = (id) => {
  return jwt.sign({ id }, 'zb hq lms by roba', {
    expiresIn: maxAge
  });
};



  //handle loginerror
  const loginhandleErrors = (err) =>{

    // console.log(err.message, err.code);
    let errors = { email: '', password: ''};
    

        // incorrect email
        if (err.message === 'incorrect email') {
          console.log('nnnnnnnnnnnnnnnn')
          errors.email = 'That email is not registered';
        }

    // blocked user
    if(err.message === 'blocked account'){
      errors.email = 'The Account is blocked';
    }

  // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
      return errors;
  }

module.exports.post_log_in = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Assuming User.log_in is an asynchronous function
    const user = await User.log_in(email, password);

    if (user) {
      // If user is found, create a token
      const token = createToken(user._id);

      // Set the token in a cookie
      res.cookie('jwt', token, { maxAge: maxAge });

      // Respond with the user's id and a success status
      res.status(201).json({ user: user.id });
    } else {
      // If user is not found, respond with an error status
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    // Handle other errors, such as database connection issues
    const error = loginhandleErrors(err);
      res.status(400).json({error});
  }
};


// // Route to destroy the session (logout)
module.exports.get_log_out = (req,res)=>{
  console.log("log out Sucessful")
  res.cookie('jwt','',{maxAge:1});
  res.redirect('/log_in');
}

module.exports.get_log_in = (req,res) =>{
    res.render("login",{title:'login'});
}
module.exports.get_register_user = (req,res) =>{
  res.render("register_user",{title:'add_user'});
}

module.exports.post_register_user = async (req, res) => {
  try {
    console.log("req.body", req.body)
    if (req.file && req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'File too large. Maximum file size allowed is 5MB.' });
    }

    if (req.file) {
      req.body.pp = req.file.filename;
    }

    console.log(req.body);

    const existingUserByEmail = await User.findOne({ email: req.body.email });
    const existingUserByUsername = await User.findOne({ username: req.body.username });
    const existingUserByPhoneNumber = await User.findOne({ phonenumber: req.body.phonenumber });

    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    if (existingUserByPhoneNumber) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const newUser = new User(req.body);
    await newUser.save();

    // Send email confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'robelbethelhem@gmail.com',
        pass: 'zharbowsydpvlcfb',
      },
    });

    const mailOptions = {
      from: 'robelbethelhem@gmail.com',
      to: req.body.email,
      subject: `Your Account is SetUp in Zemen Bank LMS System Your Temporary Password: ${req.body.password}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    res.status(201).json({ user: newUser.id, message: 'Successfully added user' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports.post_manage_user = async (req, res) => {
  try {
    let user_id = req.body.id;
    user_id = user_id.trim(); 
    const update = {
      name: req.body.name,
      username: req.body.username,
      position: req.body.position,
      department: req.body.department,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
    };

    const updatedUser = await User.findByIdAndUpdate(user_id, update, {
      new: true, // Return the updated document
    });

    console.log("Updated User:", updatedUser);
    res.status(200).json(updatedUser); // Send the updated user as a response
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
};