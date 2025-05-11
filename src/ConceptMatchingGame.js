// src/ConceptMatchingGame.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmotionFace from "./EmotionFace";
import CountdownTimer from "./CountdownTimer";

// --- SVG Icons (Slightly smaller default if not overridden by className) ---
const IconAcademicCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 mr-2 text-indigo-400"
  >
    {" "}
    {/* w-7 h-7 -> w-6 h-6 */}
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
    <path
      fillRule="evenodd"
      d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);
const IconStar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mr-1 text-yellow-400"
  >
    {" "}
    {/* w-5 h-5 -> w-4 h-4 */}
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);
const IconExclamationTriangle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mr-1 text-red-400"
  >
    {" "}
    {/* w-5 h-5 -> w-4 h-4 */}
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.519 13.007a3 3 0 01-2.598 4.5H4.48a3 3 0 01-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);
const IconFire = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 mr-1 text-orange-400"
  >
    {" "}
    {/* w-5 h-5 -> w-4 h-4 */}
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071 1.05l.002.002A17.106 17.106 0 0112 12c0 .206.01.41.029.613l-.001.002a.75.75 0 00.55.696l.002.001a17.604 17.604 0 003.635 1.352l.003.001.004.001a1.5 1.5 0 01.752 2.159.75.75 0 00.38.262c.018.005.036.009.054.013l.002.001a7.53 7.53 0 012.345 1.075.75.75 0 001.002-.21l.002-.002a1.13 1.13 0 011.437-1.612.75.75 0 00.429-1.019l-.001-.004a13.403 13.403 0 00-2.353-4.656l-.003-.003a.75.75 0 00-.656-.36l-.004-.001a1.503 1.503 0 01-1.076-.673.75.75 0 00-.64-.403h-.002q-.003 0-.005.001a6.68 6.68 0 00-1.973-.318l-.002-.002A13.23 13.23 0 0112 3.75c0-.53.045-1.05.132-1.561l.002-.003zM9.75 12c0-.032.002-.063.005-.094A12.923 12.923 0 0012 11.25c.282 0 .56.018.836.053l.001.001.003.001.004.001a.75.75 0 00.68-.535l.002-.002A11.4 11.4 0 0015 9a.75.75 0 00-1.5 0c0 .075-.004.149-.01.222l.002-.002a.75.75 0 00.012 1.273l-.001.002a11.435 11.435 0 00-2.992 1.254l-.003.001a.75.75 0 00-.271 1.017l.002.003a7.433 7.433 0 01.789 4.057.75.75 0 00.659.737l.003.001a7.5 7.5 0 004.422-.323.75.75 0 00.536-.835l-.001-.002a1.506 1.506 0 01.814-1.645.75.75 0 00.378-.818l-.001-.003a5.92 5.92 0 00-1.034-3.213.75.75 0 00-.848-.413A17.683 17.683 0 0112 15.75c-1.598 0-3.137-.205-4.566-.587a.75.75 0 01-.519-.868l.002-.004a18.45 18.45 0 002.823-6.667.75.75 0 00-.608-.86l-.002-.001a13.021 13.021 0 00-2.426-1.043.75.75 0 00-.51.066L6 6.375a.75.75 0 00-.375.65V12c0 .414.336.75.75.75h3.375z"
      clipRule="evenodd"
    />
  </svg>
);
const IconFolder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 mr-1.5 text-blue-400"
  >
    {" "}
    {/* mr-2 -> mr-1.5 */}
    <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 9.75A3 3 0 014.5 6.75h4.636a1.5 1.5 0 011.214.61L11.79 9h7.71a3 3 0 013 3v1.5a.75.75 0 01-1.5 0V12a1.5 1.5 0 00-1.5-1.5h-7.928a1.5 1.5 0 01-1.214-.61L8.202 7.5H4.5a1.5 1.5 0 00-1.5 1.5V18a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-4.5a.75.75 0 011.5 0V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.75z" />
  </svg>
);
const IconDocument = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4 mr-1.5 text-blue-300 flex-shrink-0"
  >
    {" "}
    {/* mr-2 -> mr-1.5 */}
    <path
      fillRule="evenodd"
      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
      clipRule="evenodd"
    />
    <path d="M12.971 1.816A5.23 5.23 0 0114.25 1.5c.463 0 .907.067 1.312.191l.006.002a6.71 6.71 0 001.414 5.44V9A1.5 1.5 0 0015.5 7.5h-1.875a3.375 3.375 0 01-3.375-3.375V2.25l-.009-.009a6.75 6.75 0 00-1.993-2.018.75.75 0 00-1.01.048Z" />
  </svg>
);
const IconClipboardList = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 mr-1.5 text-blue-400"
  >
    {" "}
    {/* mr-2 -> mr-1.5 */}
    <path
      fillRule="evenodd"
      d="M10.5 3A2.5 2.5 0 008 5.5V6h8V5.5A2.5 2.5 0 0013.5 3h-3zm-2.5 9a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm.75 2.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
    <path d="M4.5 6.75A.75.75 0 005.25 6H6v-.5A3.5 3.5 0 019.5 2h5A3.5 3.5 0 0118 5.5V6h.75a.75.75 0 00.75-.75V5.25a3 3 0 00-3-3h-1.5a.75.75 0 00-.75.75V3A1.5 1.5 0 0013.5 1.5h-3A1.5 1.5 0 009 3v.75a.75.75 0 00-.75.75V6H3.75A.75.75 0 003 6.75v11.5a3 3 0 003 3h12a3 3 0 003-3V6.75a.75.75 0 00-.75-.75H18v3.75a.75.75 0 01-1.5 0V6.75H6v12a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V6.75H6V6.75z" />
  </svg>
);
const IconDragHandle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4 text-gray-500 mr-1.5 opacity-60 flex-shrink-0"
  >
    {" "}
    {/* w-5 h-5 -> w-4 h-4, mr-2 -> mr-1.5, opacity-50 -> 60, strokeWidth 1.5 -> 2, added flex-shrink-0 */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const IconUserCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5 text-green-400"
  >
    {" "}
    {/* w-6 h-6 -> w-5 h-5, mr-2 -> mr-1.5 */}
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      clipRule="evenodd"
    />
  </svg>
);
const IconLightBulb = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4 mr-1.5"
  >
    {" "}
    {/* h-5 w-5 -> h-4 w-4, mr-2 -> mr-1.5 */}
    <path d="M12 2.25a.75.75 0 01.75.75v2.033A3.004 3.004 0 0115.75 8c0 .749-.22 1.436-.607 2.007a.75.75 0 01-1.22-.7C13.94 8.802 14.25 8.41 14.25 8a1.5 1.5 0 00-3 0c0 .41.31.702.327.707a.75.75 0 01-1.22.701A3.002 3.002 0 019.75 8c0-1.03.538-1.94.1332-2.542V3a.75.75 0 01.75-.75zM8.25 9.75A2.25 2.25 0 006 12v3A2.25 2.25 0 008.25 17.25h7.5A2.25 2.25 0 0018 15v-3A2.25 2.25 0 0015.75 9.75h-7.5zM12 21a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0112 21z" />
  </svg>
);
const IconInformationCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5 flex-shrink-0"
  >
    {" "}
    {/* w-6 h-6 -> w-5 h-5, mr-2 -> mr-1.5, added flex-shrink-0 */}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.04-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);
const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5"
  >
    {" "}
    {/* w-6 h-6 -> w-5 h-5, mr-2 -> mr-1.5 */}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.103 3.104-1.497-1.497a.75.75 0 00-1.06 1.06l2.027 2.027a.75.75 0 001.06 0l3.64-3.64z"
      clipRule="evenodd"
    />
  </svg>
);
const IconXCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5"
  >
    {" "}
    {/* w-6 h-6 -> w-5 h-5, mr-2 -> mr-1.5 */}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm10.28-2.56a.75.75 0 00-1.06 1.06L12.94 12l-1.47 1.47a.75.75 0 101.06 1.06L14.47 12l1.47-1.47a.75.75 0 00-1.06-1.06L12 12.94l-1.47-1.47z"
      clipRule="evenodd"
    />
  </svg>
);
const IconTrophy = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-12 w-12 mx-auto text-yellow-400 mb-3"
  >
    {" "}
    {/* h-16 w-16 -> h-12 w-12, mb-4 -> mb-3 */}
    <path
      fillRule="evenodd"
      d="M3.75 3.75A.75.75 0 003 4.5v15A.75.75 0 003.75 21h16.5a.75.75 0 00.75-.75V13.643c0-.421-.174-.832-.485-1.133L15.864 8.24a.75.75 0 00-1.06 0l-1.015 1.015a.75.75 0 01-1.06 0l-1.126-1.125a3 3 0 00-4.242 0L3.08 12.388a.75.75 0 01-1.06-1.061l4.287-4.287a4.5 4.5 0 016.364 0l1.125 1.125a.75.75 0 001.06 0l1.015-1.015a.75.75 0 011.06 0l4.636 4.636a1.5 1.5 0 01.485 1.133V19.5A.75.75 0 0021 18.75v-7.683a.75.75 0 00-.22-.53L16.03 5.79a4.5 4.5 0 00-6.363 0L7.91 7.547a.75.75 0 01-1.06-1.06L11.137 2.2a3 3 0 014.242 0l4.091 4.09a3 3 0 01.83 2.122V19.5a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 19.5v-15A1.5 1.5 0 013.75 2.25h2.733a.75.75 0 000-1.5H3.75zM9 8.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z"
      clipRule="evenodd"
    />
  </svg>
);
// --- End SVG Icons ---

const initialConcepts = [
  {
    id: 1,
    name: "Stakeholder Analysis",
    definition: "Identifying and prioritizing stakeholder needs",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 2,
    name: "Requirements Elicitation",
    definition: "Gathering requirements from users and stakeholders",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 3,
    name: "Use Case Modeling",
    definition: "Describing system interactions via use cases",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 4,
    name: "Functional Requirements",
    definition: "What the system must do",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 5,
    name: "Non-Functional Req'ts",
    definition: "System qualities like performance or security",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 6,
    name: "Traceability Matrix",
    definition: "Mapping requirements through design and test",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 7,
    name: "Requirement Prioritization",
    definition: "Ranking requirements by importance",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 8,
    name: "Prototyping",
    definition: "Creating early models for feedback",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 9,
    name: "Change Management",
    definition: "Managing requirement changes over time",
    scenarios: [],
    emotion: "neutral",
  },
  {
    id: 10,
    name: "Validation & Verification",
    definition: "Ensuring requirements are met and correct",
    scenarios: [],
    emotion: "neutral",
  },
];

const initialScenarios = [
  {
    id: 1,
    text: "Users want to modify their profile picture at runtime",
    conceptId: 2,
    difficulty: 2,
  },
  {
    id: 2,
    text: "The system must respond within 1 second under peak load",
    conceptId: 5,
    difficulty: 3,
  },
  {
    id: 3,
    text: "Need to track which requirements are implemented in each module",
    conceptId: 6,
    difficulty: 2,
  },
  {
    id: 4,
    text: "Customers want to see a demo before finalizing requirements",
    conceptId: 8,
    difficulty: 1,
  },
  {
    id: 5,
    text: "Regulations require audit trails for all data changes",
    conceptId: 9,
    difficulty: 3,
  },
  {
    id: 6,
    text: "Need to verify compliance with accessibility standards",
    conceptId: 10,
    difficulty: 2,
  },
  {
    id: 7,
    text: "Users want to prioritize features based on business value",
    conceptId: 7,
    difficulty: 2,
  },
  {
    id: 8,
    text: "Stakeholders can't agree on payment system requirements",
    conceptId: 1,
    difficulty: 3,
  },
  {
    id: 9,
    text: "Need to document all user-system interactions",
    conceptId: 3,
    difficulty: 2,
  },
  {
    id: 10,
    text: "System must support 10,000 concurrent users",
    conceptId: 5,
    difficulty: 3,
  },
];

export default function ConceptMatchingGame() {
  const [concepts, setConcepts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [npcMood, setNpcMood] = useState(1);
  const [hint, setHint] = useState("");
  const [materials, setMaterials] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(
    "Drag course materials here, or click to select."
  );
  const [highlightedConceptId, setHighlightedConceptId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [index, setIndex] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalScenarios, setTotalScenarios] = useState(initialScenarios.length);
  const [maxStreak, setMaxStreak] = useState(0); // For game completion screen

  const headerRef = useRef();
  const fileInputRef = useRef(null);
  const [timePaused, setTimePaused] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);

  useEffect(() => {
    if (streakCount > maxStreak) {
      setMaxStreak(streakCount);
    }
  }, [streakCount, maxStreak]);

  const resetGame = () => {
    const conceptsCopy = JSON.parse(JSON.stringify(initialConcepts));
    const scenariosCopy = JSON.parse(JSON.stringify(initialScenarios));

    setConcepts(
      conceptsCopy.map((c) => ({ ...c, scenarios: [], emotion: "neutral" }))
    );
    setScenarios(scenariosCopy);
    setCurrentScenario(scenariosCopy[0] || null);
    setScore(0);
    setErrors(0);
    setNpcMood(1);
    setHint("");
    setMaterials([]);
    setUploadStatus("Drag course materials here, or click to select.");
    setHighlightedConceptId(null);
    setIsDragging(false);
    setIndex(0);
    setCorrectMatches(0);
    setTotalScenarios(scenariosCopy.length);
    setTimePaused(false);
    setStreakCount(0);
    setMaxStreak(0); // Reset max streak
    setShowFeedback(null);
  };

  useEffect(() => {
    resetGame();
  }, []);

  const handleMaterialDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-gray-700/50"
    );
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (files.length) {
      setUploadStatus(`Processing ${files.length} file(s)...`);
      setTimePaused(true);
      setTimeout(() => {
        setMaterials(files);
        setUploadStatus(
          `${files.length} material(s) ready. (Analysis not implemented)`
        );
        setTimePaused(false);
      }, 1500);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("ring-2", "ring-blue-500", "bg-gray-700/50"); // Slightly more subtle bg
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-gray-700/50"
    );
  };

  const handleScenarioDragStart = (e, scenario) => {
    e.dataTransfer.setData("application/json", JSON.stringify(scenario));
    setIsDragging(true);
  };

  const handleScenarioDragEnd = () => {
    setIsDragging(false);
    setHighlightedConceptId(null);
  };

  const handleConceptDrop = (e, concept) => {
    e.preventDefault();
    if (!currentScenario && !e.dataTransfer.types.includes("application/json"))
      return;

    let scenarioToMatch;
    try {
      scenarioToMatch = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch (error) {
      // If data is not from our draggable scenario (e.g., a file drag), ignore or handle differently
      // For this game, we primarily expect scenario drops
      if (isDragging && currentScenario) {
        // Fallback if getData fails but we were dragging our scenario
        scenarioToMatch = currentScenario;
      } else {
        console.warn("Dropped item is not a valid scenario.", error);
        setIsDragging(false);
        setHighlightedConceptId(null);
        return;
      }
    }

    setIsDragging(false);
    setHighlightedConceptId(null);

    if (scenarioToMatch.conceptId === concept.id) {
      const pointsEarned = 10 * scenarioToMatch.difficulty;
      setScore((s) => s + pointsEarned);
      setStreakCount((prev) => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === concept.id
            ? {
                ...c,
                scenarios: [...c.scenarios, scenarioToMatch],
                emotion: "happy",
              }
            : {
                ...c,
                emotion:
                  c.scenarios.length > 0 && c.id !== concept.id
                    ? c.emotion
                    : "neutral",
              }
        )
      );
      setCorrectMatches((prev) => prev + 1);
      setShowFeedback({
        type: "success",
        message: `+${pointsEarned} points! ${
          streakCount + 1 > 1 ? `Streak: ${streakCount + 1}` : ""
        }`,
      });
      setNpcMood(0);

      const remaining = scenarios.filter((s) => s.id !== scenarioToMatch.id);
      setScenarios(remaining);
      setCurrentScenario(remaining[0] || null);
      setIndex((i) => i + 1);
    } else {
      const penalty = 5 * scenarioToMatch.difficulty;
      setScore((s) => Math.max(0, s - penalty));
      setErrors((e) => e + 1);
      setStreakCount(0);
      setConcepts((prev) =>
        prev.map((c) => {
          if (c.id === concept.id) return { ...c, emotion: "sad" };
          return c.scenarios.length > 0 ? c : { ...c, emotion: "neutral" };
        })
      );
      setShowFeedback({
        type: "error",
        message: `-${penalty} pts. Belongs to ${
          initialConcepts.find((c) => c.id === scenarioToMatch.conceptId)
            ?.name || "another concept"
        }.`,
      });
      setNpcMood(2);
    }
    setHint("");

    setTimeout(() => {
      setShowFeedback(null);
      if (scenarioToMatch.conceptId !== concept.id) {
        setConcepts((prev) =>
          prev.map((c) =>
            c.id === concept.id && c.scenarios.length === 0
              ? { ...c, emotion: "neutral" }
              : c
          )
        );
      }
    }, 2500); // Slightly shorter feedback display
  };

  const handleTimeUp = () => {
    if (!currentScenario) return;

    const penalty = 5 * currentScenario.difficulty;
    setScore((s) => Math.max(0, s - penalty));
    setErrors((e) => e + 1);
    setStreakCount(0);
    setShowFeedback({
      type: "error",
      message: `Time's up! -${penalty} points for scenario.`, // Shorter message
    });
    setNpcMood(2);

    setIndex((i) => i + 1);

    const remainingScenarios = scenarios.filter(
      (s) => s.id !== currentScenario.id
    );

    if (index >= totalScenarios - 1) {
      setScenarios([]); // Clear out the last scenario too
      setCurrentScenario(null);
    } else {
      setScenarios([...remainingScenarios, currentScenario]); // Move to back
      setCurrentScenario(remainingScenarios[0] || currentScenario); // Set next, or itself if it was the only one left (should then be handled by index check)
    }
    setTimeout(() => setShowFeedback(null), 2500);
  };

  const getNpcHint = async () => {
    if (!currentScenario) return;
    const hintPenalty = 20; // Adjusted penalty
    setScore((s) => Math.max(0, s - hintPenalty));
    setHint("Thinking...");
    setNpcMood(1);

    await new Promise((res) => setTimeout(res, 600)); // Faster thinking

    const targetConcept = initialConcepts.find(
      (c) => c.id === currentScenario.conceptId
    );
    let hintText = `This relates to ${
      targetConcept ? targetConcept.name.toLowerCase() : "a core idea"
    }.`;

    switch (currentScenario.conceptId) {
      case 1:
        hintText = "Focus on identifying who is involved or impacted.";
        break;
      case 5:
        hintText = "Think about qualities like system speed or security.";
        break;
      default:
        break;
    }

    setHint(hintText);
    setShowFeedback({
      type: "info",
      message: `-${hintPenalty} points for hint!`,
    });
    setTimeout(() => setShowFeedback(null), 2500);
  };

  const GameCompletionDisplay = () => (
    <div className="p-4 text-center bg-gray-800 rounded-lg shadow-xl">
      {" "}
      {/* p-6 -> p-4 */}
      <IconTrophy /> {/* Size already adjusted in its definition */}
      <h2 className="text-2xl font-bold text-yellow-400 mb-3">
        {" "}
        {/* text-3xl -> text-2xl, mb-4 -> mb-3 */}
        Challenge Complete!
      </h2>
      <div className="space-y-1 text-base mb-4">
        {" "}
        {/* text-lg -> text-base, space-y-2 -> space-y-1, mb-6 -> mb-4 */}
        <p>
          Final Score:{" "}
          <span className="font-semibold text-green-400">{score}</span>
        </p>
        <p>
          Correct:{" "}
          <span className="font-semibold text-gray-200">
            {correctMatches} / {totalScenarios}
          </span>
        </p>
        <p>
          Errors: <span className="font-semibold text-red-400">{errors}</span>
        </p>
        <p>
          Max Streak:{" "}
          <span className="font-semibold text-orange-400">{maxStreak}</span>
        </p>
      </div>
      <button
        className="mt-3 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition text-base shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50" // Adjusted padding, text size, rounded-lg -> md
        onClick={resetGame}
      >
        Play Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans text-sm">
      {" "}
      {/* Added base text-sm */}
      {/* Header */}
      <header
        ref={headerRef}
        className="bg-gray-800 p-3 border-b border-gray-700 sticky top-0 z-20 shadow-lg" // p-4 -> p-3
      >
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* max-w-7xl -> max-w-6xl */}
          <div className="flex justify-between items-center mb-2">
            {" "}
            {/* mb-3 -> mb-2 */}
            <div className="flex items-center">
              <IconAcademicCap /> {/* Size already adjusted */}
              <h1 className="text-xl font-bold text-indigo-300">
                {" "}
                {/* text-3xl -> text-xl */}
                Concept Matching Challenge
              </h1>
            </div>
            <div className="flex gap-2">
              {" "}
              {/* gap-3 -> gap-2 */}
              {[
                {
                  label: "Score",
                  value: score,
                  icon: <IconStar />,
                  color: "text-green-400",
                },
                {
                  label: "Errors",
                  value: errors,
                  icon: <IconExclamationTriangle />,
                  color: "text-red-400",
                },
                {
                  label: "Streak",
                  value: streakCount,
                  icon: <IconFire />,
                  color: "text-orange-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-2 bg-gray-700 rounded-md shadow min-w-[80px] transition-all hover:bg-gray-600"
                >
                  {" "}
                  {/* p-3 -> p-2, rounded-lg -> md, min-w-[100px] -> [80px] */}
                  <div className="flex items-center justify-center">
                    {item.icon} {/* Size already adjusted */}
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>{" "}
                    {/* text-2xl -> text-lg */}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>{" "}
                  {/* Added mt-0.5 */}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden shadow-inner">
            {" "}
            {/* h-4 -> h-3 */}
            <motion.div
              className="bg-green-500 h-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  totalScenarios > 0
                    ? (correctMatches / totalScenarios) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            {" "}
            {/* text-sm -> text-xs */}
            <p>
              Progress: {correctMatches} / {totalScenarios} matched
            </p>
            <p>
              Attempted: {index} / {totalScenarios} scenarios
            </p>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
        {" "}
        {/* max-w-7xl -> 6xl, p-4/lg:p-6 -> p-3/lg:p-4, gap-6 -> gap-4 */}
        {/* Feedback Toast */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }} /* y-50 -> y-30 */
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-xl flex items-center ${
              /* top-24 -> top-20, px-6 py-4 -> px-4 py-2, rounded-lg -> md */
              showFeedback.type === "success"
                ? "bg-green-600"
                : showFeedback.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {showFeedback.type === "success" && <IconCheckCircle />}{" "}
            {/* Size already adjusted */}
            {showFeedback.type === "error" && <IconXCircle />}
            {showFeedback.type === "info" && <IconInformationCircle />}
            <p className="text-white text-sm font-medium">
              {showFeedback.message}
            </p>{" "}
            {/* Removed explicit font-medium, inherit from parent text-sm */}
          </motion.div>
        )}
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          {" "}
          {/* space-y-6 -> space-y-4 */}
          {/* Materials Zone */}
          <div
            className="bg-gray-800 p-4 rounded-lg border border-dashed border-blue-500 shadow-md cursor-pointer hover:border-blue-400 transition-all" /* p-5 -> p-4, shadow-lg -> md */
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleMaterialDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              className="hidden"
            />
            <h2 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
              {" "}
              {/* text-xl -> text-lg, mb-3 -> mb-2 */}
              <IconFolder /> Course Materials
            </h2>
            <div className="min-h-[80px] p-3 bg-gray-700/30 rounded-md flex flex-col items-center justify-center transition-all">
              {" "}
              {/* min-h-[100px] -> [80px], p-4 -> p-3 */}
              <p className="text-blue-300 text-center text-xs">
                {uploadStatus}
              </p>{" "}
              {/* text-sm -> text-xs */}
            </div>
            {materials.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {" "}
                {/* mt-3 -> mt-2, space-y-2 -> space-y-1.5 */}
                <h3 className="text-xs font-medium text-gray-400">
                  Uploaded:
                </h3>{" "}
                {/* text-sm -> text-xs */}
                {materials.map((file, i) => (
                  <div
                    key={i}
                    className="truncate px-2 py-1 bg-gray-700/80 rounded-md flex items-center text-xs shadow-sm"
                  >
                    {" "}
                    {/* px-3 py-2 -> px-2 py-1, text-sm -> text-xs, shadow -> sm */}
                    <IconDocument />
                    <span className="ml-1 flex-grow truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Current Scenario */}
          <div className="bg-gray-800 p-4 rounded-lg border border-indigo-500 shadow-md">
            {" "}
            {/* p-5 -> p-4, shadow-lg -> md */}
            <h2 className="text-lg font-semibold mb-2 flex items-center text-indigo-300">
              {" "}
              {/* text-xl -> text-lg, mb-3 -> mb-2 */}
              <IconClipboardList /> Current Scenario
            </h2>
            {currentScenario ? (
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, y: 15 }} // y:20 -> y:15
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-700 rounded-md cursor-grab shadow border border-gray-600 hover:shadow-indigo-500/20" // p-4 -> p-3, rounded-lg -> md, shadow-md -> shadow, hover:shadow-indigo-500/30 -> /20
                draggable
                onDragStart={(e) => handleScenarioDragStart(e, currentScenario)}
                onDragEnd={handleScenarioDragEnd}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }} // scale 1.02 -> 1.01, shadow adjusted
                whileTap={{ scale: 0.99, cursor: "grabbing" }} // scale 0.98 -> 0.99
              >
                <div className="flex items-start mb-1.5">
                  {" "}
                  {/* mb-2 -> mb-1.5 */}
                  <IconDragHandle /> {/* Size adjusted in definition */}
                  <p className="text-sm font-medium text-gray-200 leading-normal">
                    {currentScenario.text}
                  </p>{" "}
                  {/* Removed leading-relaxed, adjusted font style */}
                </div>
                <div className="mt-2 text-xs text-blue-300 flex items-center justify-between">
                  {" "}
                  {/* mt-3 -> mt-2 */}
                  <span>Difficulty:</span>
                  <span className="flex">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`w-3.5 h-3.5 ${
                            i < currentScenario.difficulty
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }`}
                        >
                          {" "}
                          {/* w-4 h-4 -> w-3.5 h-3.5 (custom size, or use w-3 h-3) */}
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-600/70">
                  {" "}
                  {/* mt-4 pt-3 -> mt-3 pt-2, border-gray-600 -> /70 */}
                  <CountdownTimer
                    key={`timer-${currentScenario.id}-${index}`}
                    minutes={1}
                    onTimeUp={handleTimeUp}
                    isPaused={timePaused}
                  />
                </div>
              </motion.div>
            ) : (
              <GameCompletionDisplay />
            )}
          </div>
          {currentScenario && (
            <div className="bg-gray-800 p-4 rounded-lg border border-green-500/40 shadow-md">
              {" "}
              {/* p-5 -> p-4, border opacity reduced, shadow-lg -> md */}
              <div className="flex items-center justify-between mb-3">
                {" "}
                {/* mb-4 -> mb-3 */}
                <div className="flex items-center">
                  <IconUserCircle /> {/* Size already adjusted */}
                  <div>
                    <h2 className="text-lg font-semibold text-green-300">
                      {" "}
                      {/* text-xl -> text-lg */}
                      Requirement Engineer
                    </h2>
                    <p className="text-xs text-gray-400">
                      Available for consultation
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 flex-shrink-0">
                  {" "}
                  {/* w-16 h-16 -> w-12 h-12 */}
                  <EmotionFace
                    emotion={["happy", "neutral", "angry"][npcMood]}
                  />
                </div>
              </div>
              <button
                onClick={getNpcHint}
                disabled={!currentScenario || hint === "Thinking..."}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white text-sm font-semibold p-2 rounded-md transition-colors flex items-center justify-center shadow hover:shadow-md" // p-3 -> p-2, font-semibold -> text-sm font-semibold, rounded-lg -> md, shadow-lg -> md
              >
                <IconLightBulb /> Ask for Hint (-20pts){" "}
                {/* Icon size already adjusted */}
              </button>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 p-2.5 bg-gray-700/80 rounded-md text-xs border-l-4 border-yellow-400 shadow-sm" // mt-4 p-3 -> mt-3 p-2.5, text-sm -> text-xs, bg-gray-700 -> /80, shadow -> sm
                >
                  <p className="text-yellow-300 flex items-start mb-0.5">
                    {" "}
                    {/* Added mb-0.5 */}
                    <IconInformationCircle /> {/* Size already adjusted */}
                    <span className="font-semibold ml-0.5">Hint:</span>{" "}
                    {/* Added ml-0.5 */}
                  </p>
                  <p className="pl-7 text-gray-300">{hint}</p>{" "}
                  {/* pl-8 -> pl-7 */}
                </motion.div>
              )}
            </div>
          )}
        </div>
        {/* Concepts Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {" "}
          {/* gap-5 -> gap-4 */}
          {concepts.map((concept) => (
            <motion.div
              key={concept.id}
              onDrop={(e) => handleConceptDrop(e, concept)}
              onDragOver={(e) => {
                e.preventDefault();
                setHighlightedConceptId(concept.id);
              }}
              onDragLeave={() => setHighlightedConceptId(null)}
              className={`p-3 bg-gray-800 rounded-lg border-2 transition-all relative shadow-md hover:shadow-lg
                ${
                  highlightedConceptId === concept.id
                    ? "border-yellow-400 ring-1 ring-yellow-300 bg-gray-700/60 transform scale-103 z-10" // p-4 -> p-3, rounded-xl -> lg, shadow-lg -> md, ring-2 -> ring-1, scale-105 -> 103
                    : concept.emotion === "happy"
                    ? "border-green-500/60" // opacity /70 -> /60
                    : concept.emotion === "sad"
                    ? "border-red-500/60"
                    : "border-gray-700/60"
                }`}
              whileHover={{ y: -4, boxShadow: "0px 8px 16px rgba(0,0,0,0.2)" }} // y:-5 -> y:-4, shadow adjusted
              layout
            >
              <div className="flex items-start justify-between mb-1.5">
                {" "}
                {/* mb-2 -> mb-1.5 */}
                <div className="flex-1 pr-1.5">
                  {" "}
                  {/* pr-2 -> pr-1.5 */}
                  <h3 className="text-md font-bold text-indigo-200">
                    {concept.name}
                  </h3>{" "}
                  {/* text-xl -> text-md (or text-lg) */}
                  <p className="text-xs text-gray-400 mt-0.5 italic">
                    {concept.definition}
                  </p>{" "}
                  {/* mt-1 -> mt-0.5 */}
                </div>
                <div className="w-10 h-10 flex-shrink-0 -mt-0.5 -mr-0.5">
                  {" "}
                  {/* w-14 h-14 -> w-10 h-10 (or w-12 h-12), margins adjusted */}
                  <EmotionFace emotion={concept.emotion} />
                </div>
              </div>

              {concept.scenarios.length > 0 && (
                <div className="mt-2 border-t border-gray-700/70 pt-2">
                  {" "}
                  {/* mt-3 pt-3 -> mt-2 pt-2, border opacity */}
                  <h4 className="text-xs font-semibold mb-1.5 text-green-400 flex items-center">
                    {" "}
                    {/* mb-2 -> mb-1.5 */}
                    <IconCheckCircle className="w-4 h-4 mr-1" /> Matched
                    Scenarios ({concept.scenarios.length}):{" "}
                    {/* Explicitly sized icon */}
                  </h4>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {" "}
                    {/* space-y-1.5 -> space-y-1, max-h-36 -> max-h-28 */}
                    {concept.scenarios.map((s) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: -8 }} // x:-10 -> x:-8
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs bg-gray-700/40 p-1.5 rounded border-l-4 border-green-600 shadow-sm" // bg opacity, p-2 -> p-1.5, rounded-md -> rounded
                      >
                        {s.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
