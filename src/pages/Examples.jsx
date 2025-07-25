import React, { useState } from 'react';
import { exampleData } from '../data/exampleData';
import LoadingSpinner from '../components/LoadingSpinner';

const Examples = () => {
  const [selectedExample, setSelectedExample] = useState('');
  const [exampleCode, setExampleCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchExampleCode = async (exampleTitle) => {
    setSelectedExample(exampleTitle);
    setIsLoading(true);
    setError('');
    setExampleCode('');

    const prompt = `Write a complete and simple Python code snippet for the following task: "${exampleTitle}".
    The code should be ready to run.
    Only return the Python code itself, without any explanation or introductory text.`;

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to fetch example code.');

      const data = await response.json();
      // Clean up the response to remove markdown code block markers
      const cleanedCode = data.reply.replace(/```python\n|```/g, '').trim();
      setExampleCode(cleanedCode);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="page-title">Skill-up with Practical Examples</h1>
       <div className="card">
        <p>Select an example to see the AI-generated code.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {exampleData.map(example => (
            <button key={example} className="button" style={{backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)'}} onClick={() => fetchExampleCode(example)}>
              {example}
            </button>
          ))}
        </div>
       </div>

      {isLoading && <LoadingSpinner />}
      {error && <p className="card" style={{ color: 'var(--error-color)' }}>{error}</p>}
      {exampleCode && (
        <div className="card">
          <h2>Code for: {selectedExample}</h2>
          <pre>{exampleCode}</pre>
        </div>
      )}
    </div>
  );
};

export default Examples;
