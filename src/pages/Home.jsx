import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="page-title" style={{ fontSize: '3rem' }}>Beginner-friendly Python tutorials in your pocket.</h1>
      <p style={{ color: 'var(--text-muted-color)', fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
        Learn Python from scratch with AI-powered lessons, interactive quizzes, and a built-in code compiler.
      </p>
      <Link to="/lessons" className="button" style={{ marginTop: '2rem' }}>
        Start Python Course
      </Link>
    </div>
  );
};

export default Home;
