// PDMatchingGame.js
import React, { useState, useEffect, useMemo } from 'react';

// Fisher–Yates (Durstenfeld) shuffle in-place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const PDMatchingGame = ({ onComplete }) => {
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [matches, setMatches] = useState([]);
  const [correctMatches, setCorrectMatches] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Select a stakeholder requirement to begin');
  const [incorrectSelection, setIncorrectSelection] = useState(null);

  // For stats
  const [startTime, setStartTime] = useState(null);
  const [falseMatches, setFalseMatches] = useState(0);

  // We define + shuffle the stakeholder requirements
  const stakeholderRequirements = useMemo(() => {
    const arr = [
      {
        id: 1,
        requirement: "We need a way for users to securely log into their accounts",
        correctMatch: "Implement user authentication"
      },
      {
        id: 2,
        requirement: "The website is loading too slowly when users search for products",
        correctMatch: "Optimize database queries"
      },
      {
        id: 3,
        requirement: "Our customers complain that the website doesn't work well on their phones",
        correctMatch: "Design responsive UI"
      },
      {
        id: 4,
        requirement: "We want to accept credit cards and PayPal on our store",
        correctMatch: "Integrate payment gateway"
      },
      {
        id: 5,
        requirement: "Users want to know immediately when someone messages them",
        correctMatch: "Implement real-time notifications"
      }
    ];
    shuffle(arr); // randomize in place
    return arr;
  }, []);

  // We define + shuffle the technical tickets
  const technicalTickets = useMemo(() => {
    const arr = [
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
    shuffle(arr); // randomize in place
    return arr;
  }, []);

  // Start timing the challenge on mount
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleRequirementClick = (reqId) => {
    if (!matches.includes(reqId)) {
      setSelectedRequirement(reqId);
      setSelectedTicket(null);
      setIncorrectSelection(null);
      setMessage('Now select a matching technical ticket.');
    }
  };

  const handleTicketClick = (ticket) => {
    if (selectedRequirement) {
      setSelectedTicket(ticket);
      checkMatch(ticket);
    } else {
      setMessage('Please select a stakeholder requirement first.');
    }
  };

  const checkMatch = (ticket) => {
    const requirement = stakeholderRequirements.find(r => r.id === selectedRequirement);

    if (requirement.correctMatch === ticket.title) {
      setScore(prev => prev + 1);
      setMatches(prev => [...prev, requirement.id]);
      setCorrectMatches(prev => [...prev, ticket.title]);
      setMessage('Correct match! Select another requirement.');
      setIncorrectSelection(null);
    } else {
      setMessage('Incorrect match. Try another ticket or requirement.');
      setIncorrectSelection(ticket.title);
      setFalseMatches(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedRequirement(null);
      setSelectedTicket(null);
      setIncorrectSelection(null);
    }, 1000);
  };

  // If user matched all stakeholder requirements
  useEffect(() => {
    if (matches.length === stakeholderRequirements.length) {
      setMessage('All matches done! Starting the main game...');
      const timeTakenSec = Math.round((Date.now() - startTime) / 1000);
      const finalStats = {
        timeTaken: timeTakenSec,
        correctMatches: score,
        falseMatches: falseMatches
      };

      setTimeout(() => {
        onComplete?.(finalStats);
      }, 1500);
    }
  }, [matches, stakeholderRequirements, onComplete, score, falseMatches, startTime]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Design Challenge</h2>
        <p className="text-gray-600">Match stakeholder requirements to technical specifications</p>
        <div className="mt-2">Score: {score} / {stakeholderRequirements.length}</div>
        <div className="mt-2 p-2 bg-yellow-100 border rounded">{message}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Stakeholder Requirements */}
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
                    cursor-pointer transition-all duration-200 p-4 border rounded
                    ${isMatched ? 'bg-green-100 cursor-not-allowed' : ''}
                    ${isSelected ? 'bg-blue-100 shadow-md transform scale-105' : ''}
                    hover:shadow-lg
                  `}
                  onClick={() => handleRequirementClick(req.id)}
                >
                  {req.requirement}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Tickets */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Technical Tickets</h3>
          <div className="space-y-3">
            {technicalTickets.map((ticket, index) => {
              const isCorrect = correctMatches.includes(ticket.title);
              const isIncorrect = selectedTicket?.title === ticket.title && incorrectSelection === ticket.title;
              const isSelected = selectedTicket?.title === ticket.title && !incorrectSelection;
              const isDisabled = !selectedRequirement;

              return (
                <div
                  key={index}
                  className={`
                    cursor-pointer transition-all duration-200 p-4 border rounded
                    ${isCorrect ? 'bg-green-100 cursor-not-allowed' : ''}
                    ${isIncorrect ? 'bg-red-100 shadow-md transform scale-105' : ''}
                    ${isSelected ? 'bg-blue-100 shadow-md transform scale-105' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                  `}
                  onClick={() => !isDisabled && handleTicketClick(ticket)}
                >
                  <h4 className="font-semibold">{ticket.title}</h4>
                  <p className="text-sm text-gray-600">{ticket.description}</p>
                  <div className="mt-2 text-sm">
                    <span className="mr-3">Role: {ticket.role}</span>
                    <span className="mr-3">Priority: {ticket.priority}</span>
                    <span>Time: {ticket.time}h</span>
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
