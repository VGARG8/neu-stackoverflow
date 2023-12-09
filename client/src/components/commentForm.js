// CommentForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CommentForm({ parentId, parentType, questionId, addComment }) {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    await addComment(parentId, { text: commentText, parentType, questionId });
    setCommentText('');
  };

  return (
    <form onSubmit={handleAddComment}>
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

CommentForm.propTypes = {
  parentId: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  questionId: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
};

export default CommentForm;