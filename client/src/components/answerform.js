import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * A form component for users to answer questions.
 *
 * @param {string} qid - The question ID for which the answer is being posted.
 * @param {Function} onSubmit - Function to handle submission of the form.
 * @param {Function} setActivePage - Function to set the active page view.
 */
function AnswerForm({ qid, onSubmit, setActivePage }) {
  AnswerForm.propTypes = {
    qid: PropTypes.string.isRequired, // Update the type if it's not a string
    onSubmit: PropTypes.func.isRequired,
    setActivePage: PropTypes.func.isRequired,
  };

  //console.log("The id:", qid);

  const [text, setText] = useState(""); // Answer text state
  const [username, setUsername] = useState(""); // Username state
  const [textError, setTextError] = useState(""); // Error message for the answer text
  const [usernameError, setUsernameError] = useState(""); // Error message for the username

  const hyperlinkPattern = /\[([^\]]+)]\((https?:\/\/[^)]+)\)/g; // Regular expression pattern for hyperlinks

  /**
   * Validates hyperlinks in the provided text.
   *
   * @param {string} text - The text to validate for hyperlinks.
   * @returns {boolean} True if all hyperlinks are valid, false otherwise.
   */
  const validateHyperlinks = (text) => {
    let match;
    while ((match = hyperlinkPattern.exec(text)) !== null) {
      const linkName = match[1];
      const url = match[2];
      if (!linkName || !url || !url.startsWith("https://")) {
        return false;
      }
    }
    return true;
  };

  /**
   * Handles the submission of the form.
   *
   * @param {Event} e - The submit event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateHyperlinks(text)) {
      setTextError("Invalid hyperlink");
      return;
    }

    // Validations
    let isValid = true;
    if (!text) {
      setTextError("Answer text cannot be empty");
      isValid = false;
    } else {
      setTextError("");
    }
    if (!username) {
      setUsernameError("Username cannot be empty");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (isValid) {
      onSubmit(qid, {
        // Use qid here
        text,
        ans_by: username,
      });
      setActivePage("detailedQuestion");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="answerUsernameInput"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      {usernameError && <p>{usernameError}</p>}

      <textarea
        id="answerTextInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your Answer"
      />
      {textError && <p>{textError}</p>}

      <button type="submit">Post Answer</button>
    </form>
  );
}

export default AnswerForm;
