// src/ProjectSimulationGame.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import CountdownTimer from "./CountdownTimer";
import EmotionFace from "./EmotionFace";
import PDMatchingGame from "./PDMatchingGame";
import StatsPopup from "./StatsPopup";

/* ────────────────────────────────────────────────────────── */
/*  Phone‑call “dial” overlay                                */
/* ────────────────────────────────────────────────────────── */
const PhoneCallAnimation = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
    <div className="text-green-400 text-xl mb-4 font-mono animate-pulse">
      Calling stakeholder…
    </div>
    <div className="phone-dial">
      <div className="dial-circle">
        <div className="dial-hole" />
      </div>
      <div className="dial-line" />
    </div>
  </div>
);

const pulseAnimationStyles = `
.phone-dial{position:relative;width:120px;height:120px}
.dial-circle{position:absolute;width:100%;height:100%;border:4px solid #10b981;border-radius:50%;animation:rotate 2s linear infinite}
.dial-hole{position:absolute;width:20px;height:20px;background:#10b981;border-radius:50%;top:10px;left:50%;transform:translateX(-50%)}
.dial-line{position:absolute;width:4px;height:40px;background:#10b981;top:30px;left:50%;transform:translateX(-50%)}
@keyframes rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
`;

/* ────────────────────────────────────────────────────────── */
/*  MAIN SIMULATION COMPONENT                                */
/* ────────────────────────────────────────────────────────── */
const ProjectSimulationGame = () => {
  /* ────────────── state ────────────── */
  const [roles, setRoles] = useState({});
  const [tickets, setTickets] = useState([]);
  const [companyDetails, setCompanyDetails] = useState("");
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [highlightedRole, setHighlightedRole] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isPdChallengeComplete, setIsPdChallengeComplete] = useState(false);
  const [falseSelections, setFalseSelections] = useState(0);
  const [correctAssignments, setCorrectAssignments] = useState(0);
  const [decisionTimes, setDecisionTimes] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [pdStats, setPdStats] = useState({
    timeTaken: 0,
    falseMatches: 0,
    correctMatches: 0,
  });
  const [simulationStartTime, setSimulationStartTime] = useState(null);
  const [message, setMessage] = useState(
    "Drag tickets to team members or click 'Do Later' to skip"
  );
  const [incorrectDrop, setIncorrectDrop] = useState(false);
  const [stakeholderMood, setStakeholderMood] = useState(0); // 0‑5
  const [stakeholderMessage, setStakeholderMessage] = useState("");
  const [stakeholderDisabled, setStakeholderDisabled] = useState(false);
  const [showStakeholderHint, setShowStakeholderHint] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [stakeholderReadTime, setStakeholderReadTime] = useState(120);
  const [stakeholderReadTimer, setStakeholderReadTimer] = useState(null);
  const [stakeholderChances, setStakeholderChances] = useState(5);
  const [isCallingStakeholder, setIsCallingStakeholder] = useState(false);
  const [initialTicketCount, setInitialTicketCount] = useState(0); // progress denominator

  const timerRef = useRef();
  const canvasRef = useRef(null);

  /* ──────────── utility helpers ──────────── */
  const getStakeholderEmotion = (m) =>
    ["happy", "happy", "neutral", "angry", "angry", "disgusted"][
      Math.min(m, 5)
    ];

  const getPriorityColor = (p) =>
    p === "High"
      ? "bg-red-900 text-red-300"
      : p === "Medium"
      ? "bg-yellow-900 text-yellow-300"
      : p === "Low"
      ? "bg-green-900 text-green-300"
      : "bg-gray-700 text-gray-300";

  const formatTime = (s) => {
    const d = Math.floor(s / 60);
    const h = Math.floor((s % 60) / 2.5);
    const m = Math.floor(((s % 60) % 2.5) * 24);
    return `${d}d ${h}h ${m}m`;
  };

  /* ──────────── PD‑matching complete ──────────── */
  const handlePdGameComplete = ({ pdStats, simulationData }) => {
    setPdStats(pdStats || { timeTaken: 0, falseMatches: 0, correctMatches: 0 });
    setRoles(simulationData.roles || {});
    setTickets(simulationData.tickets || []);
    setCompanyDetails(simulationData.companyDetails || "");
    setIsPdChallengeComplete(true);
    setSimulationStartTime(Date.now());

    /* reset stakeholder state */
    setStakeholderChances(5);
    setStakeholderMood(0);
    setStakeholderDisabled(false);

    /* ── PROGRESS BAR FIX ──
       use total ticket pool as denominator                       */
    setInitialTicketCount(simulationData.tickets.length);
  };

  /* ─────────── generate a draggable ticket ─────────── */
  const generateNewTicket = useCallback(() => {
    if (!tickets.length) return;
    const t = { ...tickets[Math.floor(Math.random() * tickets.length)] };
    t.id = Math.random().toString(36).slice(2, 11);
    t.remainingTime = t.time;
    t.startTime = Date.now();
    setCurrentTicket(t);
    setShowStakeholderHint(false);
  }, [tickets]);

  /* spawn first ticket after PD phase */
  useEffect(() => {
    if (isPdChallengeComplete && !currentTicket && tickets.length)
      generateNewTicket();
  }, [isPdChallengeComplete, currentTicket, tickets, generateNewTicket]);

  /* ─────────── main simulation loop ─────────── */
  useEffect(() => {
    if (!isPdChallengeComplete || isGamePaused) return;

    timerRef.current = setInterval(() => {
      if (!Object.keys(roles).length) return;

      /* advance timers + move to completed */
      Object.values(roles).forEach((roleList) => {
        roleList.forEach((role) => {
          const finished = [];
          role.ongoingTickets = role.ongoingTickets
            .map((t) => {
              if (t.remainingTime > 1)
                return { ...t, remainingTime: t.remainingTime - 1 };
              finished.push(t);
              return null;
            })
            .filter(Boolean);
          role.completedTickets.push(...finished);
        });
      });

      /* progress bar */
      const completed = Object.values(roles).reduce(
        (tot, roleList) =>
          tot +
          roleList.reduce((rTot, r) => rTot + r.completedTickets.length, 0),
        0
      );
      const pct = initialTicketCount
        ? (completed / initialTicketCount) * 100
        : 0;
      setProgress(pct);
      if (pct >= 100) {
        setIsGameComplete(true);
        clearInterval(timerRef.current);
      }

      /* timeout on current ticket */
      if (currentTicket && currentTicket.remainingTime <= 0) {
        setScore((p) => p - 1);
        setDecisionTimes((p) => [...p, Date.now() - currentTicket.startTime]);
        generateNewTicket();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [
    roles,
    currentTicket,
    isPdChallengeComplete,
    isGamePaused,
    initialTicketCount,
    generateNewTicket,
  ]);

  /* ─────────── drag‑and‑drop handlers ─────────── */
  const handleDragStart = (e, t) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(t));
    setIsDragging(true);
    setMessage(`Assigning: ${t.title}`);
  };
  const handleDragEnd = () => {
    setIsDragging(false);
    setHighlightedRole(null);
  };

  const handleDrop = (e, role) => {
    e.preventDefault();
    const ticket = JSON.parse(e.dataTransfer.getData("text"));
    const dt = Date.now() - ticket.startTime;
    setDecisionTimes((p) => [...p, dt]);

    const extra = !isPracticeMode ? 20 : 0;
    let correct = false;

    if (
      ticket.roles.includes(role.name) &&
      role.ongoingTickets.length < role.load
    ) {
      if (ticket.difficulty <= role.maxDifficulty) {
        // perfect
        role.ongoingTickets.push(ticket);
        setScore((p) => p + 10 + extra);
        setMessage("✅ Perfect assignment! Generating new ticket…");
      } else {
        // challenging
        ticket.time *= 1.5;
        ticket.remainingTime = ticket.time;
        role.ongoingTickets.push(ticket);
        setScore((p) => p + 5 + extra);
        setMessage("⚠️ Challenging assignment ‑ time increased!");
      }
      setCorrectAssignments((p) => p + 1);
      correct = true;
      generateNewTicket();
    } else {
      setScore((p) => p - 1);
      setFalseSelections((p) => p + 1);
      setMessage("❌ Incorrect assignment! Try again.");
      setIncorrectDrop(true);
      setTimeout(() => {
        setIncorrectDrop(false);
        setMessage("Drag tickets to team members or click 'Do Later' to skip");
      }, 2000);
    }

    /* stakeholder mood */
    if (!correct) {
      const m = Math.min(stakeholderMood + 1, 5);
      setStakeholderMood(m);
      if (m >= 5) {
        setScore((p) => p - 5);
        setStakeholderDisabled(true);
        setStakeholderMessage("Too many mistakes! I'm not helping anymore!");
      }
    }

    setIsDragging(false);
    setHighlightedRole(null);
  };

  /* ─────────── stake‑holder hint ─────────── */
  const getStakeholderHint = async () => {
    if (!currentTicket || stakeholderDisabled) return;
    setIsCallingStakeholder(true);
    try {
      const res = await fetch(
        "https://ishanvimukthi.pythonanywhere.com/api/stakeholder-npc",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ticket: currentTicket,
            company_context: companyDetails,
          }),
        }
      );
      const data = await res.json();
      setIsCallingStakeholder(false);

      if (data.message) {
        setStakeholderMessage(data.message);
        setShowStakeholderHint(true);
        const nc = stakeholderChances - 1;
        setStakeholderChances(nc);
        setStakeholderMood(5 - nc);
        if (nc === 0) {
          setScore((p) => p - 5);
          setStakeholderDisabled(true);
          setStakeholderMessage("I'm done helping! Figure it out yourself!");
        }
      }
    } catch (err) {
      console.error(err);
      setIsCallingStakeholder(false);
      setStakeholderMessage("Sorry, I can't help right now.");
    }
  };

  /* hint read‑timer */
  useEffect(() => {
    if (showStakeholderHint) {
      setIsGamePaused(true);
      const t = setInterval(() => {
        setStakeholderReadTime((p) =>
          p <= 1
            ? (clearInterval(t),
              setIsGamePaused(false),
              setShowStakeholderHint(false),
              120)
            : p - 1
        );
      }, 1000);
      setStakeholderReadTimer(t);
      return () => clearInterval(t);
    }
  }, [showStakeholderHint]);

  const dismissStakeholderHint = () => {
    clearInterval(stakeholderReadTimer);
    setShowStakeholderHint(false);
    setStakeholderReadTime(120);
    setIsGamePaused(false);
  };

  /* ─────────── time‑up on countdown widget ─────────── */
  const handleTimeUp = () => {
    setScore((p) => p - 1);
    setDecisionTimes((p) => [...p, Date.now() - currentTicket.startTime]);
    setMessage("⌛ Time expired! Generating new ticket…");
    generateNewTicket();
  };

  /* ─────────── misc helpers ─────────── */
  const getEmotion = (role) => {
    const c = role.ongoingTickets.length;
    if (c === 0) return "happy";
    if (c < role.load) return "neutral";
    if (c === role.load) return "angry";
    return "sad";
  };

  const endGameEarly = () => {
    setIsGameComplete(true);
    clearInterval(timerRef.current);
  };

  /* ─────────── early‑phase routing ─────────── */
  if (!isPdChallengeComplete)
    return <PDMatchingGame onComplete={handlePdGameComplete} />;

  /* ─────────── simulation finished ─────────── */
  if (isGameComplete) {
    const simTime = simulationStartTime
      ? ((Date.now() - simulationStartTime) / 1000).toFixed(2)
      : "0";
    return (
      <StatsPopup
        score={score}
        correctAssignments={correctAssignments}
        falseSelections={falseSelections}
        decisionTimes={decisionTimes}
        pdStats={pdStats}
        simulationTime={simTime}
        onRestart={() => window.location.reload()}
      />
    );
  }

  /* ─────────── RENDER MAIN UI ─────────── */
  return (
    <div className="relative min-h-screen bg-black font-mono text-green-300 overflow-hidden">
      {/* dial animation styles */}
      <style>{pulseAnimationStyles}</style>

      {isCallingStakeholder && <PhoneCallAnimation />}

      {/* CRT overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-30 z-0"
      />

      {/* HEADER */}
      <header className="relative z-10 bg-gray-900 border-b border-green-500 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-green-400">
              {companyDetails || "CyberCorp Simulation"}
            </h1>
            <p className="text-sm text-green-600">
              Project Management Terminal
            </p>
          </div>

          {/* SCORE BOXES + practice toggle */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              ["SCORE", score, "green"],
              ["CORRECT", correctAssignments, "blue"],
              ["ERRORS", falseSelections, "red"],
            ].map(([lbl, val, c]) => (
              <div key={lbl} className="text-center">
                <div className={`text-${c}-400 text-2xl font-bold`}>{val}</div>
                <div className={`text-xs text-${c}-600`}>{lbl}</div>
              </div>
            ))}

            {/* practice mode switch */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <span className="mr-2 text-sm text-green-400">
                  Easy mode on — turn off to remove required skills and earn +20
                  bonus points per ticket
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isPracticeMode}
                    onChange={(e) => setIsPracticeMode(e.target.checked)}
                  />
                  <div
                    className={`w-10 h-4 rounded-full shadow-inner ${
                      isPracticeMode ? "bg-green-500" : "bg-gray-700"
                    }`}
                  />
                  <div
                    className={`absolute w-6 h-6 rounded-full shadow -left-1 -top-1 transition ${
                      isPracticeMode
                        ? "bg-green-400 translate-x-5"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* progress bar + end‑sim button */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            onClick={endGameEarly}
            className="px-3 py-1 bg-red-700 hover:bg-red-600 text-red-100 rounded text-sm"
          >
            End Simulation Early
          </button>
        </div>

        {/* system message */}
        <div
          className={`mt-3 p-2 text-center rounded border transition-all ${
            incorrectDrop
              ? "border-red-500 bg-red-900 bg-opacity-30"
              : "border-green-500 bg-green-900 bg-opacity-30"
          }`}
        >
          <p className="text-sm font-medium">{message}</p>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="relative z-10 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="lg:col-span-1 space-y-4">
          {/* current ticket panel */}
          <div className="bg-gray-900 border border-green-500 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-bold text-green-400 mb-4 border-b border-green-800 pb-2">
              CURRENT TICKET
            </h2>
            {currentTicket ? (
              <div
                className={`bg-gray-800 border ${
                  isDragging ? "border-blue-400" : "border-green-700"
                } rounded p-4 transition-all`}
                draggable
                onDragStart={(e) => handleDragStart(e, currentTicket)}
                onDragEnd={handleDragEnd}
              >
                <h3 className="font-bold text-green-300 mb-2">
                  {currentTicket.title}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {currentTicket.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getPriorityColor(
                      currentTicket.priority
                    )}`}
                  >
                    {currentTicket.priority}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-purple-900 text-purple-300">
                    {currentTicket.difficulty}/10
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                    {(currentTicket.time / 60).toFixed(1)} days
                  </span>
                </div>
                <div className="mb-3">
                  <CountdownTimer
                    minutes={currentTicket.time / 60}
                    onTimeUp={handleTimeUp}
                    isPaused={isGamePaused}
                  />
                </div>
                {isPracticeMode && (
                  <div>
                    <h4 className="text-xs text-green-500 mb-1">
                      REQUIRED SKILLS:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {currentTicket.roles
                        .flatMap((rn) => {
                          const r = Object.values(roles)
                            .flat()
                            .find((x) => x.name === rn);
                          return r ? r.skills : [rn];
                        })
                        .map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                {/* Do Later button */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setScore((p) => p - 2); // Small penalty for skipping
                      setDecisionTimes((p) => [
                        ...p,
                        Date.now() - currentTicket.startTime,
                      ]);
                      setMessage("Ticket deferred - generating new one...");
                      generateNewTicket();
                    }}
                    className="w-full px-3 py-2 bg-yellow-700 hover:bg-yellow-600 text-yellow-200 rounded text-sm"
                  >
                    Do Later (-2 pts)
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 border border-dashed border-gray-600 rounded p-8 text-center text-gray-500">
                Generating first ticket...
              </div>
            )}
          </div>

          {/* stakeholder panel */}
          <div className="bg-gray-900 border border-green-500 rounded-lg p-4 shadow-lg">
            <h2 className="text-lg font-bold text-green-400 mb-3 border-b border-green-800 pb-2">
              {companyDetails ? `${companyDetails} STAKEHOLDER` : "STAKEHOLDER"}
            </h2>
            <div className="flex flex-col items-center">
              <div className="mb-3 w-32 h-32">
                <EmotionFace emotion={getStakeholderEmotion(stakeholderMood)} />
              </div>
              <button
                onClick={getStakeholderHint}
                disabled={stakeholderDisabled || stakeholderChances <= 0}
                className={`px-4 py-2 rounded-md mb-3 ${
                  stakeholderDisabled || stakeholderChances <= 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : showStakeholderHint
                    ? "bg-blue-700 text-blue-200"
                    : "bg-green-700 hover:bg-green-600 text-green-200"
                }`}
              >
                {stakeholderDisabled || stakeholderChances <= 0
                  ? "No Help Left"
                  : showStakeholderHint
                  ? "Reading Hint…"
                  : `Ask stakeholder to explain about ticket (${stakeholderChances} left)`}
              </button>
              {showStakeholderHint && (
                <div className="bg-gray-800 border border-yellow-500 rounded p-3 text-sm w-full relative">
                  <div className="absolute top-1 right-1 text-xs text-yellow-400">
                    {Math.floor(stakeholderReadTime / 60)}:
                    {String(stakeholderReadTime % 60).padStart(2, "0")}
                  </div>
                  <p className="text-yellow-300 mb-1">
                    About: {currentTicket?.title}
                  </p>
                  <p className="mb-2">{stakeholderMessage}</p>
                  <button
                    onClick={dismissStakeholderHint}
                    className="text-xs bg-yellow-700 hover:bg-yellow-600 text-yellow-200 px-2 py-1 rounded"
                  >
                    Back to Simulation
                  </button>
                </div>
              )}
              {!stakeholderDisabled && stakeholderChances > 0 && (
                <div className="mt-2 text-xs text-gray-400">
                  Help chances left: {stakeholderChances}/5
                </div>
              )}
              {stakeholderChances === 0 && (
                <div className="mt-2 text-xs text-red-400">
                  Stakeholder is frustrated and won't help anymore!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TEAM GRID */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(roles).map(([cat, roleList]) => (
            <div
              key={cat}
              className="bg-gray-900 border border-green-500 rounded-lg p-4 flex flex-col"
              style={{ maxHeight: "70vh" }}
            >
              <h2 className="text-lg font-bold text-green-400 mb-3 border-b border-green-800 pb-2">
                {cat.toUpperCase()}
              </h2>
              <div className="overflow-y-auto flex-1 pr-2 space-y-4">
                {roleList.map((role) => {
                  const isHighlighted = highlightedRole === role.name;
                  const isOverloaded = role.ongoingTickets.length >= role.load;
                  const emotion = getEmotion(role);

                  return (
                    <div
                      key={role.name}
                      onDrop={(e) => handleDrop(e, role)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setHighlightedRole(role.name);
                      }}
                      onDragLeave={() => setHighlightedRole(null)}
                      className={`border rounded-lg p-3 transition ${
                        isHighlighted
                          ? "border-blue-400 bg-blue-900/30"
                          : "border-gray-700 bg-gray-800"
                      } ${
                        isOverloaded && isDragging
                          ? "border-red-400 bg-red-900/30"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-green-300">
                            {role.name}
                          </h3>
                          <p className="text-xs text-gray-400">{role.role}</p>
                        </div>
                        <EmotionFace emotion={emotion} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Load:</span>{" "}
                          {role.ongoingTickets.length}/{role.load}
                        </div>
                        <div>
                          <span className="text-gray-500">Max Diff:</span>{" "}
                          {role.maxDifficulty}
                        </div>
                        <div>
                          <span className="text-gray-500">Exp:</span>{" "}
                          {role.experience}y
                        </div>
                        <div>
                          <span className="text-gray-500">Skills:</span>{" "}
                          {role.skills.join(", ")}
                        </div>
                      </div>

                      <div className="text-xs">
                        <div className="text-green-500 mb-1">ONGOING:</div>
                        {role.ongoingTickets.length ? (
                          <ul className="space-y-1">
                            {role.ongoingTickets.map((t, i) => (
                              <li key={i} className="text-gray-400">
                                • {t.title}{" "}
                                <span className="text-gray-600">
                                  ({formatTime(t.remainingTime)})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600 italic">
                            No active tickets
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-gray-900 border-t border-green-500 p-2 text-center text-xs text-green-700">
        SYSTEM STATUS: {isGamePaused ? "PAUSED" : "OPERATIONAL"} |{" "}
        {new Date().toLocaleString()} | v2.4.1
      </footer>
    </div>
  );
};

export default ProjectSimulationGame;
