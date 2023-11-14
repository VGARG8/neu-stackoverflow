import React, { useState, useEffect } from "react";
import Tag from "./tag";
import { timeSince } from "../timeHelper";

/**
 * Component that displays a list of questions, with options to sort and filter.
 *
 * @param {Function} setSelectedTag - Function to set the selected tag.
 * @param {Array} questions - Array of all available questions.
 * @param {Array} tags - Array of all available tags.
 * @param {Function} setActivePage - Function to change the active page.
 * @param {Function} onQuestionClick - Function called when a question is clicked.
 * @returns {JSX.Element} The rendered list of questions.
 */
function QuestionList({
  setSelectedTag,
  questions,
  tags,
  setActivePage,
  onQuestionClick,
}) {
  // console.log("Received questions in QuestionList:", questions);
  // console.log("Received tags in QuestionList:", tags);

  // State for sorting and displaying questions
  const [sortMode, setSortMode] = useState("newest");
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  // Handler for when a question is clicked. Increments its view count.
  const handleQuestionClick = (question) => {
    question.views += 1;
    onQuestionClick(question);
  };

  // Handler for tag click. Navigates to the tag-specific questions page.
  const handleTagClick = (tag, event) => {
    event.stopPropagation();
    setSelectedTag(tag);
    setActivePage("questionsByTag");
  };

  // Sorting functions
  const sortByNewest = (a, b) =>
    new Date(b.ask_date_time) - new Date(a.ask_date_time);
  const sortByActive = (a, b) => b.views - a.views;

  useEffect(() => {
    if (questions) {
      let updatedQuestions = [...questions];
      switch (sortMode) {
        case "newest":
          updatedQuestions.sort(sortByNewest);
          break;
        case "active":
          updatedQuestions.sort(sortByActive);
          break;
        case "unanswered":
          updatedQuestions = updatedQuestions.filter(
            (q) => Array.isArray(q.answers) && q.answers.length === 0
          );
          break;
        default:
          break;
      }

      // console.log(
      //   "Updated questions after sorting/filtering:",
      //   updatedQuestions
      //);
      if (
        JSON.stringify(updatedQuestions) !== JSON.stringify(displayedQuestions)
      ) {
        setDisplayedQuestions(updatedQuestions);
      }
    }
  }, [sortMode, questions]);

  return (
    <div className="question-list">
      <div className="question-list-header">
        <h2>All Questions</h2>
        <button
          className="ask-new-question"
          onClick={() => setActivePage("askQuestion")}
        >
          Ask a Question
        </button>
      </div>
      <div className="question-list-subheader">
        <span>{displayedQuestions.length} questions</span>
        <div className="question-filter-buttons">
          <button onClick={() => setSortMode("newest")}>Newest</button>
          <button onClick={() => setSortMode("active")}>Active</button>
          <button onClick={() => setSortMode("unanswered")}>Unanswered</button>
        </div>
      </div>
      {displayedQuestions.map((question) => {
        const timeInfo = timeSince(
          new Date(question.ask_date_time),
          "question"
        );

        return (
          <div
            key={question._id}
            className="question"
            onClick={() => handleQuestionClick(question)}
          >
            <div className="question-header">
              <div className="question-stats postStats">
                <span>{question.views} views</span>
                <span>
                  {Array.isArray(question.answers)
                    ? question.answers.length
                    : 0}{" "}
                  answers
                </span>
              </div>
              <div className="question-title">
                <h3 className="postTitle">{question.title}</h3>
              </div>
              <div className="question-post-details lastActivity">
                <span>
                  {question.askedBy} {timeInfo.time}
                  {timeInfo.addAgo ? " ago" : ""}
                </span>
              </div>
            </div>
            <div className="question-tags">
              {question.tags.map((tag) => (
                <Tag key={tag._id} tag={tag} onClick={handleTagClick} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuestionList;
