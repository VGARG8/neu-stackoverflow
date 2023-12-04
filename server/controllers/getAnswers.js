const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");


exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({})
      .populate({
        path: 'ans_by',
        select: 'username'
      })
      .select('text ans_by score createdAt updatedAt'); // Updated fields

    res.json(answers);
  } catch (error) {
    console.error("Error in getAnswers:", error); 
    res.status(500).send(error);
  }
};

