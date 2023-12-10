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
const commentRoutes = require("./routes/commentRoute")


// harcode route 
const ANSWER_ROUTE = '/answers'
const QUESTION_ROUTE = '/questions'
const TAGS_ROUTE = '/tags'
const USER_ROUTE = '/users'
const COMMENTS_ROUTE = '/comments'

// server port
const PORT = 8000;

// start express 
const app = express();

// Log all incoming POST requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('POST request:', req.path);
    console.log('Body:', req.body);
  }
  next();
});

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


app.use(ANSWER_ROUTE, answerRoutes);
app.use(QUESTION_ROUTE, questionRoutes);
app.use(TAGS_ROUTE, tagsRoutes);
app.use(USER_ROUTE, userRoutes)
app.use(COMMENTS_ROUTE, commentRoutes);



// Start listening 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

``
