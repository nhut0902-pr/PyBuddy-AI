// src/components/LoadingSpinner.jsx (Đã sửa lỗi)
import React from 'react';

// Dòng 'import ./LoadingSpinner.css' đã được XÓA khỏi đây.

const LoadingSpinner = () => {
  return <div className="spinner"></div>;
};

const styles = `
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LoadingSpinner;
