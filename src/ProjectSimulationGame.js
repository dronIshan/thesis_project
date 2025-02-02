import React, { useState, useEffect, useRef } from 'react';
import CountdownTimer from './CountdownTimer';
import EmotionFace from './EmotionFace';
import PDMatchingGame from './PDMatchingGame';

const roles = {
  Development: [
    {
      name: 'Backend Developer',
      icon: '🖥️',
      experience: 5,
      skills: ['Java', 'Python', 'Node.js'],
      role: 'senior',
      load: 3,
      maxDifficulty: 5,
      ongoingTickets: [],
      completedTickets: []
    },
    {
      name: 'Backend Developer Intern',
      icon: '🖥️',
      experience: 2,
      skills: ['Java', 'Python'],
      role: 'intern',
      load: 1,
      maxDifficulty: 3,
      ongoingTickets: [],
      completedTickets: []
    }
  ],
  Management: [
    {
      name: 'Project Manager',
      icon: '📅',
      experience: 8,
      skills: ['Agile', 'Scrum', 'Jira'],
      role: 'senior',
      load: 5,
      maxDifficulty: 5,
      ongoingTickets: [],
      completedTickets: []
    },
    {
      name: 'Product Owner',
      icon: '🎯',
      experience: 7,
      skills: ['Roadmapping', 'User Stories', 'Backlog Management'],
      role: 'senior',
      load: 4,
      maxDifficulty: 4,
      ongoingTickets: [],
      completedTickets: []
    }
  ],
  Design: [
    {
      name: 'UX/UI Designer',
      icon: '🖌️',
      experience: 5,
      skills: ['Figma', 'Sketch', 'User Research'],
      role: 'senior',
      load: 3,
      maxDifficulty: 5,
      ongoingTickets: [],
      completedTickets: []
    },
    {
      name: 'Graphic Designer',
      icon: '🎭',
      experience: 6,
      skills: ['Photoshop', 'Illustrator', 'InDesign'],
      role: 'senior',
      load: 3,
      maxDifficulty: 6,
      ongoingTickets: [],
      completedTickets: []
    }
  ]
};

const ProjectSimulationGame = () => {
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [companyDetails, setCompanyDetails] = useState('');
  const [highlightedRole, setHighlightedRole] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPdChallengeComplete, setIsPdChallengeComplete] = useState(false);

  const timerRef = useRef();

  const handlePdGameComplete = () => {
    setIsPdChallengeComplete(true);
  };

  useEffect(() => {
    if (!currentTicket) {
      generateNewTicket();
    }
  }, [currentTicket]);

  useEffect(() => {
    generateCompanyDetails();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
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

      const completedTickets = Object.values(roles).reduce(
        (total, roleList) =>
          total +
          roleList.reduce(
            (roleTotal, role) => roleTotal + role.completedTickets.length,
            0
          ),
        0
      );

      const progressPercentage = totalTickets === 0 ? 0 : (completedTickets / totalTickets) * 100;
      setProgress(progressPercentage);

      if (currentTicket && currentTicket.remainingTime <= 0) {
        setScore(prevScore => prevScore - 5);
        generateNewTicket();
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentTicket]);

  const generateCompanyDetails = () => {
    const companies = [
      'TechNova Solutions: AI-driven software development',
      'GreenLeaf Innovations: Sustainable energy solutions',
      'QuantumLink Systems: Quantum computing research',
      'BioGenix Labs: Advanced biotechnology and genetics',
      'CyberShield Securities: Cutting-edge cybersecurity services'
    ];
    setCompanyDetails(companies[Math.floor(Math.random() * companies.length)]);
  };

  const generateNewTicket = () => {
    const tickets = [
      {
        title: 'Implement user authentication',
        description: 'Create a secure login system for the application.',
        role: 'Backend Developer',
        priority: 'High',
        difficulty: 4,
        time: 60
      },
      {
        title: 'Optimize database queries',
        description: 'Improve the performance of SQL queries for faster data retrieval.',
        role: 'Backend Developer',
        priority: 'Medium',
        difficulty: 3,
        time: 45
      },
      {
        title: 'Design responsive UI',
        description: 'Create a mobile-friendly interface for the dashboard.',
        role: 'UX/UI Designer',
        priority: 'Low',
        difficulty: 2,
        time: 30
      },
      {
        title: 'Integrate payment gateway',
        description: 'Add support for multiple payment methods in the checkout process.',
        role: 'Backend Developer',
        priority: 'High',
        difficulty: 5,
        time: 75
      },
      {
        title: 'Implement real-time notifications',
        description: 'Set up WebSocket connections for instant updates.',
        role: 'Backend Developer',
        priority: 'Medium',
        difficulty: 3,
        time: 60
      }
    ];
    const newTicket = tickets[Math.floor(Math.random() * tickets.length)];
    newTicket.id = Math.random().toString(36).substr(2, 9);
    newTicket.remainingTime = newTicket.time;
    setCurrentTicket(newTicket);
  };

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
    if (
      ticket.role === role.name &&
      role.ongoingTickets.length < role.load &&
      ticket.difficulty <= role.maxDifficulty
    ) {
      role.ongoingTickets.push(ticket);
      setScore(prevScore => prevScore + 10);
      generateNewTicket();
    } else if (
      ticket.role === role.name &&
      role.ongoingTickets.length < role.load &&
      ticket.difficulty > role.maxDifficulty
    ) {
      ticket.time = ticket.time * 1.5;
      ticket.remainingTime = ticket.time;
      role.ongoingTickets.push(ticket);
      setScore(prevScore => prevScore + 5);
      generateNewTicket();
    } else {
      setScore(prevScore => prevScore - 5);
    }
    setIsDragging(false);
    setHighlightedRole(null);
  };

  const handleDragOver = (e, roleName) => {
    e.preventDefault();
    if (isDragging) {
      setHighlightedRole(roleName);
    }
  };

  const handleDragLeave = () => {
    if (isDragging) {
      setHighlightedRole(null);
    }
  };

  const handleRoleHover = (roleName) => {
    if (!isPracticeMode && !isDragging) {
      setHighlightedRole(roleName);
    }
  };

  const handleTicketHover = (isHovering) => {
    if (isPracticeMode && isHovering && currentTicket) {
      setHighlightedRole(currentTicket.role);
    } else if (isPracticeMode && !isHovering) {
      setHighlightedRole(null);
    }
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 60);
    const hours = Math.floor((seconds % 60) / 2.5);
    const minutes = Math.floor(((seconds % 60) % 2.5) * 24);
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleTimeUp = () => {
    setScore(prevScore => prevScore - 5);
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

  if (!isPdChallengeComplete) {
    return <PDMatchingGame onComplete={handlePdGameComplete} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ backgroundColor: '#f3f4f6', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '100%', height: '1rem', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#22c55e', width: `${progress}%` }}></div>
          </div>
          <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Score: {score}</span>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
            <span style={{ marginRight: '0.5rem' }}>Practice Mode</span>
            <input type="checkbox" checked={isPracticeMode} onChange={(e) => setIsPracticeMode(e.target.checked)} />
          </div>
        </div>
      </header>
      <main style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: '25%', backgroundColor: '#e5e7eb', padding: '1rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <div style={{ marginLeft: '0.5rem', padding: '0.5rem', backgroundColor: '#d1fae5', borderRadius: '0.25rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Company Details:</p>
              <p style={{ fontSize: '0.75rem' }}>{companyDetails}</p>
            </div>
          </div>
          {currentTicket && (
            <div
              style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.25rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, currentTicket)}
              onDragEnd={handleDragEnd}
              onMouseEnter={() => handleTicketHover(true)}
              onMouseLeave={() => handleTicketHover(false)}
            >
              <h3 style={{ fontWeight: 'bold' }}>{currentTicket.title}</h3>
              <p>{currentTicket.description}</p>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginLeft: '0.5rem' }}>Priority: {currentTicket.priority}</span>
                <span style={{ marginLeft: '0.5rem' }}>Difficulty: {currentTicket.difficulty}</span>
                <span style={{ marginLeft: '0.5rem' }}>Allocated Time: {currentTicket.time / 60} days</span>
              </div>
              <div>
                <CountdownTimer minutes={currentTicket.time / 60} onTimeUp={handleTimeUp} />
              </div>
            </div>
          )}
        </aside>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1rem' }}>
          {Object.entries(roles).map(([category, rolesList]) => (
            <div key={category} style={{ overflowY: 'auto', maxHeight: '80vh' }}>
              <h2 style={{ textAlign: 'center', fontWeight: 'bold', padding: '0.5rem', backgroundColor: '#f3f4f6', marginBottom: '1rem' }}>
                {category}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {rolesList.map((role) => (
                  <div
                    key={role.name}
                    style={{
                      aspectRatio: '1 / 1',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'background-color 0.3s',
                      backgroundColor:
                        role.ongoingTickets.length >= role.load && isDragging
                          ? '#ef4444'
                          : highlightedRole === role.name
                          ? isDragging
                            ? '#d1fae5'
                            : '#fef3c7'
                          : 'white',
                      borderColor:
                        highlightedRole === role.name && isDragging
                          ? '#22c55e'
                          : '#e5e7eb',
                      borderWidth:
                        highlightedRole === role.name && isDragging
                          ? '2px'
                          : '1px'
                    }}
                    onDrop={(e) => handleDrop(e, role)}
                    onDragOver={(e) => handleDragOver(e, role.name)}
                    onDragLeave={handleDragLeave}
                    onMouseEnter={() => handleRoleHover(role.name)}
                    onMouseLeave={() => handleRoleHover(null)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>{role.icon}</span>
                        <h3 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{role.name}</h3>
                      </div>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Experience: {role.experience} years</p>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Role: {role.role}</p>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Max Difficulty: {role.maxDifficulty}</p>
                      <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Load: {role.load}</p>
                      <div style={{ flexGrow: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Skills:</p>
                        <ul style={{ fontSize: '0.75rem', listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Ongoing Tickets:</p>
                        <ul style={{ fontSize: '0.75rem', listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.ongoingTickets.map((ticket, index) => (
                            <li key={index}>{ticket.title} ({formatTime(ticket.remainingTime)})</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Completed Tickets:</p>
                        <ul style={{ fontSize: '0.75rem', listStyleType: 'disc', paddingLeft: '1rem' }}>
                          {role.completedTickets.map((ticket, index) => (
                            <li key={index}>{ticket.title}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <EmotionFace emotion={getEmotion(role)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectSimulationGame;
