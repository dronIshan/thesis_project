// src/REQSIM.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmotionFace from "./EmotionFace";
import CountdownTimer from "./CountdownTimer";

// --- SVG Icons ---
const IconAcademicCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 mr-2 text-indigo-400"
  >
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
    className="w-5 h-5 mr-2 text-green-400"
  >
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
    className="h-5 w-5 mr-1.5"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v2.033A3.004 3.004 0 0115.75 8c0 .749-.22 1.436-.607 2.007a.75.75 0 01-1.22-.7C13.94 8.802 14.25 8.41 14.25 8a1.5 1.5 0 00-3 0c0 .41.31.702.327.707a.75.75 0 01-1.22.701A3.002 3.002 0 019.75 8c0-1.03.538-1.94.1332-2.542V3a.75.75 0 01.75-.75zM8.25 9.75A2.25 2.25 0 006 12v3A2.25 2.25 0 008.25 17.25h7.5A2.25 2.25 0 0018 15v-3A2.25 2.25 0 0015.75 9.75h-7.5zM12 21a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0112 21z" />
  </svg>
);
const IconInformationCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2 flex-shrink-0"
  >
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
    className="w-5 h-5 mr-2"
  >
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
    className="w-5 h-5 mr-2"
  >
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
    className="h-14 w-14 mx-auto text-yellow-400 mb-3"
  >
    <path
      fillRule="evenodd"
      d="M3.75 3.75A.75.75 0 003 4.5v15A.75.75 0 003.75 21h16.5a.75.75 0 00.75-.75V13.643c0-.421-.174-.832-.485-1.133L15.864 8.24a.75.75 0 00-1.06 0l-1.015 1.015a.75.75 0 01-1.06 0l-1.126-1.125a3 3 0 00-4.242 0L3.08 12.388a.75.75 0 01-1.06-1.061l4.287-4.287a4.5 4.5 0 016.364 0l1.125 1.125a.75.75 0 001.06 0l1.015-1.015a.75.75 0 011.06 0l4.636 4.636a1.5 1.5 0 01.485 1.133V19.5A.75.75 0 0021 18.75v-7.683a.75.75 0 00-.22-.53L16.03 5.79a4.5 4.5 0 00-6.363 0L7.91 7.547a.75.75 0 01-1.06-1.06L11.137 2.2a3 3 0 014.242 0l4.091 4.09a3 3 0 01.83 2.122V19.5a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 19.5v-15A1.5 1.5 0 013.75 2.25h2.733a.75.75 0 000-1.5H3.75zM9 8.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z"
      clipRule="evenodd"
    />
  </svg>
);
// --- End SVG Icons ---

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://ishanvimukthi.pythonanywhere.com";

export default function REQSIM() {
  const [concepts, setConcepts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [
    resolvedConceptsForCurrentScenario,
    setResolvedConceptsForCurrentScenario,
  ] = useState(new Set());

  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [npcMood, setNpcMood] = useState(1);
  const [hint, setHint] = useState("");
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(
    "Upload course materials (txt, pdf, pptx) to begin!"
  );
  const [highlightedConceptId, setHighlightedConceptId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [index, setIndex] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalScenariosInitialCount, setTotalScenariosInitialCount] =
    useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const headerRef = useRef();
  const fileInputRef = useRef(null);
  const [timePaused, setTimePaused] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [gameInitialized, setGameInitialized] = useState(false);

  useEffect(() => {
    if (streakCount > maxStreak) {
      setMaxStreak(streakCount);
    }
  }, [streakCount, maxStreak]);

  const setupNewScenario = (scenarioList) => {
    if (scenarioList && scenarioList.length > 0) {
      const nextScenarioSource = scenarioList[0];
      const nextScenario = {
        ...nextScenarioSource,
        conceptIds: Array.isArray(nextScenarioSource.conceptIds)
          ? nextScenarioSource.conceptIds
          : nextScenarioSource.conceptIds
          ? [nextScenarioSource.conceptIds]
          : [],
      };
      setCurrentScenario(nextScenario);
      setResolvedConceptsForCurrentScenario(new Set());
    } else {
      setCurrentScenario(null);
    }
  };

  const resetGame = (newConcepts = [], newScenarios = []) => {
    setConcepts(
      newConcepts.map((c) => ({
        ...c,
        scenarios: c.scenarios || [],
        emotion: "neutral",
      }))
    );
    setScenarios(newScenarios);
    setupNewScenario(newScenarios);
    setScore(0);
    setErrors(0);
    setNpcMood(1);
    setHint("");
    setHighlightedConceptId(null);
    setIsDragging(false);
    setIndex(0);
    setCorrectMatches(0);
    setTotalScenariosInitialCount(newScenarios.length);
    setTimePaused(false);
    setStreakCount(0);
    setMaxStreak(0);
    setShowFeedback(null);

    if (newConcepts.length > 0 && newScenarios.length > 0) {
      setGameInitialized(true);
      // Update upload status only if materials caused this reset
      if (materials.length > 0) {
        setUploadStatus(`${materials[0].name} processed. Game ready!`);
      } else {
        setUploadStatus(
          "Game ready with default content (if any) or processed content."
        );
      }
    } else {
      setGameInitialized(false);
      setUploadStatus(
        "Upload course materials (txt, pdf, pptx) to begin REQSIM!"
      );
      setMaterials([]);
    }
  };

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processFiles = async (files) => {
    if (files.length === 0) return;

    const fileToProcess = files[0]; // Process one file at a time

    // Basic client-side validation for example (more robust validation can be added)
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-powerpoint",
    ];
    if (
      !allowedTypes.includes(fileToProcess.type) &&
      !fileToProcess.name.endsWith(".txt") &&
      !fileToProcess.name.endsWith(".pdf") &&
      !fileToProcess.name.endsWith(".pptx") &&
      !fileToProcess.name.endsWith(".ppt")
    ) {
      setUploadStatus(
        "Unsupported file type. Please use .txt, .pdf, or .pptx/.ppt."
      );
      setShowFeedback({
        type: "error",
        message: "Unsupported file. Try .txt, .pdf, or .pptx.",
      });
      setTimeout(() => setShowFeedback(null), 3000);
      return;
    }

    setIsLoadingMaterials(true);
    setUploadStatus(`Uploading and processing '${fileToProcess.name}'...`);
    setTimePaused(true);
    setGameInitialized(false);

    const formData = new FormData();
    formData.append("course_material_file", fileToProcess);

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reqsim/process-materials`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ error: "Server error processing file." }));
        throw new Error(
          errData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (
        !data.concepts ||
        !data.scenarios ||
        !Array.isArray(data.concepts) ||
        !Array.isArray(data.scenarios)
      ) {
        throw new Error("Received invalid data structure from server.");
      }
      if (data.concepts.length === 0 || data.scenarios.length === 0) {
        setShowFeedback({
          type: "info",
          message:
            "AI could not generate content from this material. Try different content or check if the file has readable text.",
        });
        // Still call resetGame to clear out old data and show empty state correctly
        resetGame([], []);
        setUploadStatus("No game content generated. Please try another file.");
        // Do not set materials if processing failed to produce content
      } else {
        const validatedScenarios = data.scenarios.map((s) => ({
          ...s,
          conceptIds: Array.isArray(s.conceptIds)
            ? s.conceptIds
            : s.conceptIds
            ? [s.conceptIds]
            : [],
        }));
        setMaterials([fileToProcess]);
        resetGame(data.concepts, validatedScenarios);
        setShowFeedback({
          type: "success",
          message: "Materials processed successfully!",
        });
        setTimeout(() => setShowFeedback(null), 3000);
      }
    } catch (error) {
      console.error("Error processing materials:", error);
      setUploadStatus("Error processing materials. Please try again.");
      setShowFeedback({
        type: "error",
        message: `Failed to load game data: ${error.message}.`,
      });
      setTimeout(() => setShowFeedback(null), 5000);
      resetGame();
    } finally {
      setIsLoadingMaterials(false);
      setTimePaused(false);
    }
  };

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
    e.target.value = null;
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("ring-2", "ring-blue-500", "bg-gray-700/50");
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

  const handleConceptDrop = (e, targetConcept) => {
    e.preventDefault();
    if (!currentScenario) return;

    const scenarioToMatch = currentScenario;

    setIsDragging(false);
    setHighlightedConceptId(null);

    const conceptIdsArray = Array.isArray(scenarioToMatch.conceptIds)
      ? scenarioToMatch.conceptIds
      : [scenarioToMatch.conceptIds];
    const isCorrectConceptForScenario = conceptIdsArray.includes(
      targetConcept.id
    );
    const isAlreadyResolvedForThisScenario =
      resolvedConceptsForCurrentScenario.has(targetConcept.id);

    if (isCorrectConceptForScenario && !isAlreadyResolvedForThisScenario) {
      const newResolvedParts = new Set(resolvedConceptsForCurrentScenario).add(
        targetConcept.id
      );
      setResolvedConceptsForCurrentScenario(newResolvedParts);

      const pointsForThisPart =
        Math.round(
          (10 * scenarioToMatch.difficulty) / (conceptIdsArray.length || 1)
        ) || 5;
      setScore((s) => s + pointsForThisPart);

      setConcepts((prev) =>
        prev.map((c) =>
          c.id === targetConcept.id ? { ...c, emotion: "happy" } : c
        )
      );

      if (newResolvedParts.size === conceptIdsArray.length) {
        setStreakCount((prev) => {
          const newStreak = prev + 1;
          if (newStreak > maxStreak) setMaxStreak(newStreak);
          return newStreak;
        });
        setCorrectMatches((prev) => prev + 1);
        setShowFeedback({
          type: "success",
          message: `Scenario complete! All ${
            conceptIdsArray.length
          } concepts found. Total +${
            pointsForThisPart * conceptIdsArray.length
          } pts. ${streakCount + 1 > 1 ? `Streak: ${streakCount + 1}` : ""}`,
        });
        setNpcMood(0);

        setConcepts((prevConcepts) =>
          prevConcepts.map((c) => {
            if (conceptIdsArray.includes(c.id)) {
              const scenarioExists = c.scenarios.find(
                (s) => s.id === scenarioToMatch.id
              );
              return {
                ...c,
                scenarios: scenarioExists
                  ? c.scenarios
                  : [...c.scenarios, scenarioToMatch],
                emotion: "happy",
              };
            }
            return c;
          })
        );

        const remaining = scenarios.filter((s) => s.id !== scenarioToMatch.id);
        setScenarios(remaining);
        setupNewScenario(remaining);
        setIndex((i) => i + 1);
      } else {
        setShowFeedback({
          type: "success",
          message: `Concept '${targetConcept.name}' found! +${pointsForThisPart} pts. (${newResolvedParts.size}/${conceptIdsArray.length})`,
        });
        setNpcMood(1);
      }
    } else if (
      isCorrectConceptForScenario &&
      isAlreadyResolvedForThisScenario
    ) {
      setShowFeedback({
        type: "info",
        message: `You've already matched '${targetConcept.name}' for this scenario.`,
      });
      setConcepts((prev) =>
        prev.map((c) => {
          if (c.id === targetConcept.id) {
            const isHappyFromOtherScenarios = c.scenarios.some(
              (s) =>
                s.id !== scenarioToMatch.id &&
                s.conceptIds &&
                s.conceptIds.includes(c.id)
            );
            return isHappyFromOtherScenarios ? c : { ...c, emotion: "neutral" };
          }
          return c;
        })
      );
      setNpcMood(1);
    } else {
      const penalty = 5;
      setScore((s) => Math.max(0, s - penalty));
      setErrors((e) => e + 1);
      setStreakCount(0);
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === targetConcept.id ? { ...c, emotion: "sad" } : c
        )
      );

      setShowFeedback({
        type: "error",
        message: `-${penalty} pts. '${targetConcept.name}' is not relevant here.`,
      });
      setNpcMood(2);
    }

    setHint("");

    setTimeout(() => {
      setShowFeedback(null);
      if (!isCorrectConceptForScenario) {
        setConcepts((prev) =>
          prev.map((c) =>
            c.id === targetConcept.id &&
            c.scenarios.every(
              (s) =>
                !(s.conceptIds && s.conceptIds.includes(c.id)) ||
                s.id === scenarioToMatch.id
            )
              ? { ...c, emotion: "neutral" }
              : c
          )
        );
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    if (!currentScenario) return;
    const conceptIdsArray = Array.isArray(currentScenario.conceptIds)
      ? currentScenario.conceptIds
      : [currentScenario.conceptIds];
    const unresolvedPartsCount =
      conceptIdsArray.length - resolvedConceptsForCurrentScenario.size;
    const penalty = 5 * (unresolvedPartsCount > 0 ? unresolvedPartsCount : 1);
    setScore((s) => Math.max(0, s - penalty));
    setErrors((e) => e + 1);
    setStreakCount(0);
    setShowFeedback({
      type: "error",
      message: `Time's up! -${penalty} points for unfinished scenario.`,
    });
    setNpcMood(2);

    setIndex((i) => i + 1);

    const remaining = scenarios.filter((s) => s.id !== currentScenario.id);
    setScenarios(remaining);
    setupNewScenario(remaining);

    setTimeout(() => setShowFeedback(null), 3000);
  };

  const getNpcHint = async () => {
    if (!currentScenario || isLoadingHint) return;

    setIsLoadingHint(true);
    const hintPenalty = 10;
    setScore((s) => Math.max(0, s - hintPenalty));
    setHint("The Requirement Engineer is pondering...");
    setNpcMood(1);

    try {
      const payload = {
        current_scenario: currentScenario,
        resolved_concept_ids_for_current_scenario: Array.from(
          resolvedConceptsForCurrentScenario
        ),
        all_concepts: concepts,
      };

      const response = await fetch(`${BACKEND_URL}/api/reqsim/npc-hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ error: "Unknown hint error" }));
        throw new Error(
          errData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setHint(
        data.hint_text || "Hmm, try to look at it from a different angle."
      );
      setShowFeedback({
        type: "info",
        message: `-${hintPenalty} points for hint! The Engineer says:`,
      });
    } catch (error) {
      console.error("Error fetching NPC hint:", error);
      setHint("Sorry, I'm a bit stumped myself right now! Try your best.");
      // Do not show the penalty feedback if the hint fetch failed
      // setShowFeedback({type: "error", message: "Could not fetch hint."});
      // The hint state itself will show the error.
    } finally {
      setIsLoadingHint(false);
    }
  };

  const GameCompletionDisplay = () => (
    <div className="p-4 text-center bg-gray-800/70 rounded-lg shadow-xl backdrop-blur-sm">
      <IconTrophy />
      <h2 className="text-2xl font-bold text-yellow-400 mb-3">
        Challenge Complete!
      </h2>
      <div className="space-y-1 text-base mb-4">
        <p>
          Final Score:{" "}
          <span className="font-semibold text-green-400">{score}</span>
        </p>
        <p>
          Scenarios Resolved:{" "}
          <span className="font-semibold text-gray-200">
            {correctMatches} / {totalScenariosInitialCount}
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
        className="mt-3 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition text-base shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        onClick={() => resetGame(concepts, scenarios)}
      >
        Play Again With Same Content
      </button>
      <button
        className="mt-3 ml-3 px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        onClick={() => {
          setGameInitialized(false);
          resetGame(); // Full reset to clear concepts/scenarios for new upload
        }}
      >
        Load New Materials
      </button>
    </div>
  );

  // Main return JSX
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans text-sm">
      <header
        ref={headerRef}
        className="bg-gray-800/80 backdrop-blur-md p-3 border-b border-gray-700 sticky top-0 z-20 shadow-lg"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <IconAcademicCap />
              <h1 className="text-xl font-bold text-indigo-300">REQSIM</h1>
            </div>
            <div className="flex gap-2">
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
                  className="text-center p-2 bg-gray-700/70 rounded-md shadow min-w-[80px] transition-all hover:bg-gray-600/80"
                >
                  <div className="flex items-center justify-center">
                    {item.icon}
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-700/70 h-3 rounded-full overflow-hidden shadow-inner relative">
            <motion.div
              className="bg-green-500 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  totalScenariosInitialCount > 0
                    ? (correctMatches / totalScenariosInitialCount) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference pointer-events-none">
              {`${Math.round(
                totalScenariosInitialCount > 0
                  ? (correctMatches / totalScenariosInitialCount) * 100
                  : 0
              )}%`}
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <p>
              Scenarios Resolved: {correctMatches} /{" "}
              {totalScenariosInitialCount}
            </p>
            <p>
              Current Scenario:{" "}
              {index + 1 > totalScenariosInitialCount && !currentScenario
                ? totalScenariosInitialCount
                : Math.min(index + 1, totalScenariosInitialCount)}{" "}
              / {totalScenariosInitialCount}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-md shadow-xl flex items-center ${
              showFeedback.type === "success"
                ? "bg-green-600/90 backdrop-blur-sm"
                : showFeedback.type === "error"
                ? "bg-red-600/90 backdrop-blur-sm"
                : "bg-blue-600/90 backdrop-blur-sm"
            }`}
          >
            {showFeedback.type === "success" && <IconCheckCircle />}
            {showFeedback.type === "error" && <IconXCircle />}
            {showFeedback.type === "info" && <IconInformationCircle />}
            <p className="text-white text-sm font-medium ml-2">
              {showFeedback.message}
            </p>
          </motion.div>
        )}

        <div className="lg:col-span-1 space-y-4">
          <div
            className={`bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-dashed border-blue-500/70 shadow-md transition-all ${
              isLoadingMaterials
                ? "cursor-default opacity-70"
                : "cursor-pointer hover:border-blue-400"
            }`}
            onClick={() => !isLoadingMaterials && fileInputRef.current?.click()}
            onDrop={handleMaterialDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple={false}
              className="hidden"
              disabled={isLoadingMaterials}
              accept=".txt,.pdf,.pptx,.ppt" // Allow multiple types
            />
            <h2 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
              <IconFolder /> Course Materials
            </h2>
            <div className="min-h-[80px] p-3 bg-gray-700/40 rounded-md flex flex-col items-center justify-center transition-all">
              {isLoadingMaterials ? (
                <div className="flex flex-col items-center">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-300 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-blue-300 text-center text-xs">
                    {uploadStatus}
                  </p>
                </div>
              ) : (
                <p className="text-blue-300 text-center text-xs">
                  {uploadStatus}
                </p>
              )}
            </div>
            {materials.length > 0 && !isLoadingMaterials && (
              <div className="mt-2 space-y-1.5">
                <h3 className="text-xs font-medium text-gray-400">Loaded:</h3>
                {materials.map((file, i) => (
                  <div
                    key={i}
                    className="truncate px-2 py-1.5 bg-gray-700/60 rounded-md flex items-center text-xs shadow-sm"
                  >
                    <IconDocument />
                    <span className="ml-1 flex-grow truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {gameInitialized ? (
            <>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/70 shadow-md">
                <h2 className="text-lg font-semibold mb-2 flex items-center text-indigo-300">
                  <IconClipboardList /> Current Scenario
                </h2>
                {currentScenario ? (
                  <motion.div
                    key={
                      currentScenario.id +
                      "-" +
                      resolvedConceptsForCurrentScenario.size
                    }
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-700/80 rounded-md cursor-grab shadow border border-gray-600/70 hover:shadow-indigo-500/30"
                    draggable
                    onDragStart={(e) =>
                      handleScenarioDragStart(e, currentScenario)
                    }
                    onDragEnd={handleScenarioDragEnd}
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    }}
                    whileTap={{ scale: 0.99, cursor: "grabbing" }}
                  >
                    <div className="flex items-start mb-1.5">
                      <IconDragHandle />
                      <p className="text-sm font-medium text-gray-100 leading-normal">
                        {currentScenario.text}
                      </p>
                    </div>
                    <div className="mt-2 text-xs text-indigo-300">
                      Relates to: {currentScenario.conceptIds.length} concept(s)
                    </div>
                    {currentScenario.conceptIds.length > 1 && (
                      <div className="text-xs text-green-400 mt-0.5">
                        Found: {resolvedConceptsForCurrentScenario.size} /{" "}
                        {currentScenario.conceptIds.length}
                      </div>
                    )}
                    <div className="mt-1.5 text-xs text-blue-300 flex items-center justify-between">
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
                              className={`w-4 h-4 ${
                                i < currentScenario.difficulty
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              }`}
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-600/50">
                      <CountdownTimer
                        key={`timer-${currentScenario.id}-${index}-${resolvedConceptsForCurrentScenario.size}`}
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
                <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-green-500/50 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <IconUserCircle />
                      <div>
                        <h2 className="text-lg font-semibold text-green-300">
                          Requirement Engineer
                        </h2>
                        <p className="text-xs text-gray-400">
                          Available for consultation
                        </p>
                      </div>
                    </div>
                    <div className="w-16 h-16 flex-shrink-0">
                      <EmotionFace
                        emotion={["happy", "neutral", "angry"][npcMood]}
                      />
                    </div>
                  </div>
                  <button
                    onClick={getNpcHint}
                    disabled={
                      !currentScenario ||
                      isLoadingHint ||
                      (currentScenario &&
                        resolvedConceptsForCurrentScenario.size ===
                          currentScenario.conceptIds.length)
                    }
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white text-sm font-semibold p-2.5 rounded-md transition-colors flex items-center justify-center shadow hover:shadow-md"
                  >
                    {isLoadingHint ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <IconLightBulb />
                    )}
                    {isLoadingHint
                      ? "The Engineer is Pondering..."
                      : "Ask for Hint (-10pts)"}
                  </button>
                  {hint && !isLoadingHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-3 p-2.5 bg-gray-700/80 rounded-md text-xs border-l-4 border-yellow-400 shadow-sm"
                    >
                      {showFeedback &&
                      showFeedback.type === "info" &&
                      showFeedback.message.includes("Engineer says") ? null : (
                        <p className="text-yellow-300 flex items-start mb-0.5">
                          <IconInformationCircle />
                          <span className="font-semibold ml-1">Hint:</span>
                        </p>
                      )}
                      <p
                        className={`pl-${
                          showFeedback &&
                          showFeedback.type === "info" &&
                          showFeedback.message.includes("Engineer says")
                            ? "0"
                            : "7"
                        } text-gray-300`}
                      >
                        {hint}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="lg:col-span-4 flex items-center justify-center min-h-[400px] bg-gray-800/50 rounded-lg">
              <p className="text-xl text-center text-gray-400">
                {isLoadingMaterials
                  ? "Generating your REQSIM experience..."
                  : "Upload course materials (.txt, .pdf, .pptx) to begin REQSIM!"}
              </p>
            </div>
          )}
        </div>

        {gameInitialized && concepts.length > 0 ? (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <motion.div
                key={concept.id}
                onDrop={(e) => handleConceptDrop(e, concept)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setHighlightedConceptId(concept.id);
                }}
                onDragLeave={() => setHighlightedConceptId(null)}
                className={`p-3.5 bg-gray-800/70 backdrop-blur-sm rounded-lg border-2 transition-all relative shadow-md hover:shadow-lg
                    ${
                      highlightedConceptId === concept.id
                        ? "border-yellow-400 ring-2 ring-yellow-300/70 bg-gray-700/70 transform scale-105 z-10"
                        : concept.emotion === "happy"
                        ? "border-green-500/70"
                        : concept.emotion === "sad"
                        ? "border-red-500/70"
                        : "border-gray-700/50"
                    }`}
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
                }}
                layout
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-bold text-indigo-200">
                      {concept.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 italic leading-snug">
                      {concept.definition}
                    </p>
                  </div>
                  <div className="w-14 h-14 flex-shrink-0 -mt-1 -mr-1">
                    <EmotionFace emotion={concept.emotion} />
                  </div>
                </div>

                {concept.scenarios.length > 0 && (
                  <div className="mt-2 border-t border-gray-700/50 pt-2">
                    <h4 className="text-xs font-semibold mb-1.5 text-green-400 flex items-center">
                      <IconCheckCircle className="w-4 h-4 mr-1" /> Related
                      Scenarios ({concept.scenarios.length}):
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {concept.scenarios.map((s, idx) => (
                        <motion.div
                          key={`${s.id}-${idx}-${concept.id}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs bg-gray-700/50 p-1.5 rounded border-l-4 border-green-600/80 shadow-sm"
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
        ) : gameInitialized && concepts.length === 0 && !isLoadingMaterials ? (
          <div className="lg:col-span-3 flex items-center justify-center min-h-[400px]">
            <p className="text-xl text-gray-500 text-center">
              No concepts or scenarios were generated. <br />
              Please try a different file or check the material content.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
