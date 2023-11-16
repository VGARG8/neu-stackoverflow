const Question = require("../models/questions");
const Answer = require("../models/answers");
const Tag = require("../models/tags");


exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.json(tags);
  } catch (error) {
    res.status(500).send(error);
  }
};