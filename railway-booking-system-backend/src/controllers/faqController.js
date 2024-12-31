// controllers/faqController.js
const db = require("../models/db");

// Get all FAQs (anyone can view)
exports.getFAQs = (req, res) => {
  const query = `SELECT * FROM Question WHERE IsAnswered = 1`;  // Only answered questions

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching FAQs" });
    }
    res.status(200).json({ faqs: results });
  });
};

// Submit a new question
exports.submitQuestion = (req, res) => {
  const { customerId, question } = req.body;

  if (!question || !customerId) {
    return res.status(400).json({ message: "Question and customer ID are required" });
  }

  const query = `INSERT INTO Question (CustomerID, Question, IsAnswered) VALUES (?, ?, ?)`;

  db.query(query, [customerId, question, 0], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error submitting question" });
    }
    res.status(201).json({ message: "Question submitted successfully", questionId: result.insertId });
  });
};

// Admins or Representatives can answer questions
exports.answerQuestion = (req, res) => {
  const questionId = req.params.id;
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ message: "Answer is required" });
  }

  const query = `UPDATE Question SET Answer = ?, IsAnswered = 1 WHERE QuestionID = ?`;

  db.query(query, [answer, questionId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error answering question" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question answered successfully" });
  });
};

// Get all unanswered questions (for representatives)
exports.getUnansweredQuestions = (req, res) => {
  const query = `SELECT * FROM Question WHERE IsAnswered = 0`;  // Only unanswered questions

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching unanswered questions" });
    }

    res.status(200).json({ questions: results });
  });
};

