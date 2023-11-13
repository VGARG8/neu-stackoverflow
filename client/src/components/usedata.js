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
      setData(prevData => ({ ...prevData, questions: response.data }));
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Tags from the server
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/tags`);
      setData(prevData => ({ ...prevData, tags: response.data }));
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError(err);
    }
  };

  // Add a new question
  const addQuestion = async (question) => {
    try {
      await axios.post(`${SERVER_URL}/questions`, question);
      fetchQuestions(); // Refresh the questions list
    } catch (err) {
      console.error("Error adding a new question:", err);
    }
  };

  // Add a new answer
  const addAnswer = async (answer, questionId) => {
    try {
      await axios.post(`${SERVER_URL}/answers`, { answer, questionId });
      fetchQuestions(); // Refresh to show the new answer
    } catch (err) {
      console.error("Error adding a new answer:", err);
    }
  };

  // Fetch data when the component using this hook mounts
  useEffect(() => {
    fetchQuestions();
    fetchTags();
  }, []);

  return {
    data,
    loading,
    error,
    addQuestion,
    addAnswer,
    // Include other methods as needed
  };
};

export default useData;
