import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const Quiz = () => {
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuizQuestion = async () => {
    setIsLoading(true);
    setError('');
    setQuizData(null);
    setSelectedAnswer('');
    setIsAnswered(false);

    const topics = ["Python Variables", "Python Loops", "Python Functions", "Python Lists", "Python Dictionaries", "Python If-Else"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `Create a multiple-choice quiz question for a Python beginner about "${randomTopic}".
    The question should have 4 options (A, B, C, D).
    Return the result ONLY as a single, valid JSON object with the following structure:
    {
      "question": "The question text, which might include a code block.",
      "options": {
        "A": "Option A",
        "B": "Option B",
        "C": "Option C",
        "D": "Option D"
      },
      "correctAnswer": "The key of the correct option (e.g., 'A')",
      "explanation": "A brief explanation of why the correct answer is right."
    }`;

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to fetch quiz question.');

      const data = await response.json();
      // Clean up and parse the JSON from Gemini's response
      const jsonString = data.reply.replace(/```json\n|```/g, '').trim();
      setQuizData(JSON.parse(jsonString));

    } catch (err) {
      console.error("Quiz Fetch/Parse Error:", err);
      setError('Could not generate a quiz question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizQuestion();
  }, []);

  const handleAnswer = (optionKey) => {
    if (isAnswered) return;
    setSelectedAnswer(optionKey);
    setIsAnswered(true);
  };
  
  return (
    <div>
      <h1 className="page-title">Revise with Quizzes</h1>
      <div className="card">
        {isLoading && <LoadingSpinner />}
        {error && <p style={{ color: 'var(--error-color)' }}>{error}</p>}
        {quizData && (
          <div>
            <pre style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>{quizData.question}</pre>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {Object.entries(quizData.options).map(([key, value]) => {
                let buttonClass = 'quiz-option';
                if (isAnswered) {
                  if (key === quizData.correctAnswer) {
                    buttonClass += ' correct';
                  } else if (key === selectedAnswer) {
                    buttonClass += ' incorrect';
                  }
                }
                return (
                  <button key={key}
                          className={buttonClass}
                          onClick={() => handleAnswer(key)}
                          disabled={isAnswered}>
                    <strong>{key}:</strong> {value}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="card" style={{ marginTop: '2rem', borderColor: 'var(--success-color)' }}>
                <h4>Explanation</h4>
                <p>{quizData.explanation}</p>
              </div>
            )}
          </div>
        )}
        <button className="button" onClick={fetchQuizQuestion} style={{ marginTop: '2rem' }} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};


// Add these styles to your src/index.css or here
const quizStyles = `
.quiz-option {
  padding: 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--surface-color);
  color: var(--text-color);
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--primary-color);
  background-color: #1f2937cc;
}

.quiz-option.correct {
  background-color: #166534;
  border-color: var(--success-color);
  color: white;
}

.quiz-option.incorrect {
  background-color: #991b1b;
  border-color: var(--error-color);
  color: white;
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = quizStyles;
document.head.appendChild(styleSheet);


export default Quiz;
