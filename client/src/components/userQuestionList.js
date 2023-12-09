import { timeSince } from "../timeHelper";
import React, { useEffect, useState } from "react";
import { useAuth } from "./authContext";
import PropTypes from "prop-types";



const UserQuestionList = ({
                              questions,
                                deleteQuestionById
                          }) => {
    const { currentUser } = useAuth();
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [sortMode, setSortMode] = useState("newest");

    useEffect(() => {
        const filtered = questions.filter(
            (question) => question.author_email === currentUser.user.email
        );
        setFilteredQuestions(filtered);
    }, [questions, currentUser.user.email]);

    useEffect(() => {
        let updatedQuestions = [...filteredQuestions];

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

        setDisplayedQuestions(updatedQuestions);
    }, [sortMode, filteredQuestions]);

    const sortByNewest = (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt);
    const sortByActive = (a, b) => b.views - a.views;

    const handleDeleteQuestion = async (questionId) => {
        try {
            await deleteQuestionById(questionId); // Call deleteQuestionById with the questionId
        } catch (error) {
            console.error('Error handling delete question:', error);
            // Handle error states if needed
        }
    };


    return (
        <div className="userQuestionList">
            <div className="question-list-subheader">
                <span>{displayedQuestions.length} questions</span>
                <div className="question-filter-buttons">
                    <button onClick={() => setSortMode("newest")}>Newest</button>
                    <button onClick={() => setSortMode("active")}>Active</button>
                    <button onClick={() => setSortMode("unanswered")}>Unanswered</button>
                </div>
            </div>

            {displayedQuestions.map((question) => {
                const timeInfo = timeSince(new Date(question.createdAt), "question");

                return (
                    <div key={question._id} className="question">
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
                  Posted {timeInfo.time}
                    {timeInfo.addAgo ? " ago" : ""}
                </span>
                            </div>
                        </div>
                        <div className="question-actions">
                            <button onClick= {() => handleDeleteQuestion(question)}>
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

UserQuestionList.propTypes = {

    questions: PropTypes.array.isRequired,
    deleteQuestionById:PropTypes.func.isRequired

};

export default UserQuestionList;
