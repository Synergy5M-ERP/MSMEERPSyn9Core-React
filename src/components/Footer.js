import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#002b5b',  // fixed typo
        color: 'white',
        padding: '10px 20px',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        display: 'flex',            // use flex to center content
        justifyContent: 'center',   // horizontally center
        alignItems: 'center',       // vertically center
        fontWeight: 'bold',         // optional: make text bold
        letterSpacing: '1px',       // optional: clean look
        fontSize: '14px',           // optional: readable size
        boxShadow: '0 -2px 6px rgba(0,0,0,0.3)' // optional: subtle shadow
      }}
    >
      <p>© 2025 Swami Samarth. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
