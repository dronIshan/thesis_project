// PDMatchingGame.js
import React, { useState, useEffect, useRef } from 'react';

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
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const letters = 'ISHANVIHANGAVIMUKTHIKANDAGEDON'.repeat(10).split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    let drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    ctx.font = fontSize + "px monospace";

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillStyle = '#0f0';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
      }
    };
    const intervalId = setInterval(draw, 33);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        background: '#000000',
        overflow: 'hidden',
        fontFamily: 'monospace',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      ></canvas>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#0f0',
          fontSize: '32px',
          textShadow: '0 0 5px #0f0, 0 0 10px #0f0',
          animation: 'flicker 2s infinite',
          zIndex: 1
        }}
      >
        SPECSIM LOADING...
      </div>
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

const API_BASE = 'https://ishanvimukthi.pythonanywhere.com/api';

const PDMatchingGame = ({ onComplete }) => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [stakeholderRequirements, setStakeholderRequirements] = useState([]);
  const [technicalTickets, setTechnicalTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [matches, setMatches] = useState([]);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Select a stakeholder requirement to begin');
  const [incorrectSelection, setIncorrectSelection] = useState(null);

  // Stats
  const [startTime, setStartTime] = useState(null);
  const [falseMatches, setFalseMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  // This state will store simulation data to be passed upward.
  const [simulationData, setSimulationData] = useState({
    roles: {},
    tickets: [],
    companyDetails: ''
  });

  // 1) Fetch both PD data and simulation data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch dynamic PD data
        const pdRes = await fetch(`${API_BASE}/dynamic-pd`);
        const pdData = await pdRes.json();
        if (pdData.company_info) {
          setCompanyInfo(pdData.company_info);
        }
        const reqData = pdData.pd_requirements || [];
        const techData = pdData.pd_technical_tickets || [];
        shuffle(reqData);
        shuffle(techData);
        setStakeholderRequirements(reqData);
        setTechnicalTickets(techData);
        setStartTime(Date.now());
        // Fetch simulation data concurrently
        const [rolesRes, ticketsRes, companiesRes] = await Promise.all([
          fetch(`${API_BASE}/roles`),
          fetch(`${API_BASE}/simulation-tickets`),
          fetch(`${API_BASE}/companies`)
        ]);
        const rolesData = await rolesRes.json();
        const ticketsData = await ticketsRes.json();
        const companiesData = await companiesRes.json();
        const randomCompany = companiesData[Math.floor(Math.random() * companiesData.length)];
        setSimulationData({
          roles: rolesData,
          tickets: ticketsData,
          companyDetails: randomCompany
        });
      } catch (err) {
        console.error('Failed to load PD or simulation data', err);
        setMessage('Failed to load challenge data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Timer effect
  useEffect(() => {
    if (!loading && startTime && matches.length < stakeholderRequirements.length) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [loading, startTime, matches.length, stakeholderRequirements.length]);

  // 2) Core matching logic
  const handleRequirementClick = (reqId) => {
    if (!matches.includes(reqId)) {
      setSelectedRequirement(reqId);
      setSelectedTicket(null);
      setIncorrectSelection(null);
      setMessage('Now select a matching technical ticket.');
    }
  };

  const handleTicketClick = (ticket) => {
    if (!selectedRequirement) {
      setMessage('Please select a stakeholder requirement first.');
      return;
    }
    setSelectedTicket(ticket);
    const requirement = stakeholderRequirements.find((r) => r.id === selectedRequirement);
    if (requirement && requirement.correctMatch === ticket.title) {
      setScore((s) => s + 1);
      setMatches((m) => [...m, requirement.id]);
      setCorrectMatches((cm) => [...cm, ticket.title]);
      setMessage('✅ Correct match! Select another requirement.');
    } else {
      setMessage('❌ Incorrect match. Try again.');
      setIncorrectSelection(ticket.title);
      setFalseMatches((fm) => fm + 1);
    }
    setTimeout(() => {
      setSelectedRequirement(null);
      setSelectedTicket(null);
      setIncorrectSelection(null);
    }, 1000);
  };

  // 3) When all matched, fire onComplete with stats and simulation data
  useEffect(() => {
    if (!loading && matches.length === stakeholderRequirements.length && stakeholderRequirements.length > 0) {
      setMessage('🎉 All matches done! Starting the main game...');
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      // Pass PD stats plus the simulation data fetched earlier
      setTimeout(() => {
        onComplete({
          pdStats: { timeTaken, correctMatches: score, falseMatches },
          simulationData
        });
      }, 1500);
    }
  }, [matches, loading, stakeholderRequirements, onComplete, score, falseMatches, startTime, simulationData]);

  // 4) If loading, render the full-screen CRT-style LoadingScreen
  if (loading) {
    return <LoadingScreen />;
  }

  // Format time as mm:ss for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 bg-gray-900 min-h-screen">
      {/* Top info bar with company info */}
      {companyInfo && (
        <div className="bg-gray-800 p-3 rounded-lg mb-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <h1 className="text-xl font-bold text-blue-400 whitespace-nowrap">
                Company: {companyInfo.name}
              </h1>
              <p className="text-gray-400 italic text-sm whitespace-nowrap">
                {companyInfo.tagline}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3 text-white">Product Design Challenge</h2>
        <p className="text-gray-400 mb-4 text-lg">
          Match stakeholder requirements to technical tickets
        </p>
        
        {/* Stats bar */}
        <div className="flex justify-center space-x-4 md:space-x-8 mb-4 flex-wrap">
          <div className="flex flex-col items-center bg-gray-800 px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-sm mb-2 md:mb-0">
            <span className="text-blue-400 text-2xl font-bold">
              {score} / {stakeholderRequirements.length}
            </span>
            <span className="text-gray-400 text-sm font-medium">Correct Matches</span>
          </div>
          
          <div className="flex flex-col items-center bg-gray-800 px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-sm mb-2 md:mb-0">
            <span className="text-red-400 text-2xl font-bold">{falseMatches}</span>
            <span className="text-gray-400 text-sm font-medium">Incorrect Attempts</span>
          </div>
          
          <div className="flex flex-col items-center bg-gray-800 px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-sm">
            <span className="text-green-400 text-2xl font-bold">{formatTime(timeElapsed)}</span>
            <span className="text-gray-400 text-sm font-medium">Time Elapsed</span>
          </div>
        </div>
        
        {/* Message box with animation */}
        <div className="p-4 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-102">
          <p className="text-lg font-medium text-yellow-300">{message}</p>
        </div>
      </div>

      {/* Game board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Requirements */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
            Stakeholder Requirements
          </h3>
          <div className="space-y-4">
            {stakeholderRequirements.map(req => {
              const isMatched = matches.includes(req.id);
              const isSelected = selectedRequirement === req.id;
              return (
                <div
                  key={req.id}
                  className={`
                    p-5 border rounded-lg cursor-pointer transition-all duration-200
                    ${isMatched ? 'bg-green-900 bg-opacity-30 border-green-600' : 'bg-gray-700 border-gray-600'}
                    ${isSelected ? 'bg-blue-900 bg-opacity-50 shadow-md scale-102 border-blue-400' : 'hover:shadow-md hover:border-blue-300'}
                    ${isMatched ? 'opacity-75 cursor-not-allowed' : ''}
                  `}
                  onClick={() => handleRequirementClick(req.id)}
                >
                  <div className="flex items-start">
                    {isMatched ? (
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                    ) : (
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {isSelected ? "!" : ""}
                      </span>
                    )}
                    <p className={`${isMatched ? 'text-green-300' : isSelected ? 'text-blue-300 font-bold' : 'text-gray-300'}`}>
                      {req.requirement}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Tickets */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
            Technical Tickets
          </h3>
          <div className="space-y-4">
            {technicalTickets.map((ticket, i) => {
              const isCorrect = correctMatches.includes(ticket.title);
              const isIncorrect = selectedTicket?.title === ticket.title && incorrectSelection === ticket.title;
              const isSelected = selectedTicket?.title === ticket.title && !incorrectSelection;
              const disabled = !selectedRequirement || isCorrect;
              let priorityColor = "bg-gray-600 text-gray-300";
              if (ticket.priority === "High") priorityColor = "bg-red-900 text-red-300";
              else if (ticket.priority === "Medium") priorityColor = "bg-yellow-900 text-yellow-300";
              else if (ticket.priority === "Low") priorityColor = "bg-green-900 text-green-300";

              return (
                <div
                  key={i}
                  className={`
                    p-5 border rounded-lg transition-all duration-200
                    ${isCorrect ? 'bg-green-900 bg-opacity-30 border-green-600' : 'bg-gray-700 border-gray-600'}
                    ${isIncorrect ? 'bg-red-900 bg-opacity-30 border-red-600' : ''}
                    ${isSelected ? 'bg-blue-900 bg-opacity-50 border-blue-400 shadow-md' : ''}
                    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:border-blue-400'}
                  `}
                  onClick={() => !disabled && handleTicketClick(ticket)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`font-semibold text-lg ${isCorrect ? 'text-green-300' : isIncorrect ? 'text-red-300' : isSelected ? 'text-blue-300' : 'text-white'}`}>
                      {ticket.title}
                    </h4>
                    {isCorrect && (
                      <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 ${isCorrect ? 'text-green-300' : isIncorrect ? 'text-red-300' : isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                    {ticket.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                      {ticket.role}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
                      {ticket.priority} Priority
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                      {ticket.time}h
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
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(score / stakeholderRequirements.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          Progress: {Math.round((score / stakeholderRequirements.length) * 100)}%
        </div>
      </div>
    </div>
  );
};

export default PDMatchingGame;
