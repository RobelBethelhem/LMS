const express = require('express');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const opinions = {
  debug: true,
}



const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
// const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const authroutes = require('./routes/authroutes');
const mainroutes = require('./routes/mainroutes');
const { checkUser } = require('./middleware/authmidleware');
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(()=>{
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 1000)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

const dburi = 'mongodb://127.0.0.1:27017/zblms';
mongoose.connect(dburi)
  .then(() => {
    
    server.listen(process.env.PORT || 3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/css/'));
app.use(express.static(__dirname + '/fonts/'));
app.use(express.static(__dirname + '/img/'));
app.use(express.static(__dirname + '/js/'));
app.use(express.static(__dirname + '/plugins/'));
app.use(express.static(__dirname + '/assets/'));
app.use(express.static(__dirname + '/frontendjs/'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));


// Apply checkUser middleware to all routes except '/log_in'
app.use((req, res, next) => {
  if (req.path === '/log_in') {
    return next();
  }
  checkUser(req, res, next);
});


// Redirect to login if the user is null
app.use((req, res, next) => {
  if (!res.locals.user && req.path !== '/log_in') {
    return res.redirect('/log_in');
  }
  next();
});

const limiter = rateLimit({
  windowMs: 60 * 15 * 1000, // 15 minutes
  max: 100
});

app.use(limiter);
// app.use(helmet());
app.use(authroutes);
app.use(mainroutes);




// server.listen(process.env.PORT || 3030);
