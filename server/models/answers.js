// Answer Document Schema

const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  ans_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ans_date_time: { type: Date, required: true },
});

module.exports = mongoose.model("Answer", answerSchema);
