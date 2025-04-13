import React from 'react';

const StatsPopup = ({ score, correctAssignments, falseSelections, decisionTimes, pdStats, simulationTime, onRestart }) => {
  // Calculate simulation decision stats.
  const totalDecisions = decisionTimes.length;
  const totalDecisionTime = decisionTimes.reduce((acc, time) => acc + time, 0);
  const averageDecisionTime = totalDecisions > 0 ? (totalDecisionTime / totalDecisions / 1000).toFixed(2) : 0; // seconds

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          minWidth: '300px',
          boxShadow: '0 1px 10px rgba(0,0,0,0.3)'
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Game Complete!</h2>
        <div>
          <h3>Product Simulation Game Stats</h3>
          <p>
            <strong>Total Score:</strong> {score}
          </p>
          <p>
            <strong>Correct Assignments:</strong> {correctAssignments}
          </p>
          <p>
            <strong>False Selections:</strong> {falseSelections}
          </p>
          <p>
            <strong>Total Decisions Made:</strong> {totalDecisions}
          </p>
          <p>
            <strong>Average Decision Time:</strong> {averageDecisionTime} seconds
          </p>
          <p>
            <strong>Total Simulation Time:</strong> {simulationTime} seconds
          </p>
        </div>
        <hr style={{ margin: '1rem 0' }} />
        <div>
          <h3>Product Design Challenge Stats</h3>
          <p>
            <strong>Time Taken:</strong> {pdStats.timeTaken} seconds
          </p>
          <p>
            <strong>Correct Matches:</strong> {pdStats.correctMatches}
          </p>
          <p>
            <strong>False Matches:</strong> {pdStats.falseMatches}
          </p>
        </div>
        <button
          onClick={onRestart}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default StatsPopup;
