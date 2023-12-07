import React, { useState } from "react";
import Tag from "./tag.js";
import { timeSince } from "../timeHelper.js";
import PropTypes from "prop-types";
import { useAuth } from "./authContext.js";
import useData from "./usedata.js";

const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g;

/**
 * AnswerPage component to display a question and its associated answers.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.question - The question object to display.
 * @param {Array} props.tags - The list of tags available.
 * @param {Array} props.answers - The list of answers associated with the question.
 * @param {Function} props.setActivePage - Function to set the current active page/view.
 * @param {Function} props.setSelectedTag - Function to set the currently selected tag.
 * @returns {JSX.Element} The rendered question and its answers.
 */
function AnswerPage({ question, answers, setActivePage, setSelectedTag }) {
  console.log('Question:', question);
  console.log('Answers:', answers);

  const { currentUser } = useAuth();
  const { upvoteAnswer, downvoteAnswer, acceptAnswer, addComment } = useData();
  const answersPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [commentText, setCommentText] = useState({});

  // Identify if there is an accepted answer and separate it from other answers
  const acceptedAnswer = answers.find(
    (answer) => answer._id === question.accepted_answer
  );
  const otherAnswers = answers.filter(
    (answer) => answer._id !== question.accepted_answer
  );

  const questionAskerId = question.asked_by._id.toString();

  const handleAcceptAnswer = async (answerId) => {
    await acceptAnswer(question._id, answerId);
    // Handle any UI updates
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(
    (acceptedAnswer ? otherAnswers.length : answers.length) / answersPerPage
  );

  // Change page handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate paginated answers
  const startIndex = acceptedAnswer
    ? (currentPage - 1) * answersPerPage
    : currentPage * answersPerPage - answersPerPage;
  const paginatedAnswers = acceptedAnswer
    ? [
        acceptedAnswer,
        ...otherAnswers.slice(startIndex, startIndex + answersPerPage - 1),
      ]
    : answers.slice(startIndex, startIndex + answersPerPage);

  const handleAnswerVote = async (event, answerId, voteType) => {
    event.stopPropagation();
    if (voteType === "upvote") {
      await upvoteAnswer(answerId);
    } else {
      await downvoteAnswer(answerId);
    }
    //  refresh the answers list or optimistically
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (commentText[postId]?.trim() === "") return;
    await addComment(postId, commentText[postId]);
    setCommentText(prevCommentText => ({ ...prevCommentText, [postId]: "" }));
  };

  /**
   * Handles the click event on a tag.
   * Sets the clicked tag as the selected tag and changes the active page/view to 'questionsByTag'.
   *
   * @param {Object} tag - The clicked tag object.
   * @param {Object} event - The event object.
   */
  const handleClickTag = (tag, event) => {
    event.stopPropagation();
    setSelectedTag(tag);
    setActivePage("questionsByTag");
  };

  /**
   * Renders text by replacing markdown-style links with actual hyperlinks.
   *
   * @param {string} text - The text to be rendered with hyperlinks.
   * @returns {Array} An array containing strings and JSX anchor elements.
   */
  const renderWithLinks = (text) => {
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = hyperlinkPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a href={match[2]} target="_blank" rel="noopener noreferrer">
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(text.substring(lastIndex));

    return parts;
  };

  return (
    <div className="answer-page">
      {/* Question section with score visible to all users */}
      <div className="question-score-section">
        <span className="question-score">Score: {question.score}</span>
        {/* Question voting section shown only to logged-in users */}
        {currentUser && (
          <div className="question-vote-buttons">
            <button
              onClick={(event) =>
                handleAnswerVote(event, question._id, "upvote")
              }
            >
              Upvote
            </button>
            <button
              onClick={(event) =>
                handleAnswerVote(event, question._id, "downvote")
              }
            >
              Downvote
            </button>
          </div>
        )}
      </div>

      <div id="answersHeader" className="row">
        <span>{answers.length} answers</span>
        <h2>{question.title}</h2>
        {currentUser && (
          <button onClick={() => setActivePage("askQuestion")}>
            Ask a Question
          </button>
        )}
      </div>

      <div id="questionBody" className="row">
        <span>{question.views} views</span>
        <p>{renderWithLinks(question.text)}</p>
        <small>
          {question.asked_by?.username || "Unknown User"}{" "}
          {timeSince(new Date(question.createdAt), "question").time}
          {timeSince(new Date(question.createdAt), "question").addAgo
            ? " ago"
            : ""}
        </small>
      </div>

      <div className="question-comments">
        {question.comments.map((comment) => {
          console.log('Comment:', comment);
          return (
            <div key={comment._id} className="comment">
              <p>{comment.text}</p>
              <small>
                Commented by {comment.commented_by.username}{" "}
                {timeSince(new Date(comment.createdAt), "comment").time}
                {timeSince(new Date(comment.createdAt), "comment").addAgo
                  ? " ago"
                  : ""}
              </small>
              <div>Votes: {comment.votes}</div>
            </div>
          );
        })}
        {currentUser && (
          <form onSubmit={(e) => handleAddComment(e, question._id)}>
            <input
              type="text"
              value={commentText[question._id] || ""}
              onChange={(e) => setCommentText(prevCommentText => ({ ...prevCommentText, [question._id]: e.target.value }))}
              placeholder="Add a comment"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      <div className="tags-row">
        <hr style={{ borderStyle: "dotted" }} />
        {question.tags.map((tag) => {
          console.log('Tag:', tag);
          return (
            <Tag key={tag._id} tag={tag} onClick={handleClickTag} />
          );
        })}
        <hr style={{ borderStyle: "dotted" }} />
      </div>

      <div className="answers">
        {paginatedAnswers.map((answer) => {
          console.log('Paginated answer:', answer);
          return (
            <div key={answer._id} className="answer">
              {/* Answer score visible to all users */}
              <span className="answer-score">Score: {answer.score}</span>
              {/* Answer voting buttons shown only to logged-in users */}
              {currentUser && (
                <div className="answer-vote-buttons">
                  <button
                    onClick={(event) =>
                      handleAnswerVote(event, answer._id, "upvote")
                    }
                  >
                    Upvote
                  </button>
                  <button
                    onClick={(event) =>
                      handleAnswerVote(event, answer._id, "downvote")
                    }
                  >
                    Downvote
                  </button>
                </div>
              )}
              <p className="answerText">{renderWithLinks(answer.text)}</p>
              <small className="answerAuthor">
                {answer.ans_by.username}{" "}
                {timeSince(new Date(answer.createdAt), "answer").time}
                {timeSince(new Date(answer.createdAt), "answer").addAgo
                  ? " ago"
                  : ""}
              </small>
              {/* Button to mark an answer as accepted, visible only to the question asker */}
              {currentUser && currentUser.user.id === questionAskerId && (
                <button onClick={() => handleAcceptAnswer(answer._id)}>
                  Accept Answer
                </button>
              )}
              {/* Indicator for the accepted answer */}
              {question.accepted_answer &&
                question.accepted_answer._id === answer._id.toString() && (
                  <div className="accepted-answer-indicator">
                    <strong>Accepted Answer</strong>
                  </div>
                )}
              <div className="answer-comments">
                {answer.comments.map((comment) => {
                  console.log('Comment:', comment);
                  console.log('Commented by:', comment.commented_by);
                  console.log('Created at:', comment.createdAt);
                  return (
                    <div key={comment._id} className="comment">
                      <p>{comment.text}</p>
                      <small>
                        Commented by {comment.commented_by ? comment.commented_by.username : "Unknown User"}{" "}
                        {timeSince(new Date(comment.createdAt), "comment").time}
                        {timeSince(new Date(comment.createdAt), "comment").addAgo
                          ? " ago"
                          : ""}
                      </small>
                      <div>Votes: {comment.votes}</div>
                    </div>
                  );
                })}
                {currentUser && (
                  <form onSubmit={(e) => handleAddComment(e, answer._id)}>
                    <input
                      type="text"
                      value={commentText[answer._id] || ""}
                      onChange={(e) => setCommentText(prevCommentText => ({ ...prevCommentText, [answer._id]: e.target.value }))}
                      placeholder="Add a comment"
                    />
                    <button type="submit">Submit</button>
                  </form>
                )}
              </div>
              <hr style={{ borderStyle: "dotted" }} />
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {currentUser && (
        <button onClick={() => setActivePage("answerQuestion")}>
          Answer Question
        </button>
      )}
    </div>
  );
}

AnswerPage.propTypes = {
  question: PropTypes.object.isRequired,
  answers: PropTypes.array.isRequired,
  setActivePage: PropTypes.func.isRequired,
  setSelectedTag: PropTypes.func.isRequired,
};

export default AnswerPage;
