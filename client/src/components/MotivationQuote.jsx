import React from 'react';

const MotivationQuote = ({ quote }) => {
  if (!quote) return null;

  return (
    <div className="glass-card text-center">
      <p className="text-sm italic text-purple-300 animate-pulse-slow">
        “ {quote} ”
      </p>
    </div>
  );
};

export default MotivationQuote;