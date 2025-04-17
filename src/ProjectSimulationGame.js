import React, { useState, useEffect, useRef, useCallback } from 'react';
import CountdownTimer from './CountdownTimer';
import EmotionFace from './EmotionFace';
import PDMatchingGame from './PDMatchingGame';
import StatsPopup from './StatsPopup';

const ProjectSimulationGame = () => {
  // ----------------------------------------------------------------------
  // State
  // ----------------------------------------------------------------------
  const [roles, setRoles] = useState({});
  const [tickets, setTickets] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(''); 
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [highlightedRole, setHighlightedRole] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPdChallengeComplete, setIsPdChallengeComplete] = useState(false);
  const [falseSelections, setFalseSelections] = useState(0);
  const [correctAssignments, setCorrectAssignments] = useState(0);
  const [decisionTimes, setDecisionTimes] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [pdStats, setPdStats] = useState({ timeTaken: 0, falseMatches: 0, correctMatches: 0 });
  const [simulationStartTime, setSimulationStartTime] = useState(null);
  const [message, setMessage] = useState('Drag tickets to the appropriate team members');
  const [incorrectDrop, setIncorrectDrop] = useState(false);

  const timerRef = useRef();
  const canvasRef = useRef(null);

  // CRT screen effect
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create scanlines effect
    const drawScanlines = () => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.05)';
      for (let y = 0; y < canvas.height; y += 2) {
        ctx.fillRect(0, y, canvas.width, 1);
      }
    };
    
    // Create flickering effect
    const flicker = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    
    const animate = () => {
      flicker();
      drawScanlines();
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animate);
  }, []);

  const handlePdGameComplete = (data) => {
    const { pdStats, simulationData } = data;
    setPdStats(pdStats || { timeTaken: 0, falseMatches: 0, correctMatches: 0 });
    setRoles(simulationData.roles || {});
    setTickets(simulationData.tickets || []);
    setCompanyDetails(simulationData.companyDetails || '');
    setIsPdChallengeComplete(true);
    setSimulationStartTime(Date.now());
  };

  const generateNewTicket = useCallback(() => {
    if (!tickets || tickets.length === 0) return;
    const newTicket = tickets[Math.floor(Math.random() * tickets.length)];
    newTicket.id = Math.random().toString(36).substr(2, 9);
    newTicket.remainingTime = newTicket.time;
    newTicket.startTime = Date.now();
    setCurrentTicket(newTicket);
  }, [tickets]);

  useEffect(() => {
    if (isPdChallengeComplete && !currentTicket && tickets.length > 0) {
      generateNewTicket();
    }
  }, [currentTicket, tickets, generateNewTicket, isPdChallengeComplete]);

  useEffect(() => {
    if (!isPdChallengeComplete) return;
    timerRef.current = setInterval(() => {
      if (!roles || Object.keys(roles).length === 0) return;
      Object.values(roles).forEach((roleList) => {
        roleList.forEach((role) => {
          const completedTickets = [];
          role.ongoingTickets = role.ongoingTickets
            .map((ticket) => {
              if (ticket.remainingTime > 1) {
                return { ...ticket, remainingTime: ticket.remainingTime - 1 };
              } else {
                completedTickets.push(ticket);
                return null;
              }
            })
            .filter((ticket) => ticket !== null);
          role.completedTickets.push(...completedTickets);
        });
      });
      const totalTickets = Object.values(roles).reduce(
        (total, roleList) =>
          total +
          roleList.reduce(
            (roleTotal, role) =>
              roleTotal + role.completedTickets.length + role.ongoingTickets.length,
            0
          ),
        0
      );
      const completedTicketsCount = Object.values(roles).reduce(
        (total, roleList) =>
          total +
          roleList.reduce((roleTotal, role) => roleTotal + role.completedTickets.length, 0),
        0
      );
      const progressPercentage = totalTickets === 0 ? 0 : (completedTicketsCount / totalTickets) * 100;
      setProgress(progressPercentage);
      if (progressPercentage >= 100) {
        setIsGameComplete(true);
        clearInterval(timerRef.current);
      }
      if (currentTicket && currentTicket.remainingTime <= 0) {
        setScore((prev) => prev - 5);
        const decisionTime = Date.now() - currentTicket.startTime;
        setDecisionTimes((prev) => [...prev, decisionTime]);
        generateNewTicket();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [roles, currentTicket, generateNewTicket, isPdChallengeComplete]);

  const handleDragStart = (e, ticket) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(ticket));
    setIsDragging(true);
    setMessage(`Assigning: ${ticket.title}`);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setHighlightedRole(null);
  };

  const handleDrop = (e, role) => {
    e.preventDefault();
    const ticket = JSON.parse(e.dataTransfer.getData('text'));
    const decisionTime = Date.now() - ticket.startTime;
    setDecisionTimes((prev) => [...prev, decisionTime]);
    
    if (
      ticket.roles.includes(role.name) &&
      role.ongoingTickets.length < role.load &&
      ticket.difficulty <= role.maxDifficulty
    ) {
      role.ongoingTickets.push(ticket);
      setScore((prev) => prev + 10);
      setCorrectAssignments((prev) => prev + 1);
      setMessage('✅ Perfect assignment! Generating new ticket...');
      setTimeout(() => setMessage('Drag tickets to the appropriate team members'), 2000);
      generateNewTicket();
    } else if (
      ticket.roles.includes(role.name) &&
      role.ongoingTickets.length < role.load &&
      ticket.difficulty > role.maxDifficulty
    ) {
      ticket.time *= 1.5;
      ticket.remainingTime = ticket.time;
      role.ongoingTickets.push(ticket);
      setScore((prev) => prev + 5);
      setCorrectAssignments((prev) => prev + 1);
      setMessage('⚠️ Challenging assignment - time increased!');
      setTimeout(() => setMessage('Drag tickets to the appropriate team members'), 2000);
      generateNewTicket();
    } else {
      setScore((prev) => prev - 5);
      setFalseSelections((prev) => prev + 1);
      setMessage('❌ Incorrect assignment! Try again.');
      setIncorrectDrop(true);
      setTimeout(() => {
        setIncorrectDrop(false);
        setMessage('Drag tickets to the appropriate team members');
      }, 2000);
    }
    setIsDragging(false);
    setHighlightedRole(null);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 60);
    const hours = Math.floor((seconds % 60) / 2.5);
    const minutes = Math.floor(((seconds % 60) % 2.5) * 24);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const handleTimeUp = () => {
    setScore((prev) => prev - 5);
    const dt = Date.now() - currentTicket.startTime;
    setDecisionTimes((prev) => [...prev, dt]);
    setMessage('⌛ Time expired! Generating new ticket...');
    setTimeout(() => setMessage('Drag tickets to the appropriate team members'), 2000);
    generateNewTicket();
  };

  const getEmotion = (role) => {
    const ticketCount = role.ongoingTickets.length;
    if (ticketCount === 0) return 'happy';
    if (ticketCount < role.load) return 'neutral';
    if (ticketCount === role.load) return 'angry';
    if (ticketCount > role.load) return 'sad';
    return 'neutral';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-900 text-red-300';
      case 'Medium': return 'bg-yellow-900 text-yellow-300';
      case 'Low': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  if (!isPdChallengeComplete) {
    return <PDMatchingGame onComplete={handlePdGameComplete} />;
  }

  if (isGameComplete) {
    const simulationTime = simulationStartTime
      ? ((Date.now() - simulationStartTime) / 1000).toFixed(2)
      : '0';
    return (
      <StatsPopup
        score={score}
        correctAssignments={correctAssignments}
        falseSelections={falseSelections}
        decisionTimes={decisionTimes}
        pdStats={pdStats}
        simulationTime={simulationTime}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-green-300 font-mono overflow-hidden">
      {/* CRT overlay effect */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-30 z-0"
      />
      
      {/* Header */}
      <header className="relative z-10 bg-gray-900 border-b border-green-500 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold text-green-400">
              {companyDetails || 'CyberCorp Simulation'}
            </h1>
            <p className="text-sm text-green-600">Project Management Terminal</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold">{score}</div>
              <div className="text-xs text-green-600">SCORE</div>
            </div>
            
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold">{correctAssignments}</div>
              <div className="text-xs text-blue-600">CORRECT</div>
            </div>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl font-bold">{falseSelections}</div>
              <div className="text-xs text-red-600">ERRORS</div>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <span className="mr-2 text-sm text-green-400">PRACTICE</span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isPracticeMode}
                    onChange={(e) => setIsPracticeMode(e.target.checked)}
                  />
                  <div className={`w-10 h-4 rounded-full shadow-inner ${isPracticeMode ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                  <div className={`absolute w-6 h-6 rounded-full shadow -left-1 -top-1 transition ${isPracticeMode ? 'bg-green-400 transform translate-x-5' : 'bg-gray-500'}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Message display */}
        <div className={`mt-3 p-2 text-center rounded border ${incorrectDrop ? 'border-red-500 bg-red-900 bg-opacity-30' : 'border-green-500 bg-green-900 bg-opacity-30'} transition-all`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </header>

      <main className="relative z-10 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Current Ticket Panel */}
        <div className="lg:col-span-1 bg-gray-900 border border-green-500 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-bold text-green-400 mb-4 border-b border-green-800 pb-2">
            CURRENT TICKET
          </h2>
          
          {currentTicket ? (
            <div 
              className={`bg-gray-800 border ${isDragging ? 'border-blue-400' : 'border-green-700'} rounded p-4 transition-all duration-200`}
              draggable
              onDragStart={(e) => handleDragStart(e, currentTicket)}
              onDragEnd={handleDragEnd}
            >
              <h3 className="font-bold text-green-300 mb-2">{currentTicket.title}</h3>
              <p className="text-sm text-gray-400 mb-3">{currentTicket.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(currentTicket.priority)}`}>
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
                <CountdownTimer minutes={currentTicket.time / 60} onTimeUp={handleTimeUp} />
              </div>
              
              {isPracticeMode && (
                <div>
                  <h4 className="text-xs text-green-500 mb-1">REQUIRED ROLES:</h4>
                  <div className="flex flex-wrap gap-1">
                    {currentTicket.roles.map((role, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 border border-dashed border-gray-600 rounded p-8 text-center text-gray-500">
              Generating first ticket...
            </div>
          )}
        </div>

        {/* Team Members Grid - Updated with scrolling */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(roles || {}).map(([category, rolesList]) => (
            <div 
              key={category} 
              className="bg-gray-900 border border-green-500 rounded-lg p-4 flex flex-col"
              style={{ maxHeight: '70vh' }}
            >
              <h2 className="text-lg font-bold text-green-400 mb-3 border-b border-green-800 pb-2">
                {category.toUpperCase()}
              </h2>
              
              <div className="overflow-y-auto flex-1 pr-2">
                <div className="space-y-4">
                  {rolesList.map((role) => {
                    const isHighlighted = highlightedRole === role.name;
                    const isOverloaded = role.ongoingTickets.length >= role.load;
                    const emotion = getEmotion(role);
                    
                    return (
                      <div
                        key={role.name}
                        className={`border rounded-lg p-3 transition-all ${isHighlighted ? 'border-blue-400 bg-blue-900 bg-opacity-30' : 'border-gray-700 bg-gray-800'} ${isOverloaded && isDragging ? 'border-red-400 bg-red-900 bg-opacity-30' : ''}`}
                        onDrop={(e) => handleDrop(e, role)}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setHighlightedRole(role.name);
                        }}
                        onDragLeave={() => setHighlightedRole(null)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-green-300">{role.name}</h3>
                            <p className="text-xs text-gray-400">{role.role}</p>
                          </div>
                          <EmotionFace emotion={emotion} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-gray-500">Load:</span> {role.ongoingTickets.length}/{role.load}
                          </div>
                          <div>
                            <span className="text-gray-500">Max Diff:</span> {role.maxDifficulty}
                          </div>
                          <div>
                            <span className="text-gray-500">Exp:</span> {role.experience}y
                          </div>
                          <div>
                            <span className="text-gray-500">Skills:</span> {role.skills.length}
                          </div>
                        </div>
                        
                        <div className="text-xs">
                          <div className="text-green-500 mb-1">ONGOING:</div>
                          {role.ongoingTickets.length > 0 ? (
                            <ul className="space-y-1">
                              {role.ongoingTickets.map((ticket, idx) => (
                                <li key={idx} className="text-gray-400">
                                  • {ticket.title} <span className="text-gray-600">({formatTime(ticket.remainingTime)})</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-600 italic">No active tickets</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Terminal footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-green-500 p-2 text-center text-xs text-green-700">
        SYSTEM STATUS: OPERATIONAL | {new Date().toLocaleString()} | v2.4.1
      </footer>
    </div>
  );
};

export default ProjectSimulationGame;