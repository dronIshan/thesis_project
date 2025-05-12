import React from "react";
import { motion } from "framer-motion";
import {
  IconTrophy,
  IconXMark,
  IconDownload,
  IconDocument,
  IconCheckCircle,
} from "./icons"; // Assuming icons.js is in the same directory

export default function GameReportModal({
  isOpen,
  onClose,
  gameStats,
  concepts, // Renamed from gameConcepts for clarity when passing
  originalScenarios,
  interactionsLog,
  materialsForDisplay, // Pass materialsForDisplay down
}) {
  if (!isOpen) return null;

  const {
    score,
    errors,
    maxStreak,
    correctMatches,
    totalScenariosInitialCount,
    gameMode,
    groupName,
    isCrossDomain,
  } = gameStats;

  // --- Report Calculations (Moved from REQSIM) ---
  const dropAttempts = interactionsLog.filter(
    (log) =>
      log.actionType === "DROP_ATTEMPT" ||
      log.actionType === "AUTO_DROP_CORRECT"
  );
  const totalDrops = dropAttempts.length; // Not currently displayed but useful
  const correctNewPartDrops = dropAttempts.filter(
    (log) => log.isCorrectDrop && log.isNewPartResolved
  ).length;
  // This calculation counts attempts that were either incorrect drops OR correct drops on a part
  // that hadn't been resolved *at the moment of that specific drop*.
  // It's a bit complex and might double-count if a user drops the *wrong* concept multiple times
  // before finally dropping the correct one. A simpler metric might just be
  // Total Correct Drops / Total Drops, or Correct Drops / (Correct Drops + Incorrect Drops).
  // Let's simplify to Correctly Associated / (Correctly Associated + Incorrect Drops on Concept)
  // for the concept level, and Overall Correct Drops / Total Drops for a total drop accuracy.
  const overallCorrectDropInstances = dropAttempts.filter(
    (log) => log.isCorrectDrop
  ).length;
  const overallIncorrectDropInstances = dropAttempts.filter(
    (log) => !log.isCorrectDrop
  ).length;
  const overallDropAttemptAccuracy =
    overallCorrectDropInstances + overallIncorrectDropInstances > 0
      ? (overallCorrectDropInstances /
          (overallCorrectDropInstances + overallIncorrectDropInstances)) *
        100
      : 0;

  const validLatencies = interactionsLog
    .filter(
      (log) =>
        log.actionType === "DROP_ATTEMPT" && // Only consider manual drops
        log.latencyMs !== null &&
        log.isCorrectDrop &&
        log.isNewPartResolved // Only consider successful, new matches
    )
    .map((log) => log.latencyMs);

  const avgLatency =
    validLatencies.length > 0
      ? (
          validLatencies.reduce((sum, l) => sum + l, 0) /
          validLatencies.length /
          1000
        ).toFixed(2)
      : "N/A";

  const conceptPerformance = concepts.map((concept) => {
    const dropsOnThisConcept = dropAttempts.filter(
      (log) => log.droppedConceptId === concept.id
    );
    const correctlyAssociated = dropsOnThisConcept.filter(
      (log) => log.isCorrectDrop && log.isNewPartResolved
    ).length;
    // Count incorrect drops *onto* this concept
    const incorrectlyDroppedOn = dropsOnThisConcept.filter(
      (log) => !log.isCorrectDrop
    ).length;

    let timesExpected = 0;
    (originalScenarios || []).forEach((s) => {
      const scenarioConceptIds = Array.isArray(s.conceptIds)
        ? s.conceptIds
        : s.conceptIds
        ? [s.conceptIds]
        : [];
      if (scenarioConceptIds.includes(concept.id)) timesExpected++;
    });

    const accuracyOnThisConceptWhenDropped =
      correctlyAssociated + incorrectlyDroppedOn > 0
        ? (correctlyAssociated / (correctlyAssociated + incorrectlyDroppedOn)) *
          100
        : 0;

    return {
      ...concept,
      correctlyAssociated,
      incorrectlyDroppedOn,
      timesExpected,
      accuracyOnThisConceptWhenDropped,
    };
  });

  // --- Download Report Logic (Moved from REQSIM) ---
  const handleDownloadReport = () => {
    let reportContent = `REQSIM Game Report - ${new Date().toLocaleString()}\n\n`;
    reportContent += `Game Mode: ${
      gameMode === "multiplayer"
        ? `Group (${groupName || "Unnamed"})`
        : "Single Player"
    }\n`;
    reportContent += `Content Focus: ${
      isCrossDomain ? "Cross-Domain" : "Requirements Engineering"
    }\n\n`;

    reportContent += "### Content Source:\n";
    reportContent += "-----------------\n";
    if (materialsForDisplay && materialsForDisplay.length > 0) {
      materialsForDisplay.forEach((fileInfo) => {
        reportContent += ` - ${fileInfo.name} (${fileInfo.type})\n`;
      });
    } else {
      reportContent += " No specific materials uploaded.\n";
    }
    reportContent += ` Content Focus: ${
      isCrossDomain ? "Cross-Domain" : "Requirements Engineering"
    }\n`;
    reportContent += ` Game Mode: ${
      gameMode === "multiplayer"
        ? `Group (${groupName || "Unnamed"})`
        : "Single Player"
    }\n\n`;

    reportContent += "### Overall Performance:\n";
    reportContent += `----------------------\n`;
    reportContent += `Final Score: ${score}\n`;
    reportContent += `Scenarios Fully Resolved (Player Achieved All Concepts): ${correctMatches} / ${totalScenariosInitialCount}\n`;
    reportContent += `Total Incorrect Drop Attempts: ${errors}\n`; // Use errors count
    reportContent += `Max Streak: ${maxStreak}\n`;
    reportContent += `Overall Drop Attempt Accuracy: ${overallDropAttemptAccuracy.toFixed(
      1
    )}%\n`; // New overall drop accuracy
    reportContent += `Avg. Correct Match Time (Manual Play): ${avgLatency}s\n\n`; // Renamed for clarity

    reportContent += "### Concept Performance:\n";
    reportContent += "---------------------\n";
    conceptPerformance.forEach((stat) => {
      reportContent += `Concept: ${stat.name} (ID: ${stat.id})\n`;
      reportContent += `  Definition: ${stat.definition}\n`;
      reportContent += `  Correctly Associated In Scenarios (New Matches): ${stat.correctlyAssociated}\n`; // Renamed
      reportContent += `  Incorrectly Dropped ON This Concept: ${stat.incorrectlyDroppedOn}\n`; // Renamed
      reportContent += `  Accuracy (when dropped on this concept): ${stat.accuracyOnThisConceptWhenDropped.toFixed(
        0
      )}%\n`; // Updated accuracy metric
      reportContent += `  Times Expected in Scenarios: ${stat.timesExpected}\n\n`;
    });

    reportContent += "\n### Scenario Breakdown:\n";
    reportContent += "-------------------\n";
    (originalScenarios || []).forEach((scenario) => {
      reportContent += `Scenario ID: ${scenario.id}\nText: ${scenario.text}\n`;
      const scenarioConceptIds = Array.isArray(scenario.conceptIds)
        ? scenario.conceptIds
        : scenario.conceptIds
        ? [scenario.conceptIds]
        : [];
      const expectedConceptNames = scenarioConceptIds
        .map(
          (id) => concepts.find((c) => c.id === id)?.name || `ID ${id}` // Use 'concepts' prop
        )
        .join(", ");
      reportContent += `  Expected Concepts: ${
        expectedConceptNames || "N/A"
      }\n`;

      // Find drops related to this scenario
      const scenarioDropInteractions = interactionsLog.filter(
        (log) =>
          log.scenarioId === scenario.id &&
          (log.actionType === "DROP_ATTEMPT" ||
            log.actionType === "AUTO_DROP_CORRECT")
      );
      const playerMatchedConceptsForThisScenario = new Set();
      scenarioDropInteractions.forEach((drop) => {
        if (drop.isCorrectDrop && drop.isNewPartResolved) {
          const conceptName =
            concepts.find((c) => c.id === drop.droppedConceptId)?.name ||
            `ID ${drop.droppedConceptId}`; // Use 'concepts' prop
          playerMatchedConceptsForThisScenario.add(conceptName);
        }
      });

      const isFullyResolvedLogged = interactionsLog.some(
        (log) =>
          (log.actionType === "SCENARIO_FULLY_RESOLVED" ||
            log.actionType === "AUTO_SCENARIO_RESOLVED") &&
          log.scenarioId === scenario.id
      );
      reportContent += `  Concepts Matched By Player During Attempt: ${
        playerMatchedConceptsForThisScenario.size > 0
          ? Array.from(playerMatchedConceptsForThisScenario).join(", ")
          : "None successfully during manual play"
      }\n`;
      reportContent += `  Was Fully Resolved (by player or auto-complete): ${
        isFullyResolvedLogged ? "Yes" : "No"
      }\n\n`;
    });

    reportContent += "\n### Full Interaction Log:\n";
    reportContent += "------------------------\n";
    interactionsLog.forEach((log) => {
      reportContent += `${JSON.stringify(log)}\n`;
    });

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `REQSIM_Report_${gameMode}_${new Date().toISOString().split("T")[0]}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // logInteraction("REPORT_DOWNLOADED"); // Log this in REQSIM
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-5 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-100 transition-colors p-1 rounded-full hover:bg-gray-700"
        >
          <IconXMark className="w-5 h-5" />
        </button>
        <div className="text-center border-b border-gray-700 pb-3 mb-4">
          <IconTrophy className="mx-auto h-8 w-8 text-yellow-400 mb-2" />
          <h2 className="text-2xl font-bold text-yellow-400">
            REQSIM Detailed Report
          </h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="bg-gray-700/50 p-3 rounded-md">
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">
              Overall Performance
            </h3>
            <p>
              Game Mode:{" "}
              <span className="font-semibold">
                {gameMode === "multiplayer"
                  ? `Group (${groupName || "Unnamed"})`
                  : "Single Player"}
              </span>
            </p>
            <p>
              Final Score:{" "}
              <span className="font-semibold text-green-400">{score}</span>
            </p>
            <p>
              Scenarios Fully Resolved:{" "}
              <span className="font-semibold">
                {correctMatches} / {totalScenariosInitialCount}
              </span>
            </p>
            <p>
              Total Incorrect Drop Attempts:{" "}
              <span className="font-semibold text-red-400">{errors}</span>
            </p>
            <p>
              Max Streak:{" "}
              <span className="font-semibold text-orange-400">{maxStreak}</span>
            </p>
            <p>
              Overall Drop Attempt Accuracy:{" "}
              <span className="font-semibold">
                {overallDropAttemptAccuracy.toFixed(1)}%
              </span>
            </p>
            <p>
              Avg. Correct Match Time (Manual Play):{" "}
              <span className="font-semibold">{avgLatency}s</span>
            </p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-md">
                                   {" "}
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                                        Content Source                        {" "}
            </h3>
                                   {" "}
            {materialsForDisplay && materialsForDisplay.length > 0 ? (
              materialsForDisplay.map((fileInfo, i) => (
                <div
                  key={i}
                  className="truncate py-1 flex items-center text-xs"
                >
                                             {" "}
                  <IconDocument className="w-4 h-4 text-gray-400 mr-1" />       
                                     {" "}
                  <span className="flex-grow truncate" title={fileInfo.name}>
                                                  {fileInfo.name}              
                                   {" "}
                    <span className="text-gray-400">({fileInfo.type})</span>   
                                           {" "}
                  </span>
                                           {" "}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">
                No specific materials uploaded.
              </p>
            )}
                                   {" "}
            <p className="mt-1 text-xs text-gray-400">
                                        Content Focus:                          {" "}
              {isCrossDomain ? "Cross-Domain" : "Requirements Engineering"}     
                               {" "}
            </p>
                                   {" "}
            <p className="mt-1 text-xs text-gray-400">
                                        Game Mode:                          {" "}
              {gameMode === "multiplayer"
                ? `Group (${groupName || "Unnamed"})`
                : "Single Player"}
                                     {" "}
            </p>
                                 {" "}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">
              Concept Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs bg-gray-700/30 rounded-md">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">
                      Concept
                    </th>
                    <th className="px-3 py-2 text-center font-semibold">
                      Correct Assoc.
                      <br />
                      (New Matches)
                    </th>
                    <th className="px-3 py-2 text-center font-semibold">
                      Incorrect Drops
                      <br />
                      ON This Concept
                    </th>
                    <th className="px-3 py-2 text-center font-semibold">
                      Times Expected
                      <br />
                      in Scenarios
                    </th>
                    <th className="px-3 py-2 text-center font-semibold">
                      Accuracy
                      <br />
                      (on drops here)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conceptPerformance.map((stat) => (
                    <tr
                      key={stat.id}
                      className="border-t border-gray-700 hover:bg-gray-700/50"
                    >
                      <td className="px-3 py-1.5 font-medium">{stat.name}</td>
                      <td className="px-3 py-1.5 text-center text-green-400">
                        {stat.correctlyAssociated}
                      </td>
                      <td className="px-3 py-1.5 text-center text-red-400">
                        {stat.incorrectlyDroppedOn}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        {stat.timesExpected}
                      </td>
                      <td
                        className={`px-3 py-1.5 text-center font-semibold ${
                          stat.accuracyOnThisConceptWhenDropped >= 75
                            ? "text-green-400"
                            : stat.accuracyOnThisConceptWhenDropped >= 50
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {stat.accuracyOnThisConceptWhenDropped.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-indigo-300 mb-2">
              Scenario Breakdown
            </h3>
            <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-2">
              {(originalScenarios || []).map((scenario) => {
                const scenarioConceptIds = Array.isArray(scenario.conceptIds)
                  ? scenario.conceptIds
                  : scenario.conceptIds
                  ? [scenario.conceptIds]
                  : [];
                const expectedConceptNames = scenarioConceptIds
                  .map(
                    (id) =>
                      concepts.find((c) => c.id === id)?.name || `ID ${id}`
                  )
                  .join(", ");

                const scenarioDropInteractions = interactionsLog.filter(
                  (log) =>
                    log.scenarioId === scenario.id &&
                    (log.actionType === "DROP_ATTEMPT" ||
                      log.actionType === "AUTO_DROP_CORRECT")
                );

                const playerMatchedConceptsForThisScenario = new Set();
                scenarioDropInteractions.forEach((drop) => {
                  if (drop.isCorrectDrop && drop.isNewPartResolved) {
                    const conceptName =
                      concepts.find((c) => c.id === drop.droppedConceptId)
                        ?.name || `ID ${drop.droppedConceptId}`;
                    playerMatchedConceptsForThisScenario.add(conceptName);
                  }
                });

                const isFullyResolvedLogged = interactionsLog.some(
                  (log) =>
                    (log.actionType === "SCENARIO_FULLY_RESOLVED" ||
                      log.actionType === "AUTO_SCENARIO_RESOLVED") &&
                    log.scenarioId === scenario.id
                );

                return (
                  <div
                    key={scenario.id}
                    className="bg-gray-700/50 p-2 rounded-md border border-gray-600/70"
                  >
                    <p className="font-semibold text-indigo-300">
                      Scenario ID: {scenario.id}
                    </p>
                    <p className="text-gray-300 mt-0.5">{scenario.text}</p>
                    <p className="mt-1 text-blue-300">
                      Expected Concepts: {expectedConceptNames || "N/A"}
                    </p>
                    <p className="mt-0.5 text-green-400">
                      Matched By Player During Attempt:{" "}
                      {playerMatchedConceptsForThisScenario.size > 0
                        ? Array.from(playerMatchedConceptsForThisScenario).join(
                            ", "
                          )
                        : "None successfully during manual play"}
                    </p>
                    <p className="mt-0.5 text-yellow-400">
                      Fully Resolved During Session:{" "}
                      {isFullyResolvedLogged ? "Yes" : "No"}
                    </p>
                  </div>
                );
              })}
              {originalScenarios && originalScenarios.length === 0 && (
                <p className="text-center text-gray-400 italic">
                  No scenarios were generated for this session.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700 text-center space-x-3">
            <button
              onClick={handleDownloadReport}
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 inline-flex items-center justify-center"
            >
              <IconDownload className="mr-2 w-4 h-4" /> Download Report
            </button>
            <button
              className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              onClick={onClose} // Just close the modal, REQSIM handles resetting or starting new game
            >
              Close Report
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
