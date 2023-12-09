import { useState, useEffect } from "react";
import axios from "axios";

const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const SERVER_URL = "http://localhost:8000";

  // Fetch Questions from the server
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/questions`);

      //console.log("This if from the fetch quesitons: ", response);

      setData((prevData) => ({ ...prevData, questions: response.data }));
    } catch (err) {
      console.error("Error fetching questions:", err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch answers from the server
  const fetchAnswers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/answers`);

      //console.log("This is from the fetch answers: ", response);

      setData((prevData) => ({ ...prevData, answers: response.data }));
    } catch (err) {
      console.error("Error fetching answers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch question by specific id
  const fetchQuestionById = async (id) => {
    try {
      const response = await axios.get(`${SERVER_URL}/questions/${id}`);
      return response.data;
    } catch (err) {
      console.error("Error fetching question by ID:", err);
      throw err;
    }
  };

  // Fetch Tags from the server
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/tags`);
      setData((prevData) => ({ ...prevData, tags: response.data }));
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError(err);
    }
  };

  // Add a new question
  const addQuestion = async (question) => {
    try {
      await axios.post(`${SERVER_URL}/questions`, question, { withCredentials: true});
      fetchQuestions(); // Refresh the questions list
    } catch (err) {
      console.error("Error adding a new question:", err);
    }
  };

  // Add a new answer
  const addAnswer = async (qid, answerDetails) => {
    try {
      // qid for attaching to the right question
      const payload = {
        ...answerDetails,
        questionId: qid,
      };

      await axios.post(`${SERVER_URL}/answers`, payload);

      // Fetch the updated question
      const updatedQuestion = await fetchQuestionById(qid);

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === qid ? updatedQuestion : question
        );
        return { ...prevData, questions: updatedQuestions };
      });
    } catch (err) {
      console.error("Error adding a new answer:", err);
    }
  };

  const incrementQuestionViews = async (questionId) => {
    try {
      // Make a request to increment the views
      await axios.patch(
        `${SERVER_URL}/questions/${questionId}/increment-views`
      );

      // Fetch the updated question data
      const updatedQuestion = await fetchQuestionById(questionId);

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === questionId ? updatedQuestion : question
        );
        return { ...prevData, questions: updatedQuestions };
      });
    } catch (err) {
      console.error("Error incrementing question views:", err);
    }
  };

  // fetch answers for a specific question by ID
  const fetchAnswersByQuestionId = async (id) => {
    try {
      const response = await axios.get(`${SERVER_URL}/questions/${id}/answers`);
      return response.data;
    } catch (err) {
      console.error("Error fetching answers by question ID:", err);
      throw err;
    }
  };



    // Function to handle upvoting a question
  const upvoteQuestion = async (questionId) => {
    try {
      await axios.post(`${SERVER_URL}/questions/${questionId}/upvote`);
      // Refresh the questions list or optimistically update the UI
    } catch (err) {
      console.error("Error upvoting question:", err);
    }
  };

  // Function to handle downvoting a question
  const downvoteQuestion = async (questionId) => {
    try {
      await axios.post(`${SERVER_URL}/questions/${questionId}/downvote`);
      // Refresh the questions list or optimistically update the UI
    } catch (err) {
      console.error("Error downvoting question:", err);
    }
  };

  // Function to handle upvoting an answer
const upvoteAnswer = async (answerId) => {
  try {
    await axios.post(`${SERVER_URL}/answers/${answerId}/upvote`);
    // Here you might want to refresh the answers list or
    // optimistically update the UI to reflect the new vote count
  } catch (err) {
    console.error("Error upvoting answer:", err);
  }
};

// Function to handle downvoting an answer
const downvoteAnswer = async (answerId) => {
  try {
    await axios.post(`${SERVER_URL}/answers/${answerId}/downvote`);
    // Similarly, you might refresh the answers list or
    // optimistically update the UI here
  } catch (err) {
    console.error("Error downvoting answer:", err);
  }
};
  const deleteQuestionById = async (question) => {
    try {
      const answerIdsToDelete = question.answers.map((ans) => ans._id);
      const deletePromises = answerIdsToDelete.map((answerId) =>
          axios.delete(`${SERVER_URL}/answers/${answerId}`)
      );

      // Batch delete all answers
      await Promise.all(deletePromises);

      // Once all answers are deleted, delete the question
      const response = await axios.delete(`${SERVER_URL}/questions/${question._id}`);
      if (response.status === 200) {
        fetchQuestions();
        fetchAnswers(); // Assuming you need to update answers after deletion
      } else {
        console.log(response.data); // Log response data for debugging
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      // Handle error states if needed
    }
  };

  // Inside the useData hook
  const deleteAnswerById = async (questionId, answerId) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/answers/${answerId}`);
      if (response.status === 200) {
        console.log("Deleted Answer " + answerId);

        // Update the state without fetching answers again
        setData((prevData) => {
          const updatedData = { ...prevData };

          // Remove the answer from the answers array
          const updatedAnswers = (updatedData.answers || []).filter(
              (answer) => answer._id !== answerId
          );
          updatedData.answers = updatedAnswers;

          // Update the corresponding question's answers array
          if (updatedData.questions) {
            const updatedQuestions = updatedData.questions.map((question) => {
              if (question._id === questionId) {
                const updatedQuestion = { ...question };
                updatedQuestion.answers = updatedQuestion.answers.filter(
                    (ans) => ans._id !== answerId
                );
                return updatedQuestion;
              }
              return question;
            });
            updatedData.questions = updatedQuestions;
          }

          return updatedData;
        });
      } else {
        console.log(response.data); // Log response data for debugging
      }
    } catch (error) {
      console.error("Error deleting answer:", error);
      // Handle error states if needed
    }
  };





  // Fetch data
  useEffect(() => {
    fetchQuestions();
    fetchTags();
    fetchAnswers();
  }, []);

  return {
    data,
    loading,
    error,
    addQuestion,
    addAnswer,
    fetchQuestionById,
    fetchAnswersByQuestionId,
    incrementQuestionViews,
    upvoteQuestion, 
    downvoteQuestion,
    upvoteAnswer,
    downvoteAnswer,
    deleteQuestionById,
    deleteAnswerById


  };
};

export default useData;
