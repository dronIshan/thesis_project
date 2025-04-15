// PDMatchingGame.js
import React, { useState, useEffect } from 'react';

// Fisher–Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const API_BASE = 'https://ishanvimukthi.pythonanywhere.com/api';

const PDMatchingGame = ({ onComplete }) => {
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

  // 1) Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, techRes] = await Promise.all([
          fetch(`${API_BASE}/pd-requirements`),
          fetch(`${API_BASE}/pd-technical-tickets`)
        ]);
        const reqData  = await reqRes.json();
        const techData = await techRes.json();
        shuffle(reqData);
        shuffle(techData);
        setStakeholderRequirements(reqData);
        setTechnicalTickets(techData);
        setStartTime(Date.now());
      } catch (err) {
        console.error('Failed to load PD data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2) Core matching logic (unchanged)...
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
    const requirement = stakeholderRequirements.find(r => r.id === selectedRequirement);
    if (requirement.correctMatch === ticket.title) {
      setScore(s => s + 1);
      setMatches(m => [...m, requirement.id]);
      setCorrectMatches(cm => [...cm, ticket.title]);
      setMessage('Correct match! Select another requirement.');
    } else {
      setMessage('Incorrect match. Try again.');
      setIncorrectSelection(ticket.title);
      setFalseMatches(fm => fm + 1);
    }
    setTimeout(() => {
      setSelectedRequirement(null);
      setSelectedTicket(null);
      setIncorrectSelection(null);
    }, 1000);
  };

  // 3) When all matched, fire onComplete with stats
  useEffect(() => {
    if (!loading && matches.length === stakeholderRequirements.length) {
      setMessage('All matches done! Starting the main game...');
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      setTimeout(() => {
        onComplete?.({ timeTaken, correctMatches: score, falseMatches });
      }, 1500);
    }
  }, [matches, loading, stakeholderRequirements, onComplete, score, falseMatches, startTime]);

  // 4) Render
  if (loading) {
    return <div className="p-4 text-center">Loading challenge…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Design Challenge</h2>
        <p className="text-gray-600 mb-2">Match stakeholder requirements to technical tickets</p>
        <div className="font-semibold mb-2">Score: {score} / {stakeholderRequirements.length}</div>
        <div className="p-3 bg-yellow-100 border rounded">{message}</div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Requirements */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Stakeholder Requirements</h3>
          <div className="space-y-3">
            {stakeholderRequirements.map(req => {
              const isMatched = matches.includes(req.id);
              const isSelected = selectedRequirement === req.id;
              return (
                <div
                  key={req.id}
                  className={`
                    p-4 border rounded cursor-pointer
                    ${isMatched   ? 'bg-green-50 opacity-75 cursor-not-allowed' : ''}
                    ${isSelected  ? 'bg-blue-50 shadow-md scale-105 border-blue-300' : 'hover:shadow-md'}
                  `}
                  onClick={() => handleRequirementClick(req.id)}
                >
                  {req.requirement}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tickets */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Technical Tickets</h3>
          <div className="space-y-3">
            {technicalTickets.map((ticket, i) => {
              const isCorrect   = correctMatches.includes(ticket.title);
              const isIncorrect = selectedTicket?.title === ticket.title && incorrectSelection === ticket.title;
              const isSelected  = selectedTicket?.title === ticket.title && !incorrectSelection;
              const disabled    = !selectedRequirement;
              return (
                <div
                  key={i}
                  className={`
                    p-4 border rounded cursor-pointer
                    ${isCorrect    ? 'bg-green-50 opacity-75 cursor-not-allowed' : ''}
                    ${isIncorrect  ? 'bg-red-50 shadow-md scale-105 border-red-300' : ''}
                    ${isSelected   ? 'bg-blue-50 shadow-md scale-105 border-blue-300' : ''}
                    ${disabled     ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                  `}
                  onClick={() => !disabled && handleTicketClick(ticket)}
                >
                  <h4 className="font-semibold">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="mr-3"><strong>Role:</strong> {ticket.role}</span>
                    <span className="mr-3"><strong>Priority:</strong> {ticket.priority}</span>
                    <span><strong>Time:</strong> {ticket.time}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDMatchingGame;
