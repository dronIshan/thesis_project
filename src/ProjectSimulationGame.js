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

  // Simulation stats
  const [falseSelections, setFalseSelections] = useState(0);
  const [correctAssignments, setCorrectAssignments] = useState(0);
  const [decisionTimes, setDecisionTimes] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Product Design Challenge stats
  const [pdStats, setPdStats] = useState({ timeTaken: 0, falseMatches: 0, correctMatches: 0 });

  // (Optional) track how long the simulation lasts
  const [simulationStartTime, setSimulationStartTime] = useState(null);

  const timerRef = useRef();

  // ----------------------------------------------------------------------
  // Fetch roles
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetch('https://ishanvimukthi.pythonanywhere.com/api/roles')
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((err) => console.error('Error fetching roles:', err));
  }, []);

  // ----------------------------------------------------------------------
  // Fetch simulation tickets
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetch('https://ishanvimukthi.pythonanywhere.com/api/simulation-tickets')
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((err) => console.error('Error fetching tickets:', err));
  }, []);

  // ----------------------------------------------------------------------
  // Fetch company data
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetch('https://ishanvimukthi.pythonanywhere.com/api/companies')
      .then((res) => res.json())
      .then((data) => {
        // Pick a random company from the array
        const randomCompany = data[Math.floor(Math.random() * data.length)];
        setCompanyDetails(randomCompany);
      })
      .catch((err) => console.error('Error fetching company data:', err));
  }, []);

  // ----------------------------------------------------------------------
  // Called once PDMatchingGame is done
  // ----------------------------------------------------------------------
  const handlePdGameComplete = (stats) => {
    setPdStats(stats || { timeTaken: 0, falseMatches: 0, correctMatches: 0 });
    setIsPdChallengeComplete(true);
    setSimulationStartTime(Date.now());
  };

  // ----------------------------------------------------------------------
  // Generate a new ticket at random from the fetched tickets
  // ----------------------------------------------------------------------
  const generateNewTicket = useCallback(() => {
    if (!tickets || tickets.length === 0) return;
    const newTicket = tickets[Math.floor(Math.random() * tickets.length)];
    newTicket.id = Math.random().toString(36).substr(2, 9);
    newTicket.remainingTime = newTicket.time;
    newTicket.startTime = Date.now();
    setCurrentTicket(newTicket);
  }, [tickets]);

  // If no ticket, generate one
  useEffect(() => {
    if (!currentTicket && tickets.length > 0) {
      generateNewTicket();
    }
  }, [currentTicket, tickets, generateNewTicket]);

  // ----------------------------------------------------------------------
  // Timer + progress updates
  // ----------------------------------------------------------------------
  useEffect(() => {
    timerRef.current = setInterval(() => {
      // Skip if roles not yet loaded
      if (!roles || Object.keys(roles).length === 0) return;

      // Decrement remaining time for each assigned ticket
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

      // Calculate total vs completed for the progress bar
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

      const progressPercentage =
        totalTickets === 0 ? 0 : (completedTicketsCount / totalTickets) * 100;
      setProgress(progressPercentage);

      // End game if progress hits 100%
      if (progressPercentage >= 100) {
        setIsGameComplete(true);
        clearInterval(timerRef.current);
      }

      // If current ticket expires, penalize and generate new
      if (currentTicket && currentTicket.remainingTime <= 0) {
        setScore((prev) => prev - 5);
        const decisionTime = Date.now() - currentTicket.startTime;
        setDecisionTimes((prev) => [...prev, decisionTime]);
        generateNewTicket();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [roles, currentTicket, generateNewTicket]);

  // ----------------------------------------------------------------------
  // Drag + Drop
  // ----------------------------------------------------------------------
  const handleDragStart = (e, ticket) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(ticket));
    setIsDragging(true);
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
      // fully correct
      role.ongoingTickets.push(ticket);
      setScore((prev) => prev + 10);
      setCorrectAssignments((prev) => prev + 1);
      generateNewTicket();
    } else if (
      ticket.roles.includes(role.name) &&
      role.ongoingTickets.length < role.load &&
      ticket.difficulty > role.maxDifficulty
    ) {
      // role can do it but difficulty is high -> partial reward
      ticket.time *= 1.5;
      ticket.remainingTime = ticket.time;
      role.ongoingTickets.push(ticket);
      setScore((prev) => prev + 5);
      setCorrectAssignments((prev) => prev + 1);
      generateNewTicket();
    } else {
      // incorrect
      setScore((prev) => prev - 5);
      setFalseSelections((prev) => prev + 1);
    }

    setIsDragging(false);
    setHighlightedRole(null);
  };

  // ----------------------------------------------------------------------
  // Utility for formatting time (for the role's ongoing tickets)
  // ----------------------------------------------------------------------
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 60);
    const hours = Math.floor((seconds % 60) / 2.5);
    const minutes = Math.floor(((seconds % 60) % 2.5) * 24);
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${
      hours !== 1 ? 's' : ''
    }, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleTimeUp = () => {
    setScore((prev) => prev - 5);
    const dt = Date.now() - currentTicket.startTime;
    setDecisionTimes((prev) => [...prev, dt]);
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

  // ----------------------------------------------------------------------
  // If the PD matching game isn't finished, show that first
  // ----------------------------------------------------------------------
  if (!isPdChallengeComplete) {
    return <PDMatchingGame onComplete={handlePdGameComplete} />;
  }

  // ----------------------------------------------------------------------
  // If the simulation is complete, show the StatsPopup
  // ----------------------------------------------------------------------
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

  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Header Section */}
      <header
        style={{
          backgroundColor: '#374151',
          padding: '1rem',
          color: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Progress bar container */}
          <div
            style={{
              flex: 1,
              height: '1rem',
              backgroundColor: '#6b7280',
              borderRadius: '9999px',
              marginRight: '1rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: '#10b981',
                width: `${progress}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          {/* Score Display */}
          <span style={{ fontWeight: 'bold' }}>Score: {score}</span>

          {/* Practice mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
            <span style={{ marginRight: '0.5rem' }}>Practice Mode</span>
            <input
              type="checkbox"
              checked={isPracticeMode}
              onChange={(e) => setIsPracticeMode(e.target.checked)}
            />
          </div>
        </div>

        {/* Company Details */}
        <div style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
          <strong>Company:</strong> {companyDetails}
        </div>
      </header>

      {/* Main content area */}
      <main style={{ display: 'flex', flex: 1 }}>
        <aside
          style={{
            width: '25%',
            backgroundColor: '#f3f4f6',
            padding: '1rem',
            boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600' }}>
            Current Ticket
          </h2>
          {currentTicket && (
            <div
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, currentTicket)}
              onDragEnd={handleDragEnd}
            >
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {currentTicket.title}
              </h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {currentTicket.description}
              </p>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ marginRight: '0.5rem' }}>
                  <strong>Priority:</strong> {currentTicket.priority}
                </span>
                <span style={{ marginRight: '0.5rem' }}>
                  <strong>Difficulty:</strong> {currentTicket.difficulty}
                </span>
                <span>
                  <strong>Allocated:</strong>{' '}
                  {(currentTicket.time / 60).toFixed(2)} days
                </span>
              </div>
              <CountdownTimer
                minutes={currentTicket.time / 60}
                onTimeUp={handleTimeUp}
              />
            </div>
          )}
        </aside>

        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            padding: '1rem'
          }}
        >
          {Object.entries(roles || {}).map(([category, rolesList]) => (
            <div key={category} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 4rem)' }}>
              <h2
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '0.5rem'
                }}
              >
                {category}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {rolesList.map((role) => {
                  const isRoleHighlighted = highlightedRole === role.name;
                  const isRoleOverloaded = role.ongoingTickets.length >= role.load && isDragging;

                  return (
                    <div
                      key={role.name}
                      style={{
                        border: '1px solid #e5e7eb',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                        backgroundColor: isRoleOverloaded
                          ? '#ef4444' // red if overloaded
                          : isRoleHighlighted && isDragging
                          ? '#d1fae5' // light-green if drag highlight
                          : isRoleHighlighted
                          ? '#fef3c7' // light-yellow highlight if hovered
                          : 'white',
                        borderColor: isRoleHighlighted && isDragging ? '#22c55e' : '#e5e7eb',
                        borderWidth: isRoleHighlighted && isDragging ? '2px' : '1px',
                        transition: 'background-color 0.3s, box-shadow 0.3s'
                      }}
                      onDrop={(e) => handleDrop(e, role)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                          {role.icon}
                        </span>
                        <h3 style={{ fontWeight: 'bold', fontSize: '0.9rem', margin: 0 }}>
                          {role.name}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>
                        <strong>Experience:</strong> {role.experience} years
                      </p>
                      <p style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>
                        <strong>Role:</strong> {role.role}
                      </p>
                      <p style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>
                        <strong>Max Difficulty:</strong> {role.maxDifficulty}
                      </p>
                      <p style={{ fontSize: '0.8rem', margin: '0.25rem 0' }}>
                        <strong>Load:</strong> {role.load}
                      </p>

                      <div style={{ fontSize: '0.8rem', margin: '0.5rem 0' }}>
                        <strong>Skills:</strong>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.skills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        <strong>Ongoing Tickets:</strong>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.ongoingTickets.map((ticket, idx) => (
                            <li key={idx}>
                              {ticket.title} ({formatTime(ticket.remainingTime)})
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong>Completed Tickets:</strong>
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.completedTickets.map((ticket, idx) => (
                            <li key={idx}>{ticket.title}</li>
                          ))}
                        </ul>
                      </div>

                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                        <EmotionFace emotion={getEmotion(role)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectSimulationGame;
