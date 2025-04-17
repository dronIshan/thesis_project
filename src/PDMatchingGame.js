// PDMatchingGame.js
import React, { useState, useEffect, useRef } from "react";

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Full-screen CRT-style Loading Screen Component
const LoadingScreen = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "ISHANVIHANGAVIMUKTHIKANDAGEDON".repeat(10).split("");
    const fontSize = 10;
    // <-- ensure columns is integer
    const columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let x = 0; x < drops.length; x++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = "#0f0";
        ctx.fillText(text, x * fontSize, drops[x] * fontSize);

        drops[x]++;
        if (drops[x] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[x] = 0;
        }
      }
    };

    const intervalId = setInterval(draw, 33);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
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
          transform: "translate(-50%, -50%)",
          color: "#0f0",
          fontSize: "32px",
          textShadow: "0 0 5px #0f0, 0 0 10px #0f0",
          animation: "flicker 2s infinite",
        }}
      >
        SPECSIM LOADING...
      </div>
      <style>{`
        @keyframes flicker {
          0%,100% { opacity:1; }
          50% { opacity:0.5; }
        }
      `}</style>
    </div>
  );
};

const API_BASE = "https://ishanvimukthi.pythonanywhere.com/api";

const PDMatchingGame = ({ onComplete }) => {
  // --- PD challenge state ---
  const [companyInfo, setCompanyInfo] = useState(null);
  const [stakeholderRequirements, setStakeholderRequirements] = useState([]);
  const [technicalTickets, setTechnicalTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Matching game state ---
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [matches, setMatches] = useState([]);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(
    "Select a stakeholder requirement to begin"
  );
  const [incorrectSelection, setIncorrectSelection] = useState(null);

  // --- Stats ---
  const [startTime, setStartTime] = useState(null);
  const [falseMatches, setFalseMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // --- Simulation roles + tickets (to pass up) ---
  const [simulationData, setSimulationData] = useState({
    roles: {},
    tickets: [],
    companyDetails: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1) Fetch the dynamic PD challenge
        const pdRes = await fetch(`${API_BASE}/dynamic-pd`);
        const pdData = await pdRes.json();
        setCompanyInfo(pdData.company_info || null);

        const reqs = pdData.pd_requirements || [];
        const techs = pdData.pd_technical_tickets || [];
        shuffle(reqs);
        shuffle(techs);
        setStakeholderRequirements(reqs);
        setTechnicalTickets(techs);
        setStartTime(Date.now());

        // 2) Transform PD into roles & simulation tickets
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
        console.error("Error fetching dynamic data", err);
        setMessage("Failed to load challenge. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // track elapsed time
  useEffect(() => {
    if (
      !loading &&
      startTime &&
      matches.length < stakeholderRequirements.length
    ) {
      const iv = setInterval(
        () => setTimeElapsed(Math.floor((Date.now() - startTime) / 1000)),
        1000
      );
      return () => clearInterval(iv);
    }
  }, [loading, startTime, matches, stakeholderRequirements]);

  // handle clicks
  const handleRequirementClick = (id) => {
    if (!matches.includes(id)) {
      setSelectedRequirement(id);
      setSelectedTicket(null);
      setIncorrectSelection(null);
      setMessage("Now select a matching technical ticket.");
    }
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
    }
    setTimeout(() => {
      setSelectedRequirement(null);
      setSelectedTicket(null);
      setIncorrectSelection(null);
    }, 1000);
  };

  // when done, bubble up with PD + simulation data
  useEffect(() => {
    if (
      !loading &&
      matches.length === stakeholderRequirements.length &&
      stakeholderRequirements.length
    ) {
      setMessage("🎉 All matches done! Starting the main game...");
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      setTimeout(() => {
        onComplete({
          pdStats: { timeTaken, correctMatches: score, falseMatches },
          simulationData,
        });
      }, 1500);
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

  if (loading) return <LoadingScreen />;

  const fmt = (secs) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(
      secs % 60
    ).padStart(2, "0")}`;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-900 min-h-screen">
      {companyInfo && (
        <div className="bg-gray-800 p-3 rounded-lg mb-6 shadow-lg text-center">
          <h1 className="text-xl font-bold text-blue-400">
            {companyInfo.name}
          </h1>
          <p className="text-gray-400 italic">{companyInfo.tagline}</p>
        </div>
      )}

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Product Design Challenge
        </h2>
        <p className="text-gray-400 mb-4">
          Match stakeholder requirements to technical tickets
        </p>
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <div className="bg-gray-800 px-6 py-2 rounded-lg">
            <span className="text-blue-400 font-bold text-2xl">
              {score} / {stakeholderRequirements.length}
            </span>
            <div className="text-gray-400 text-sm">Correct</div>
          </div>
          <div className="bg-gray-800 px-6 py-2 rounded-lg">
            <span className="text-red-400 font-bold text-2xl">
              {falseMatches}
            </span>
            <div className="text-gray-400 text-sm">Incorrect</div>
          </div>
          <div className="bg-gray-800 px-6 py-2 rounded-lg">
            <span className="text-green-400 font-bold text-2xl">
              {fmt(timeElapsed)}
            </span>
            <div className="text-gray-400 text-sm">Elapsed</div>
          </div>
        </div>
        <div className="p-4 bg-yellow-900 bg-opacity-30 border-yellow-700 border rounded-lg">
          <p className="text-yellow-300">{message}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Requirements */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl text-white border-b border-gray-700 pb-2 mb-4">
            Stakeholder Requirements
          </h3>
          <div className="space-y-4">
            {stakeholderRequirements.map((req) => {
              const matched = matches.includes(req.id);
              const sel = selectedRequirement === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => handleRequirementClick(req.id)}
                  className={`
                    p-5 rounded-lg border transition-transform
                    ${
                      matched
                        ? "bg-green-900 bg-opacity-30 border-green-600 opacity-75 cursor-not-allowed"
                        : sel
                        ? "bg-blue-900 bg-opacity-50 border-blue-400 scale-102 shadow-md"
                        : "bg-gray-700 border-gray-600 hover:border-blue-300 hover:shadow-md cursor-pointer"
                    }
                  `}
                >
                  <div className="flex items-center">
                    {matched ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
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
                      </div>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          sel
                            ? "bg-blue-500 text-white"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {sel && "!"}
                      </div>
                    )}
                    <p
                      className={`${
                        matched
                          ? "text-green-300"
                          : sel
                          ? "text-blue-300 font-bold"
                          : "text-gray-300"
                      }`}
                    >
                      {req.requirement}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tickets */}
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
              const disabled = !selectedRequirement || correct;
              let prio = "bg-gray-600 text-gray-300";
              if (ticket.priority === "High") prio = "bg-red-900 text-red-300";
              if (ticket.priority === "Medium")
                prio = "bg-yellow-900 text-yellow-300";
              if (ticket.priority === "Low")
                prio = "bg-green-900 text-green-300";

              return (
                <div
                  key={i}
                  onClick={() => !disabled && handleTicketClick(ticket)}
                  className={`
                    p-5 rounded-lg border transition-transform
                    ${
                      correct
                        ? "bg-green-900 bg-opacity-30 border-green-600 opacity-75"
                        : ""
                    }
                    ${
                      incorrect ? "bg-red-900 bg-opacity-30 border-red-600" : ""
                    }
                    ${
                      sel
                        ? "bg-blue-900 bg-opacity-50 border-blue-400 shadow-md"
                        : ""
                    }
                    ${
                      !disabled
                        ? "hover:border-blue-400 hover:shadow-md cursor-pointer"
                        : "opacity-60 cursor-not-allowed"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <h4
                      className={`font-semibold text-lg ${
                        correct
                          ? "text-green-300"
                          : incorrect
                          ? "text-red-300"
                          : sel
                          ? "text-blue-300"
                          : "text-white"
                      }`}
                    >
                      {ticket.title}
                    </h4>
                    {correct && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
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
                      </div>
                    )}
                  </div>
                  <p
                    className={`mt-2 ${
                      correct
                        ? "text-green-300"
                        : incorrect
                        ? "text-red-300"
                        : sel
                        ? "text-blue-200"
                        : "text-gray-400"
                    }`}
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
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="w-full bg-gray-700 h-2.5 rounded-full">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{
              width: `${(score / stakeholderRequirements.length) * 100}%`,
            }}
          />
        </div>
        <div className="text-center mt-2 text-gray-400 text-sm">
          Progress: {Math.round((score / stakeholderRequirements.length) * 100)}
          %
        </div>
      </div>
    </div>
  );
};

export default PDMatchingGame;
