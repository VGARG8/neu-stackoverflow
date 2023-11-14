import React, { useState, useEffect, useCallback } from "react";
import AskQuestionForm from "./asknewquestion.js";
import AnswerForm from "./answerform.js";
import Header from "./header.js";
import Sidebar from "./sidebar.js";
import QuestionList from "./homepage.js";
import TagList from "./taglist.js";
import useData from "./usedata.js";
import AnswerPage from "./answerpage.js";

function FakeStackOverflow() {
  const { data, loading, error, addQuestion, addAnswer } = useData();

  //console.log("Data in FakeStackOverflow:", data);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activePage, setActivePage] = useState("questions");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const questions = data ? data.questions : [];
  const tags = data ? data.tags : [];
  const answers = data ? data.answers : [];

  const handleSearch = useCallback((searchResults) => {
    setFilteredQuestions(searchResults);
    setActivePage("search");
  }, []);

  useEffect(() => {
    if (activePage !== "search" && questions && questions.length > 0) {
      setFilteredQuestions(questions);
    }
  }, [activePage, questions]);

  const handleAddAnswer = (qid, answer) => {
    addAnswer(qid, answer);
  };

  useEffect(() => {
    if (selectedQuestion) {
      const updatedQuestion = questions.find(
        (q) => q._id === selectedQuestion._id
      );
      console.log("Updated Question:", updatedQuestion);
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
  };

  let displayedQuestions = selectedTag
    ? questions.filter((q) =>
        q.tags.map((t) => t._id).includes(selectedTag._id)
      )
    : filteredQuestions;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //console.log("displayedQuestions:", displayedQuestions);
  //console.log("tags:", tags);

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
            qid={selectedQuestion._id}
            onSubmit={handleAddAnswer}
            setActivePage={setActivePage}
          />
        ) : activePage === "detailedQuestion" && selectedQuestion ? (
          <AnswerPage
            question={selectedQuestion}
            tags={tags}
            answers={answers.filter((answer) =>
              selectedQuestion.answers.some((a) => a._id === answer._id)
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
