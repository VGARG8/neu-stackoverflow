import React, { useState, useEffect, useCallback } from "react";
import AskQuestionForm from "./asknewquestion.js";
import AnswerForm from "./answerform.js";
import Header from "./header.js";
import Sidebar from "./sidebar.js";
import QuestionList from "./homepage.js";
import TagList from "./taglist.js";
import useData from "./usedata.js";
import AnswerPage from "./answerpage.js";
import LoginForm from "./LoginForm.js";
import RegistrationForm from "./registrationForm.js";
import useAuthApi from "./useAuthApi.js";
import { useAuth } from "./authContext.js";

function FakeStackOverflow() {
  const {
    data,
    loading,
    error,
    addQuestion,
    addAnswer,
    incrementQuestionViews,
  } = useData();

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activePage, setActivePage] = useState("questions");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const { registerUser, loginUser, authError } = useAuthApi();
  const { login} = useAuth();

  const questions = data ? data.questions : [];
  const tags = data ? data.tags : [];
  const answers = data ? data.answers : [];

  const handleLoginClick = () => {
    setActiveForm("login");
    setActivePage(null);
  };

  const handleRegisterClick = () => {
    setActiveForm("register");
    setActivePage(null);
  };

  const handleSearch = useCallback((searchResults) => {
    setFilteredQuestions(searchResults);
    setActivePage("search");
  }, []);

  useEffect(() => {
    if (activePage !== "search" && questions && questions.length > 0) {
      setFilteredQuestions(questions);
    }
  }, [activePage, questions]);

  const handleAddAnswer = async (qid, answer) => {
    try {
      await addAnswer(qid, answer);
    } catch (error) {
      console.error("Error adding a new answer: ", error);
    }
  };

  useEffect(() => {
    if (selectedQuestion) {
      const updatedQuestion = questions.find(
        (q) => q._id === selectedQuestion._id
      );
      setSelectedQuestion(updatedQuestion);
    }
  }, [questions, selectedQuestion]);

  const handleSetActivePage = (page) => {
    if (page === "questions") {
      setSelectedTag(null);
      setFilteredQuestions(questions);
    }
    setSelectedQuestion(null);
    setActivePage(page);
    setActiveForm(null); 
  };

  let displayedQuestions = selectedTag
    ? questions.filter((q) =>
        q.tags.map((t) => t._id).includes(selectedTag._id)
      )
    : filteredQuestions;

  const handleRegisterPost = async (userData) => {
    await registerUser(userData);
    if (!authError) {
      // Handle successful registration
    }
  };

  const handleLoginPost = async (credentials) => {
    const responseData = await loginUser(credentials);
    if (responseData) {
      console.log(
        "This is the data from useAuthApi: ",
        JSON.stringify(responseData, null, 2)
      );
      login(responseData.user);
      window.location.href = "/welcome";
    } else {
      // Handle unsuccessful login
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="fake-stack-overflow">
      <Header
        onSearch={handleSearch}
        questions={questions}
        tags={tags}
        answers={answers}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
      />

      <div className="main-content">
        <Sidebar
          activePage={activePage}
          setActivePage={handleSetActivePage}
          resetSelectedQuestion={() => setSelectedQuestion(null)}
        />

        {activeForm === "login" && <LoginForm onLogin={handleLoginPost} />}
        {activeForm === "register" && (
          <RegistrationForm onRegister={handleRegisterPost} />
        )}

        {!activeForm && (
          <>
            {activePage === "askQuestion" && (
              <AskQuestionForm
                onSubmit={addQuestion}
                setActivePage={setActivePage}
              />
            )}
            {activePage === "tags" && (
              <TagList
                tags={tags}
                questions={questions}
                setActivePage={setActivePage}
                setSelectedTag={setSelectedTag}
              />
            )}
            {activePage === "answerQuestion" && selectedQuestion && (
              <AnswerForm
                qid={selectedQuestion._id}
                onSubmit={handleAddAnswer}
                setActivePage={setActivePage}
              />
            )}
            {activePage === "detailedQuestion" && selectedQuestion && (
              <AnswerPage
                question={selectedQuestion}
                tags={tags}
                answers={selectedQuestion.answers}
                setActivePage={setActivePage}
                setSelectedTag={setSelectedTag}
              />
            )}
            {activePage === "questions" && (
              <QuestionList
                setSelectedTag={setSelectedTag}
                questions={displayedQuestions}
                tags={tags}
                setActivePage={setActivePage}
                incrementQuestionViews={incrementQuestionViews}
                onQuestionClick={(question) => {
                  setSelectedQuestion(question);
                  setActivePage("detailedQuestion");
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FakeStackOverflow;
