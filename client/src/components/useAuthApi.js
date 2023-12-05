import { useState } from "react";
import axios from "axios";

const useAuthApi = () => {
  const SERVER_URL = "http://localhost:8000";
  const [authError, setAuthError] = useState(null);
  axios.defaults.withCredentials = true;

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/users/register`,
        userData
      );
      if (response.status === 201) {
        // Handle successful registration
        window.location.href = "/login"; // Redirect to login page
      } else {
        // Handle unsuccessful registration
        setAuthError("Registration failed");
      }
    } catch (error) {
      console.error("Error in registering user:", error);
      setAuthError(error.message);
    }
  };
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/users/login`,
        credentials
      );
      if (response.status === 200) {
        return response.data; // Return the response data directly if it's the user object
      } else {
        setAuthError("Login failed");
        return null;
      }
    } catch (error) {
      console.error("Error in logging in:", error);
      setAuthError(error.message);
      return null;
    }
  };

  // To do make a logout

  return {
    registerUser,
    loginUser,
    authError,
  };
};

export default useAuthApi;
