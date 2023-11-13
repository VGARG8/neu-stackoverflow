import React, { useState, useEffect, useCallback } from "react";
import AskQuestionForm from "./asknewquestion.js";
import AnswerForm from "./answerform.js";
import Header from "./header.js";
import Sidebar from "./sidebar.js";
import QuestionList from "./homepage.js";
import TagList from "./taglist.js";
import useData from "./usedata.js";
import AnswerPage from "./answerpage.js";

/**
 * Main component representing the fake StackOverflow UI.
 *
 * @returns {JSX.Element} The rendered component.
 */
function FakeStackOverflow() {
  // Using custom hook to retrieve and manipulate data
  const { data, loading, error, addQuestion, addAnswer } = useData();

  console.log("Data in FakeStackOverflow:", data);

  // State variables
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activePage, setActivePage] = useState("questions");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  // Check if data is available before destructuring
  const questions = data ? data.questions : [];
  const tags = data ? data.tags : [];
  const answers = data ? data.answers : [];

  // Handle search functionality
  const handleSearch = useCallback((searchResults) => {
    setFilteredQuestions(searchResults);
    setActivePage("search");
  }, []);

  // Effect to reset filtered questions when activePage changes
  useEffect(() => {
    if (activePage !== "search" && questions && questions.length > 0) {
      setFilteredQuestions(questions);
    }
  }, [activePage, questions]);

  // Adds an answer to a specific question
  const handleAddAnswer = (qid, answer) => {
    addAnswer(qid, answer);
  };

  // Update selected question when questions data changes
  useEffect(() => {
    if (selectedQuestion) {
      const updatedQuestion = questions.find(
        (q) => q.qid === selectedQuestion.qid
      );
      setSelectedQuestion(updatedQuestion);
    }
  }, [questions]);

  // Updates the active page and resets state variables
  const handleSetActivePage = (page) => {
    if (page === "questions") {
      setSelectedTag(null);
      setFilteredQuestions(questions);
    }
    setSelectedQuestion(null);
    setActivePage(page);
  };

  // Determine questions to be displayed
  let displayedQuestions = selectedTag
    ? questions.filter((q) => q.tagIds.includes(selectedTag.tid))
    : filteredQuestions;

  // Conditional rendering for loading and error states
  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message
  }

  console.log("displayedQuestions:", displayedQuestions);
  console.log("tags:", tags);

  return (
    <div className="fake-stack-overflow">
      <Header
        onSearch={handleSearch}
        questions={questions}
        tags={tags}
        answers={answers}
      />

      <div className="main-content">
        <Sidebar
          activePage={activePage}
          setActivePage={handleSetActivePage}
          resetSelectedQuestion={() => setSelectedQuestion(null)}
        />

        {/* Conditional rendering based on the active page */}
        {activePage === "askQuestion" ? (
          <AskQuestionForm
            onSubmit={addQuestion}
            setActivePage={setActivePage}
          />
        ) : activePage === "tags" ? (
          <TagList
            tags={tags}
            questions={questions}
            setActivePage={setActivePage}
            setSelectedTag={setSelectedTag}
          />
        ) : activePage === "answerQuestion" && selectedQuestion ? (
          <AnswerForm
            qid={selectedQuestion.qid}
            onSubmit={handleAddAnswer}
            setActivePage={setActivePage}
          />
        ) : activePage === "detailedQuestion" && selectedQuestion ? (
          <AnswerPage
            question={selectedQuestion}
            tags={tags}
            answers={answers.filter((answer) =>
              selectedQuestion.ansIds.includes(answer.aid)
            )}
            setActivePage={setActivePage}
            setSelectedTag={setSelectedTag}
          />
        ) : (
          <QuestionList
            setSelectedTag={setSelectedTag}
            questions={displayedQuestions}
            tags={tags}
            setActivePage={setActivePage}
            onQuestionClick={(question) => {
              setSelectedQuestion(question);
              setActivePage("detailedQuestion");
            }}
          />
        )}
      </div>
    </div>
  );
}

export default FakeStackOverflow;
