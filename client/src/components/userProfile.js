import React, { useState} from 'react';

import PropTypes from "prop-types";


import UserQuestionList from "./userQuestionList";
import {useAuth} from "./authContext";
import UserAnswers from "./userAnswers";
import UserTag from "./userTag";

function UserProfile({
    setSelectedTag,
    questions,
    setActivePage,
    onQuestionClick,
    answers,
    tags,
    deleteQuestionById,
    deleteAnswerById
   }
) {
    const [childActivePage, setChildActivePage] = useState();
    const { currentUser } = useAuth();
  if (!currentUser) {
    return <div>Please log in to view this page.</div>;
  }
    // Handler for when a question is clicked. Increments its view count.

    function handleQuestionsClick() {
      setChildActivePage("userQuestionList");
    }
    function handleAnswersClick() {
        setChildActivePage("userAnswers");
    }

    function handleTagsClick() {
        setChildActivePage("userTag");
    }

    return (
    <div className="user-profile">
      <h1>User Profile</h1>
      <p>Username: {currentUser.user.username}</p>
      <p>Reputation: {currentUser.user.reputation}</p>
        <div className="user-qat-subheader">
            <div className="qat-filter-buttons">
                <button onClick={handleQuestionsClick}>Questions</button>
                <button onClick={handleAnswersClick}>Answers</button>
                <button onClick={handleTagsClick}>Tags</button>
            </div>
        </div>
        {childActivePage === 'userQuestionList' && <UserQuestionList
            setSelectedTag={setSelectedTag}
            questions={questions}
            setActivePage={setActivePage}
            deleteQuestionById={deleteQuestionById}
            onQuestionClick={onQuestionClick}
        />}

        {childActivePage ==='userAnswers' && <UserAnswers
            answers={answers}
            questions = {questions}
            deleteAnswerById = {deleteAnswerById}

            />

        }
        {childActivePage ==='userTag' && <UserTag
            questions = {questions}
            tags = {tags}
            />

        }

    </div>
  );
}

UserProfile.propTypes = {
    setSelectedTag: PropTypes.func.isRequired,
    questions: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    setActivePage: PropTypes.func.isRequired,
    onQuestionClick: PropTypes.func.isRequired,
    answers: PropTypes.array.isRequired,
    deleteQuestionById:PropTypes.func.isRequired,
    deleteAnswerById : PropTypes.func.isRequired

};
export default UserProfile;
