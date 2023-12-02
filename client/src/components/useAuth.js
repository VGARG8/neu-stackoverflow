import { useState } from "react";
import axios from "axios";

const useAuth = () => {
  const SERVER_URL = "http://localhost:8000";
  const [authError, setAuthError] = useState(null);

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
          // this would be a succesful login and we should store a token from the 
          // server in the public dir
          // have to now work on all other components to check for login status
          
      } else {
        // Handle unsuccessful login
        setAuthError("Login failed");
      }
    } catch (error) {
      console.error("Error in logging in:", error);
      setAuthError(error.message);
    }
  };

  // To do make a logout

  return {
    registerUser,
    loginUser,
    authError,
    // Include any other relevant states or functions
  };
};

export default useAuth;
