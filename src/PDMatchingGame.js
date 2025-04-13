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

  // Define + shuffle the stakeholder requirements
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

  // Define + shuffle the technical tickets
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

  // Start timing on mount
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // Handle user clicking a stakeholder requirement
  const handleRequirementClick = (reqId) => {
    if (!matches.includes(reqId)) {
      setSelectedRequirement(reqId);
      setSelectedTicket(null);
      setIncorrectSelection(null);
      setMessage('Now select a matching technical ticket.');
    }
  };

  // Handle user clicking a technical ticket
  const handleTicketClick = (ticket) => {
    if (selectedRequirement) {
      setSelectedTicket(ticket);
      checkMatch(ticket);
    } else {
      setMessage('Please select a stakeholder requirement first.');
    }
  };

  // Check if chosen ticket matches chosen requirement
  const checkMatch = (ticket) => {
    const requirement = stakeholderRequirements.find(r => r.id === selectedRequirement);

    if (requirement.correctMatch === ticket.title) {
      // correct match
      setScore(prev => prev + 1);
      setMatches(prev => [...prev, requirement.id]);
      setCorrectMatches(prev => [...prev, ticket.title]);
      setMessage('Correct match! Select another requirement.');
      setIncorrectSelection(null);
    } else {
      // incorrect match
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
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Title & Instructions */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Product Design Challenge
        </h2>
        <p className="text-gray-600 mb-2">
          Match stakeholder requirements to technical specifications
        </p>
        <div className="mt-2 text-lg font-semibold">
          Score: {score} / {stakeholderRequirements.length}
        </div>
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-gray-800">
          {message}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Stakeholder Requirements List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Stakeholder Requirements
          </h3>
          <div className="space-y-3">
            {stakeholderRequirements.map(req => {
              const isMatched = matches.includes(req.id);
              const isSelected = selectedRequirement === req.id;

              return (
                <div
                  key={req.id}
                  className={`
                    transition-all duration-200 p-4 border rounded cursor-pointer
                    ${isMatched ? 'bg-green-50 cursor-not-allowed opacity-75' : ''}
                    ${isSelected ? 'bg-blue-50 shadow-md transform scale-105 border-blue-300' : ''}
                    hover:shadow-md
                  `}
                  onClick={() => handleRequirementClick(req.id)}
                >
                  <span className="font-medium text-gray-800">
                    {req.requirement}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Tickets List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Technical Tickets
          </h3>
          <div className="space-y-3">
            {technicalTickets.map((ticket, index) => {
              const isCorrect = correctMatches.includes(ticket.title);
              const isIncorrect =
                selectedTicket?.title === ticket.title &&
                incorrectSelection === ticket.title;
              const isSelected =
                selectedTicket?.title === ticket.title && !incorrectSelection;
              const isDisabled = !selectedRequirement;

              return (
                <div
                  key={index}
                  className={`
                    transition-all duration-200 p-4 border rounded cursor-pointer
                    ${isCorrect ? 'bg-green-50 cursor-not-allowed opacity-75 border-green-200' : ''}
                    ${isIncorrect ? 'bg-red-50 shadow-md transform scale-105 border-red-300' : ''}
                    ${isSelected ? 'bg-blue-50 shadow-md transform scale-105 border-blue-300' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                  `}
                  onClick={() => !isDisabled && handleTicketClick(ticket)}
                >
                  <h4 className="font-semibold text-gray-800">
                    {ticket.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {ticket.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-2">
                    <span className="mr-3">
                      <strong>Role:</strong> {ticket.role}
                    </span>
                    <span className="mr-3">
                      <strong>Priority:</strong> {ticket.priority}
                    </span>
                    <span>
                      <strong>Time:</strong> {ticket.time}h
                    </span>
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
