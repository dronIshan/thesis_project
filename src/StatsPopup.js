// StatsPopup.js
import React from 'react';

const StatsPopup = ({
  score,
  correctAssignments,
  falseSelections,
  decisionTimes,
  pdStats,
  simulationTime,
  onRestart
}) => {
  // Calculate decision stats
  const totalDecisions = decisionTimes.length;
  const totalDecisionTime = decisionTimes.reduce((acc, t) => acc + t, 0);
  const averageDecisionTime =
    totalDecisions > 0 ? (totalDecisionTime / totalDecisions / 1000).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-3xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🎉 Game Complete!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Simulation Stats */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
             Requirement Simulation Game Stats
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Total Score:</span> {score}
              </li>
              <li>
                <span className="font-medium">Correct Assignments:</span> {correctAssignments}
              </li>
              <li>
                <span className="font-medium">False Selections:</span> {falseSelections}
              </li>
              <li>
                <span className="font-medium">Total Decisions Made:</span> {totalDecisions}
              </li>
              <li>
                <span className="font-medium">Avg. Decision Time:</span> {averageDecisionTime} s
              </li>
              <li>
                <span className="font-medium">Total Simulation Time:</span> {simulationTime} s
              </li>
            </ul>
          </div>

          {/* PD Challenge Stats */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Product Design Challenge Game  Stats
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Time Taken:</span> {pdStats.timeTaken} s
              </li>
              <li>
                <span className="font-medium">Correct Matches:</span> {pdStats.correctMatches}
              </li>
              <li>
                <span className="font-medium">False Matches:</span> {pdStats.falseMatches}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onRestart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-shadow shadow-md hover:shadow-lg"
          >
            Restart Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPopup;
