const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

exports.postAnswer = async (req, res) => {
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
};