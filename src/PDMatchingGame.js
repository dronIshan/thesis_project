// PDMatchingGame.js
import React, { useState, useEffect, useRef } from "react";

/* ---------- helpers ---------- */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const LoadingScreen = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ISHANVIHANGAVIMUKTHIKANDAGEDON".repeat(10).split("");
    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let x = 0; x < drops.length; x++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = "#0f0";
        ctx.fillText(text, x * fontSize, drops[x] * fontSize);
        drops[x] =
          drops[x] * fontSize > canvas.height && Math.random() > 0.95
            ? 0
            : drops[x] + 1;
      }
    };
    const id = setInterval(draw, 33);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999 }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          color: "#0f0",
          fontSize: 32,
          textShadow: "0 0 5px #0f0,0 0 10px #0f0",
          animation: "flicker 2s infinite",
        }}
      >
        SPECSIM LOADING...
      </div>
      <style>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
};

/* ---------- constants ---------- */
const API_BASE = "https://ishanvimukthi.pythonanywhere.com/api";

/* ---------- component ---------- */
const PDMatchingGame = ({ onComplete }) => {
  /* PD challenge data */
  const [companyInfo, setCompanyInfo] = useState(null);
  const [stakeholderRequirements, setStakeholderRequirements] = useState([]);
  const [technicalTickets, setTechnicalTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Matching‑game state */
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [matches, setMatches] = useState([]);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(
    "Select a stakeholder requirement to begin"
  );
  const [incorrectSelection, setIncorrectSelection] = useState(null);

  /* Stats */
  const [startTime, setStartTime] = useState(null);
  const [falseMatches, setFalseMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  /* Simulation data to bubble up */
  const [simulationData, setSimulationData] = useState({
    roles: {},
    tickets: [],
    companyDetails: "",
  });

  /* -------- fetch dynamic data on mount -------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        /* 1) dynamic PD set */
        const pdRes = await fetch(`${API_BASE}/dynamic-pd`);
        const pdData = await pdRes.json();
        setCompanyInfo(pdData.company_info || null);

        const reqs = pdData.pd_requirements || [];
        const tix = pdData.pd_technical_tickets || [];
        shuffle(reqs);
        shuffle(tix);
        setStakeholderRequirements(reqs);
        setTechnicalTickets(tix);
        setStartTime(Date.now());

        /* 2) roles + simulation tickets derived */
        const rtRes = await fetch(`${API_BASE}/dynamic-roles-tickets`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pdData),
        });
        const rtData = await rtRes.json();
        setSimulationData({
          roles: rtData.roles || {},
          tickets: rtData.simulation_tickets || [],
          companyDetails: pdData.company_info?.name || "",
        });
      } catch (err) {
        console.error("Fetch error", err);
        setMessage("Failed to load challenge. Refresh to retry.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* -------- elapsed‑time ticker -------- */
  useEffect(() => {
    if (
      !loading &&
      startTime &&
      matches.length < stakeholderRequirements.length
    ) {
      const id = setInterval(
        () => setTimeElapsed(Math.floor((Date.now() - startTime) / 1000)),
        1000
      );
      return () => clearInterval(id);
    }
  }, [loading, startTime, matches, stakeholderRequirements]);

  /* -------- matching handlers -------- */
  const handleRequirementClick = (id) => {
    if (matches.includes(id)) return;
    setSelectedRequirement(id);
    setSelectedTicket(null);
    setIncorrectSelection(null);
    setMessage("Now select a matching technical ticket.");
  };

  const handleTicketClick = (ticket) => {
    if (!selectedRequirement) {
      setMessage("Please select a stakeholder requirement first.");
      return;
    }
    setSelectedTicket(ticket);
    const req = stakeholderRequirements.find(
      (r) => r.id === selectedRequirement
    );
    if (req?.correctMatch === ticket.title) {
      setScore((s) => s + 1);
      setMatches((m) => [...m, req.id]);
      setCorrectMatches((cm) => [...cm, ticket.title]);
      setMessage("✅ Correct match! Select another requirement.");
    } else {
      setFalseMatches((fm) => fm + 1);
      setMessage("❌ Incorrect match. Try again.");
      setIncorrectSelection(ticket.title);
    }
    setTimeout(() => {
      setSelectedRequirement(null);
      setSelectedTicket(null);
      setIncorrectSelection(null);
    }, 800);
  };

  /* -------- AUTO‑MATCH TEST BUTTON -------- */
  const handleAutoMatch = () => {
    const allIds = stakeholderRequirements.map((r) => r.id);
    const allTitles = stakeholderRequirements.map((r) => r.correctMatch);
    setMatches(allIds);
    setCorrectMatches(allTitles);
    setScore(stakeholderRequirements.length);
    setMessage("🔧 Auto‑matched for test.");
  };

  /* -------- completion effect -------- */
  useEffect(() => {
    if (
      !loading &&
      matches.length === stakeholderRequirements.length &&
      stakeholderRequirements.length
    ) {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => {
        onComplete({
          pdStats: { timeTaken, correctMatches: score, falseMatches },
          simulationData,
        });
      }, 500);
    }
  }, [
    loading,
    matches,
    stakeholderRequirements,
    score,
    falseMatches,
    startTime,
    simulationData,
    onComplete,
  ]);

  /* ----------- UI ----------- */
  if (loading) return <LoadingScreen />;

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-900 min-h-screen">
      {/* COMPANY BANNER */}
      {companyInfo && (
        <div className="bg-gray-800 p-3 rounded-lg mb-6 shadow-lg text-center">
          <h1 className="text-xl font-bold text-blue-400">
            {companyInfo.name}
          </h1>
          <p className="text-gray-400 italic">{companyInfo.tagline}</p>
        </div>
      )}

      {/* HEADER / STATS BAR */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Product Design Challenge
        </h2>
        <p className="text-gray-400 mb-4">
          Match stakeholder requirements to technical tickets
        </p>
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <StatBox
            label="Correct"
            value={`${score} / ${stakeholderRequirements.length}`}
            color="blue"
          />
          <StatBox label="Incorrect" value={falseMatches} color="red" />
          <StatBox label="Elapsed" value={fmt(timeElapsed)} color="green" />
        </div>

        {/* ---- TEMP TEST BUTTON ---- */}
        <button
          onClick={handleAutoMatch}
          className="px-4 py-2 mb-3 rounded bg-purple-700 hover:bg-purple-600 text-white text-sm"
        >
          Auto‑Match (TEST)
        </button>
        
        <div className="p-4 bg-yellow-900 bg-opacity-30 border-yellow-700 border rounded-lg">
          <p className="text-yellow-300">{message}</p>
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* REQUIREMENTS LIST */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl text-white border-b border-gray-700 pb-2 mb-4">
            Stakeholder Requirements
          </h3>
          <div className="space-y-4">
            {stakeholderRequirements.map((req) => {
              const matched = matches.includes(req.id);
              const sel = selectedRequirement === req.id;
              return (
                <RequirementCard
                  key={req.id}
                  req={req}
                  matched={matched}
                  selected={sel}
                  onClick={() => handleRequirementClick(req.id)}
                />
              );
            })}
          </div>
        </div>

        {/* TICKETS LIST */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl text-white border-b border-gray-700 pb-2 mb-4">
            Technical Tickets
          </h3>
          <div className="space-y-4">
            {technicalTickets.map((ticket, i) => {
              const correct = correctMatches.includes(ticket.title);
              const incorrect =
                selectedTicket?.title === ticket.title &&
                incorrectSelection === ticket.title;
              const sel =
                selectedTicket?.title === ticket.title && !incorrectSelection;
              return (
                <TicketCard
                  key={i}
                  ticket={ticket}
                  correct={correct}
                  incorrect={incorrect}
                  selected={sel}
                  disabled={!selectedRequirement || correct}
                  onClick={() => handleTicketClick(ticket)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-8">
        <div className="w-full bg-gray-700 h-2.5 rounded-full">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${(score / stakeholderRequirements.length) * 100}%`,
            }}
          />
        </div>
        <p className="text-center mt-2 text-gray-400 text-sm">
          Progress: {Math.round((score / stakeholderRequirements.length) * 100)}
          %
        </p>
      </div>
    </div>
  );
};

/* ---------- tiny sub‑components ---------- */
const StatBox = ({ label, value, color }) => (
  <div className="bg-gray-800 px-6 py-2 rounded-lg">
    <span className={`text-${color}-400 font-bold text-2xl`}>{value}</span>
    <div className={`text-${color}-400 text-sm`}>{label}</div>
  </div>
);

const RequirementCard = ({ req, matched, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`
      p-5 rounded-lg border transition-transform
      ${
        matched
          ? "bg-green-900 bg-opacity-30 border-green-600 opacity-75 cursor-not-allowed"
          : selected
          ? "bg-blue-900 bg-opacity-50 border-blue-400 scale-102 shadow-md cursor-pointer"
          : "bg-gray-700 border-gray-600 hover:border-blue-300 hover:shadow-md cursor-pointer"
      }
    `}
  >
    <div className="flex items-center">
      {matched ? (
        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
          <CheckIcon />
        </div>
      ) : (
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
            selected ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"
          }`}
        >
          {selected && "!"}
        </div>
      )}
      <p
        className={`${
          matched
            ? "text-green-300"
            : selected
            ? "text-blue-300 font-bold"
            : "text-gray-300"
        }`}
      >
        {req.requirement}
      </p>
    </div>
  </div>
);

const TicketCard = ({
  ticket,
  correct,
  incorrect,
  selected,
  disabled,
  onClick,
}) => {
  let prio = "bg-gray-600 text-gray-300";
  if (ticket.priority === "High") prio = "bg-red-900 text-red-300";
  if (ticket.priority === "Medium") prio = "bg-yellow-900 text-yellow-300";
  if (ticket.priority === "Low") prio = "bg-green-900 text-green-300";

  return (
    <div
      onClick={() => !disabled && onClick()}
      className={`
        p-5 rounded-lg border transition-transform
        ${
          correct
            ? "bg-green-900 bg-opacity-30 border-green-600 opacity-75"
            : ""
        }
        ${incorrect ? "bg-red-900 bg-opacity-30 border-red-600" : ""}
        ${selected ? "bg-blue-900 bg-opacity-50 border-blue-400 shadow-md" : ""}
        ${
          !disabled
            ? "hover:border-blue-400 hover:shadow-md cursor-pointer"
            : "opacity-60 cursor-not-allowed"
        }
      `}
    >
      <div className="flex justify-between items-center">
        <h4
          className={`
            font-semibold text-lg
            ${
              correct
                ? "text-green-300"
                : incorrect
                ? "text-red-300"
                : selected
                ? "text-blue-300"
                : "text-white"
            }
          `}
        >
          {ticket.title}
        </h4>
        {correct && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckIcon />
          </div>
        )}
      </div>
      <p
        className={`
          mt-2
          ${
            correct
              ? "text-green-300"
              : incorrect
              ? "text-red-300"
              : selected
              ? "text-blue-200"
              : "text-gray-400"
          }
        `}
      >
        {ticket.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-900 text-blue-300">
          {ticket.role}
        </span>
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${prio}`}
        >
          {ticket.priority}
        </span>
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-900 text-purple-300">
          {ticket.time}m
        </span>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default PDMatchingGame;
