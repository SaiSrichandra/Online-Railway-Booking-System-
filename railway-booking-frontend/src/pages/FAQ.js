import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/faqs');
        setFaqs(response.data);
      } catch (err) {
        console.error('Error fetching FAQs', err);
      }
    };

    fetchFAQs();
  }, []);

  const submitQuestion = async () => {
    try {
      await axios.post('http://localhost:3000/api/questions', { question });
      alert('Question submitted successfully');
    } catch (err) {
      console.error('Error submitting question', err);
    }
  };

  return (
    <div>
      <h2>FAQs</h2>
      {faqs.map((faq, index) => (
        <div key={index}>
          <p><strong>Q:</strong> {faq.Question}</p>
          <p><strong>A:</strong> {faq.Answer}</p>
        </div>
      ))}
      <input 
        type="text" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        placeholder="Ask a question" 
      />
      <button onClick={submitQuestion}>Submit Question</button>
    </div>
  );
};

export default FAQ;
