const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


// import routes
const answerRoutes = require("./routes/answerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const userRoutes = require("./routes/userRoutes")


// harcode route 
const ANSWER_ROUTE = '/answers'
const QUESTION_ROUTE = '/questions'
const TAGS_ROUTE = '/tags'
const USER_ROUTE = '/users'

const PORT = 8000;


const app = express();

//app.use(cors());


app.use(cors({
  origin: 'http://localhost:3000', // Your client's URL
  credentials: true
}));


app.use(express.json()); // for parsing application/json

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


// Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
