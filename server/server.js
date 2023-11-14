const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Importing schemas
const Question = require("./models/questions");
const Answer = require("./models/answers");
const Tag = require("./models/tags");

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

// API Routes

// Get questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate("answers")
      .populate("tags");
    res.json(questions);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Post a new question
app.post("/questions", async (req, res) => {
  try {
    // Extract the tag names and other question details from the request body
    let { tagNames, ...questionDetails } = req.body;

    // Convert tag names to lowercase for consistent handling
    tagNames = tagNames.map((tag) => tag.toLowerCase());

    // Find existing tags (case-insensitive)
    const existingTags = await Tag.find({
      name: { $in: tagNames },
    });

    // Extract the names of existing tags
    const existingTagNames = existingTags.map((tag) => tag.name);

    // Determine which tags need to be created
    const newTagNames = tagNames.filter(
      (tagName) => !existingTagNames.includes(tagName)
    );

    // Create new tags and save them
    const newTags = newTagNames.map((tagName) => new Tag({ name: tagName }));
    await Tag.insertMany(newTags);

    // Combine existing and new tags
    const combinedTags = [...existingTags, ...newTags];

    // Extract tag IDs
    const tagIds = combinedTags.map((tag) => tag._id);

    // Create a new question with tag ObjectIds
    const newQuestion = new Question({
      ...questionDetails,
      tags: tagIds,
      ask_date_time: new Date(),
    });

    // Save the new question
    await newQuestion.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error posting new question:", error);
    res.status(500).send(error);
  }
});

// Post a new answer
app.post("/answers", async (req, res) => {
  try {

    const { text, ans_by, questionId } = req.body; // Extract required fields
    console.log("The text is: ", text);
    console.log("Answered by: ", ans_by);
    console.log("ID: ", questionId);

    // Create new answer with current date
    const newAnswer = new Answer({
      text,
      ans_by,
      ans_date_time: new Date(),
    });

    await newAnswer.save();

    // Associate the answer with the question
    await Question.findByIdAndUpdate(questionId, {
      $push: { answers: newAnswer._id },
    });

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error("Error posting new answer:", error);
    res.status(500).send(error);
  }
});

// Get tags
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all answers
app.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.find({});
    res.json(answers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
