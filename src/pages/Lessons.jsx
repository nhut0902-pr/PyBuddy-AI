import React, { useState } from 'react';
import { courseData } from '../data/courseData';
import LoadingSpinner from '../components/LoadingSpinner';

const Lessons = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLessonContent = async (lessonTitle) => {
    setSelectedLesson(lessonTitle);
    setIsLoading(true);
    setError('');
    setLessonContent('');

    const prompt = `Create a detailed Python lesson for a complete beginner on the topic: "${lessonTitle}".
    Structure the lesson with:
    1. A simple introduction to the concept.
    2. Clear explanations with simple language.
    3. At least 2-3 code examples with comments explaining each line.
    4. A short summary at the end.
    Format the output clearly.`;

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to fetch lesson content.');

      const data = await response.json();
      setLessonContent(data.reply);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Bite-sized Python Lessons</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          {courseData.map(section => (
            <div key={section.id} className="card">
              <h3 style={{ marginTop: 0 }}>{section.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {section.lessons.map(lesson => (
                  <li key={lesson.id}
                      onClick={() => fetchLessonContent(lesson.title)}
                      style={{ padding: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ flex: 2 }}>
          <div className="card" style={{ minHeight: '400px' }}>
            {isLoading && <LoadingSpinner />}
            {error && <p style={{ color: 'var(--error-color)' }}>{error}</p>}
            {lessonContent && (
              <>
                <h2>{selectedLesson}</h2>
                <pre>{lessonContent}</pre>
              </>
            )}
            {!isLoading && !lessonContent && <p>Select a lesson from the left to begin.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
