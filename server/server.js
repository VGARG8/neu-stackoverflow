const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/fake_so", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// import routes
const answerRoutes = require("./routes/answerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const tagsRoutes = require("./routes/tagsRoutes");


// harcode route 
const ANSWER_ROUTE = '/answers'
const QUESTION_ROUTE = '/questions'
const TAGS_ROUTE = '/tags'




app.use(ANSWER_ROUTE, answerRoutes);
app.use(QUESTION_ROUTE, questionRoutes);
app.use(TAGS_ROUTE, tagsRoutes);


// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
