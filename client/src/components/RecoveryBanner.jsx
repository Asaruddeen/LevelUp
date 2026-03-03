import React from 'react';

const RecoveryBanner = ({ missedCount, recoveryNeeded }) => {
  if (missedCount < 3) return null;

  return (
    <div className="rounded-2xl p-4 flex items-center gap-3 animate-pulse border-l-4 border-orange-500 bg-orange-500/20"
         style={{ boxShadow: '0 0 30px #f97316' }}>
      <span className="text-3xl">⚡</span>
      <div>
        <p className="font-bold text-amber-400 text-base">Recovery Mode</p>
        <p className="text-amber-300 text-sm">
          Complete {recoveryNeeded} task{recoveryNeeded !== 1 ? 's' : ''} today to recover
        </p>
      </div>
    </div>
  );
};

export default RecoveryBanner;