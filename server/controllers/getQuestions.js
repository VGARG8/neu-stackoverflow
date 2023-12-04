const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate({
        path: 'answers',
        populate: { path: 'ans_by', select: 'username' } // Populate user details in answers
      })
      .populate('tags')
      .populate({ 
        path: 'asked_by', 
        select: 'username' // Only fetch the username field from User collection
      });

    res.json(questions);
    console.log("This is the questions from the getQuestions controller on the server: ", questions);
  } catch (error) {
    res.status(500).send(error);
  }
};
