import React from 'react';

const StatsPopup = ({ score, correctAssignments, falseSelections, decisionTimes, onRestart }) => {
  // Calculate total and average decision time (in seconds)
  const totalDecisions = decisionTimes.length;
  const totalTime = decisionTimes.reduce((acc, time) => acc + time, 0);
  const averageDecisionTime = totalDecisions > 0 ? (totalTime / totalDecisions) / 1000 : 0;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem',
        minWidth: '300px', boxShadow: '0 1px 10px rgba(0,0,0,0.3)',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Game Complete!</h2>
        <p><strong>Total Score:</strong> {score}</p>
        <p><strong>Correct Assignments:</strong> {correctAssignments}</p>
        <p><strong>False Selections:</strong> {falseSelections}</p>
        <p><strong>Total Decisions Made:</strong> {totalDecisions}</p>
        <p><strong>Average Decision Time:</strong> {averageDecisionTime.toFixed(2)} seconds</p>
        {/* Add any additional details or statistics here */}
        <button onClick={onRestart} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default StatsPopup;
