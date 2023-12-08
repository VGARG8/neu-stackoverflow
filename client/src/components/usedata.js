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
      console.log("Response data:", response.data);
      console.log("Answers:", response.data.answers);
      console.log("Accepted answer:", response.data.accepted_answer);
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
      await axios.post(`${SERVER_URL}/questions`, question, {
        withCredentials: true,
      });
      fetchQuestions(); // Refresh the questions list
    } catch (err) {
      console.error("Error adding a new question:", err);
    }
  };

  // Add a new answer
  const addAnswer = async (qid, answerDetails) => {
    try {
      const payload = {
        ...answerDetails,
        questionId: qid,
      };

      await axios.post(`${SERVER_URL}/answers`, payload, {
        withCredentials: true,
      });

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

  // Add a new comment
  const addComment = async (parentId, commentDetails) => {
    try {
      const payload = {
        ...commentDetails,
        parentId,
      };

      console.log('Payload:', payload); // Log the payload

      const endpoint = commentDetails.parentType === 'Question' 
        ? `${SERVER_URL}/questions/${parentId}/comments` 
        : `${SERVER_URL}/answers/${parentId}/comments`;

      await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      // Fetch the updated question only if parentType is 'Answer'
      let updatedQuestion;
      if (commentDetails.parentType === 'Answer') {
        updatedQuestion = await fetchQuestionById(commentDetails.questionId);
      } else {
        updatedQuestion = await fetchQuestionById(parentId);
      }

      // Update the questions array with the updated question
      setData((prevData) => {
        const updatedQuestions = prevData.questions.map((question) =>
          question._id === parentId ? updatedQuestion : question
        );
        return { ...prevData, questions: updatedQuestions };
      });
    } catch (err) {
      console.error("Error adding a new comment:", err);
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
      await axios.post(`${SERVER_URL}/questions/${questionId}/upvote`, {
        withCredentials: true,
      });
      // optimistically update the UI
    } catch (err) {
      console.error("Error upvoting question:", err);
    }
  };

  // Function to handle downvoting a question
  const downvoteQuestion = async (questionId) => {
    try {
      await axios.post(`${SERVER_URL}/questions/${questionId}/downvote`, {
        withCredentials: true,
      });
      // optimistically update the UI
    } catch (err) {
      console.error("Error downvoting question:", err);
    }
  };

  // Function to handle upvoting an answer
  const upvoteAnswer = async (answerId) => {
    try {
      await axios.post(`${SERVER_URL}/answers/${answerId}/upvote`, {
        withCredentials: true,
      });

      // optimistically update the UI to reflect the new vote count
    } catch (err) {
      console.error("Error upvoting answer:", err);
    }
  };

  // Function to handle downvoting an answer
  const downvoteAnswer = async (answerId) => {
    try {
      await axios.post(`${SERVER_URL}/answers/${answerId}/downvote`, {
        withCredentials: true,
      });

      // optimistically update the UI here
    } catch (err) {
      console.error("Error downvoting answer:", err);
    }
  };

  const acceptAnswer = async (questionId, answerId) => {
    try {
      await axios.patch(
        `${SERVER_URL}/questions/${questionId}/accept-answer`,
        {
          answerId,
        },
        {
          withCredentials: true,
        }
      );

    } catch (err) {
      console.error("Error accepting answer:", err);
    }
  };


const upvoteComment = async (commentId) => {
  try {
    await axios.post(`${SERVER_URL}/comments/${commentId}/upvote`, {}, {
      withCredentials: true,
    });
    // Handle the response here
  } catch (err) {
    console.error("Error upvoting comment:", err);
  }
};

const downvoteComment = async (commentId) => {
  try {
    await axios.post(`${SERVER_URL}/comments/${commentId}/downvote`, {}, {
      withCredentials: true,
    });
    // Handle the response here
  } catch (err) {
    console.error("Error downvoting comment:", err);
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
    addComment, 
    fetchQuestionById,
    fetchAnswersByQuestionId,
    incrementQuestionViews,
    upvoteQuestion,
    downvoteQuestion,
    upvoteAnswer,
    downvoteAnswer,
    acceptAnswer,
    upvoteComment,
    downvoteComment
  };
};

export default useData;
