import React from 'react';

const spinnerStyle = {
  border: '4px solid rgba(0, 0, 0, 0.1)',
  borderLeft: '4px solid #3498db',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
  display: 'inline-block',
};

const spinnerAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;


const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = spinnerAnimation;
document.head.appendChild(styleSheet);  

const Spinner = () => {
  return <div style={spinnerStyle}></div>;
};

export default Spinner;
