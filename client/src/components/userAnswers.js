import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "./authContext";
import UpdateAnswerForm from "./updateAnswerForm";


function UserAnswers({ answers, questions, deleteAnswerById,
        updateAnswerTextById
        }) {
    const { currentUser } = useAuth();
    const [displayedAnswers, setDisplayedAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [activePage, setActivePage] = useState('userAnswers');

    useEffect(() => {
        const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

        const filteredAnswers = answers
            .filter((answer) => answer.ans_by._id === currentUser.user.id)
            .sort(sortByNewest);

        setDisplayedAnswers(filteredAnswers);
    }, [answers, currentUser.user.id]);

    const handleDelete = async (_id) => {
        const q_id = findQuestionIdByAnswerId(questions, _id);
        console.log(_id, q_id);
        // if (q_id) {
        try {
            await deleteAnswerById(q_id, _id); // Call deleteQuestionById with the questionId
        } catch (error) {
            console.error('Error handling delete question:', error);
            // Handle error states if needed
        }
        // }
    };

    const handleUpdate = (_id) => {
        // Find the selected answer using its ID
        const selectedAnswer = answers.find((answer) => answer._id === _id);

        // Check if the answer is found
        if (selectedAnswer) {
            // Set the selected answer and switch to update page
            setSelectedAnswer(selectedAnswer);
            setActivePage('updateAnswer');
        } else {
            // Handle case when the answer is not found
            console.error("Selected answer not found");
        }
    };

    const findQuestionIdByAnswerId = (questionsArray, answerId) => {
        for (const question of questionsArray) {
            //   console.log(question);
            if (
                question.answers &&
                question.answers.some((answer) => answer._id === answerId)
            ) {
                //   console.log("Found "+ question);
                return question._id;
            }
        }
        return null; // If no question found containing the specified answer ID
    };

    return (
        <div className="container">
            {activePage === "userAnswers" && (
                <div className="useAnswerList">
                    {displayedAnswers.map((answer) => (
                        <div key={answer._id} className="answerBlock">
                            {/* Render each answer or its properties here */}
                            <a href={`#${answer._id}`} className="answerLink">
                                {answer.text.length > 50
                                    ? `${answer.text.substring(0, 50)}...`
                                    : answer.text}
                            </a>
                            <div className="buttons">
                                <button onClick={() => handleDelete(answer._id)}>Delete</button>
                                <button onClick={() => handleUpdate(answer._id)}>Update</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activePage === "updateAnswer" && (
                <UpdateAnswerForm
                    answer={selectedAnswer}
                    setDisplayedAnswers ={setDisplayedAnswers}
                    setActivePage={setActivePage}
                    updateAnswerTextById = {updateAnswerTextById}
                  />
            )}
        </div>
    );

}

UserAnswers.propTypes = {
    answers: PropTypes.array.isRequired,
    questions: PropTypes.array.isRequired,
    deleteAnswerById: PropTypes.func.isRequired,
    updateAnswerTextById: PropTypes.func.isRequired
};

export default UserAnswers;
