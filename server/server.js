const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser'); 


// Require the Comment model
require('./models/comments');

// import routes
const answerRoutes = require("./routes/answerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const userRoutes = require("./routes/userRoutes")


// server port
const PORT = 8000;

// start express 
const app = express();



// setup cors to take 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));


app.use(express.json()); 

app.use(cookieParser());


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Import routes
// const answerRoutes = require("./routes/answerRoutes");
// const questionRoutes = require("./routes/questionRoutes");
// const tagsRoutes = require("./routes/tagsRoutes");
// const userRoutes = require("./routes/userRoutes");

// Define routes
app.use('/answers', answerRoutes);
app.use('/questions', questionRoutes);
app.use('/tags', tagsRoutes);
app.use('/users', userRoutes);

// Set more explicit CORS headers for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// app.use(ANSWER_ROUTE, answerRoutes);
// app.use(QUESTION_ROUTE, questionRoutes);
// app.use(TAGS_ROUTE, tagsRoutes);
// app.use(USER_ROUTE, userRoutes)


// Start listening 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



