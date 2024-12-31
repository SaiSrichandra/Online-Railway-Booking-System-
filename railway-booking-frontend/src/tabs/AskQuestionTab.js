import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import "../styles/AskQuestionTab.css";

const AskQuestionTab = () => {
  const [question, setQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [filterMode, setFilterMode] = useState("all"); // all | mine
  const [searchKeyword, setSearchKeyword] = useState(""); // For keyword filtering
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editText, setEditText] = useState("");
  const customerId = localStorage.getItem("customerId");

  // Fetch all questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get("/customer/questions");
      setSubmittedQuestions(response.data.questions);
      applyFilter(response.data.questions, filterMode, searchKeyword);
      setError("");
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to fetch questions.");
    }
  };

  // Apply filter based on mode and keywords
  const applyFilter = (questions, mode, keyword) => {
    let filtered =
      mode === "mine"
        ? questions.filter((q) => q.CustomerID == customerId)
        : questions;

    if (keyword.trim()) {
      filtered = filtered.filter((q) =>
        q.Question.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
    applyFilter(submittedQuestions, mode, searchKeyword);
  };

  const handleKeywordSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    applyFilter(submittedQuestions, filterMode, keyword);
  };

  const handleSubmitQuestion = async () => {
    if (!customerId) {
      setError("Customer ID not found.");
      return;
    }
    if (!question.trim()) {
      setError("Question cannot be empty.");
      return;
    }
    try {
      await axiosInstance.post("/customer/questions", {
        customerId,
        questionText: question,
      });
      setSuccess("Question submitted successfully!");
      setQuestion("");
      fetchQuestions();
    } catch (err) {
      console.error("Error submitting question:", err);
      setError("Failed to submit question.");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axiosInstance.delete(`/customer/questions/${questionId}`);
      setSuccess("Question deleted successfully!");
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question.");
    }
  };

  const handleEditQuestion = async () => {
    try {
      await axiosInstance.put(`/customer/questions/${editQuestionId}`, {
        updatedQuestion: editText,
      });
      setSuccess("Question updated successfully!");
      setEditQuestionId(null);
      setEditText("");
      fetchQuestions();
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question.");
    }
  };

  return (
    <div>
      <h3>Ask a Question</h3>
      <div>
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="small" onClick={handleSubmitQuestion}>
          Submit Question
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Buttons to toggle between All Questions and My Questions */}
      <div>
        <button onClick={() => handleFilterChange("all")} className="small">
          All Questions
        </button>
        <button onClick={() => handleFilterChange("mine")} className="small">
          My Questions
        </button>
      </div>

      {/* Search input for keyword filtering */}
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchKeyword}
          onChange={handleKeywordSearch}
        />
      </div>

      <h4>
        {filterMode === "mine" ? "My Submitted Questions" : "All Questions"}
      </h4>
      {filteredQuestions.length > 0 ? (
        <ul>
          {filteredQuestions.map((q) => (
            <li key={q.QuestionID}>
              {editQuestionId === q.QuestionID ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button className="small" onClick={handleEditQuestion}>
                    Save
                  </button>
                  <button
                    className="small"
                    onClick={() => setEditQuestionId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p>
                    <strong>Question:</strong> {q.Question}
                  </p>
                  <p>
                    <strong>Answer:</strong> {q.Answer || "Not answered yet"}
                  </p>
                  {filterMode === "mine" && customerId == q.CustomerID && (
                    <div>
                      <button
                        onClick={() => handleDeleteQuestion(q.QuestionID)}
                        className="small"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setEditQuestionId(q.QuestionID);
                          setEditText(q.Question);
                        }}
                        className="small"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default AskQuestionTab;
