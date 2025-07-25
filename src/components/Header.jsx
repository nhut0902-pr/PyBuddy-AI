import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <NavLink to="/">PyTutor AI</NavLink>
      </div>
      <nav>
        <NavLink to="/lessons">Lessons</NavLink>
        <NavLink to="/examples">Examples</NavLink>
        <NavLink to="/quiz">Quiz</NavLink>
        <NavLink to="/compiler">Compiler</NavLink>
      </nav>
    </header>
  );
};

// Create a new file src/components/Header.css for styles
// and add the following content to it.
const styles = `
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  text-decoration: none;
}

.app-header nav {
  display: flex;
  gap: 1.5rem;
}

.app-header nav a {
  color: var(--text-muted-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.2s;
  position: relative;
}

.app-header nav a:hover {
  color: var(--text-color);
}

.app-header nav a.active {
  color: var(--primary-color);
}

.app-header nav a.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary-color);
}
`;

// Inject styles into the head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default Header;
