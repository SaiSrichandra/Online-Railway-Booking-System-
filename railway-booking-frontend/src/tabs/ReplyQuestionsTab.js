import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const ReplyQuestionsTab = () => {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUnansweredQuestions();
    fetchAllQuestions(); // Fetch all questions with answers included
  }, []);

  // Fetch all unanswered questions
  const fetchUnansweredQuestions = async () => {
    try {
      const response = await axiosInstance.get(
        "/customer-rep/questions/unanswered"
      );
      setQuestions(response.data.questions);
      setError("");
    } catch (err) {
      console.error("Error fetching unanswered questions:", err);
      setError("Failed to fetch unanswered questions.");
    }
  };

  // Fetch all questions (answered and unanswered)
  const fetchAllQuestions = async () => {
    try {
      const response = await axiosInstance.get("/customer-rep/faqs");
      setAllQuestions(response.data.faqs);
      setError("");
    } catch (err) {
      console.error("Error fetching all questions:", err);
      setError("Failed to fetch all questions.");
    }
  };

  // Handle answer change
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  // Handle answer submission
  const handleAnswerSubmit = async (questionId) => {
    if (!answer.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    try {
      await axiosInstance.put(`/customer-rep/questions/${questionId}/answer`, {
        answer,
      });
      setAnswer(""); // Clear the answer input
      setSelectedQuestion(null); // Clear the selected question
      fetchUnansweredQuestions(); // Re-fetch unanswered questions
      fetchAllQuestions(); // Re-fetch all questions to update the answer
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer.");
    }
  };

  // Handle question selection
  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswer(""); // Clear any previous answer input
  };

  return (
    <div>
      <h2>Reply to Customer Questions</h2>
      {error && <p className="error">{error}</p>}

      {/* Section for Unanswered Questions */}
      <div style={{ display: "flex", marginBottom: "40px" }}>
        <div style={{ flex: 1 }}>
          <h3>Unanswered Questions</h3>
          <ul>
            {questions.map((question) => (
              <li key={question.QuestionID} style={{ marginBottom: "10px" }}>
                <p>{question.Question}</p>
                <button onClick={() => handleSelectQuestion(question)}>
                  Answer
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Section for Answering a Selected Question */}
        {selectedQuestion && (
          <div style={{ flex: 1, marginLeft: "20px" }}>
            <h3>Answer Question</h3>
            <p>
              <strong>Question:</strong> {selectedQuestion.Question}
            </p>
            <textarea
              value={answer}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              rows="4"
              style={{ width: "100%" }}
            />
            <button
              onClick={() => handleAnswerSubmit(selectedQuestion.QuestionID)}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>

      {/* Section for All Questions and Answers */}
      <div>
        <h3>All Questions and Answers</h3>
        <ul>
          {allQuestions.map((question) => (
            <li
              key={question.QuestionID}
              style={{
                marginBottom: "15px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Question:</strong> {question.Question}
              </p>
              <p>
                <strong>Answer:</strong>{" "}
                {question.IsAnswered ? question.Answer : "Not answered yet"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReplyQuestionsTab;
