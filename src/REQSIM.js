// src/REQSIM.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmotionFace from "./EmotionFace";
import CountdownTimer from "./CountdownTimer";

// --- SVG Icons (Keep all your icon definitions as they were in the last full version) ---
const IconAcademicCap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 mr-2 text-indigo-400"
  >
    {" "}
    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />{" "}
    <path
      fillRule="evenodd"
      d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />{" "}
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
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />{" "}
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
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.519 13.007a3 3 0 01-2.598 4.5H4.48a3 3 0 01-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />{" "}
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
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071 1.05l.002.002A17.106 17.106 0 0112 12c0 .206.01.41.029.613l-.001.002a.75.75 0 00.55.696l.002.001a17.604 17.604 0 003.635 1.352l.003.001.004.001a1.5 1.5 0 01.752 2.159.75.75 0 00.38.262c.018.005.036.009.054.013l.002.001a7.53 7.53 0 012.345 1.075.75.75 0 001.002-.21l.002-.002a1.13 1.13 0 011.437-1.612.75.75 0 00.429-1.019l-.001-.004a13.403 13.403 0 00-2.353-4.656l-.003-.003a.75.75 0 00-.656-.36l-.004-.001a1.503 1.503 0 01-1.076-.673.75.75 0 00-.64-.403h-.002q-.003 0-.005.001a6.68 6.68 0 00-1.973-.318l-.002-.002A13.23 13.23 0 0112 3.75c0-.53.045-1.05.132-1.561l.002-.003zM9.75 12c0-.032.002-.063.005-.094A12.923 12.923 0 0012 11.25c.282 0 .56.018.836.053l.001.001.003.001.004.001a.75.75 0 00.68-.535l.002-.002A11.4 11.4 0 0015 9a.75.75 0 00-1.5 0c0 .075-.004.149-.01.222l.002-.002a.75.75 0 00.012 1.273l-.001.002a11.435 11.435 0 00-2.992 1.254l-.003.001a.75.75 0 00-.271 1.017l.002.003a7.433 7.433 0 01.789 4.057.75.75 0 00.659.737l.003.001a7.5 7.5 0 004.422-.323.75.75 0 00.536-.835l-.001-.002a1.506 1.506 0 01.814-1.645.75.75 0 00.378-.818l-.001-.003a5.92 5.92 0 00-1.034-3.213.75.75 0 00-.848-.413A17.683 17.683 0 0112 15.75c-1.598 0-3.137-.205-4.566-.587a.75.75 0 01-.519-.868l.002-.004a18.45 18.45 0 002.823-6.667.75.75 0 00-.608-.86l-.002-.001a13.021 13.021 0 00-2.426-1.043.75.75 0 00-.51.066L6 6.375a.75.75 0 00-.375.65V12c0 .414.336.75.75.75h3.375z"
      clipRule="evenodd"
    />{" "}
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
    <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 9.75A3 3 0 014.5 6.75h4.636a1.5 1.5 0 011.214.61L11.79 9h7.71a3 3 0 013 3v1.5a.75.75 0 01-1.5 0V12a1.5 1.5 0 00-1.5-1.5h-7.928a1.5 1.5 0 01-1.214-.61L8.202 7.5H4.5a1.5 1.5 0 00-1.5 1.5V18a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-4.5a.75.75 0 011.5 0V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.75z" />{" "}
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
    <path
      fillRule="evenodd"
      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
      clipRule="evenodd"
    />{" "}
    <path d="M12.971 1.816A5.23 5.23 0 0114.25 1.5c.463 0 .907.067 1.312.191l.006.002a6.71 6.71 0 001.414 5.44V9A1.5 1.5 0 0015.5 7.5h-1.875a3.375 3.375 0 01-3.375-3.375V2.25l-.009-.009a6.75 6.75 0 00-1.993-2.018.75.75 0 00-1.01.048Z" />{" "}
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
    <path
      fillRule="evenodd"
      d="M10.5 3A2.5 2.5 0 008 5.5V6h8V5.5A2.5 2.5 0 0013.5 3h-3zm-2.5 9a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm.75 2.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />{" "}
    <path d="M4.5 6.75A.75.75 0 005.25 6H6v-.5A3.5 3.5 0 019.5 2h5A3.5 3.5 0 0118 5.5V6h.75a.75.75 0 00.75-.75V5.25a3 3 0 00-3-3h-1.5a.75.75 0 00-.75.75V3A1.5 1.5 0 0013.5 1.5h-3A1.5 1.5 0 009 3v.75a.75.75 0 00-.75.75V6H3.75A.75.75 0 003 6.75v11.5a3 3 0 003 3h12a3 3 0 003-3V6.75a.75.75 0 00-.75-.75H18v3.75a.75.75 0 01-1.5 0V6.75H6v12a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V6.75H6V6.75z" />{" "}
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
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />{" "}
  </svg>
);
const IconUserCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2 text-green-400"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconLightBulb = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5 mr-1.5"
  >
    {" "}
    <path d="M12 2.25a.75.75 0 01.75.75v2.033A3.004 3.004 0 0115.75 8c0 .749-.22 1.436-.607 2.007a.75.75 0 01-1.22-.7C13.94 8.802 14.25 8.41 14.25 8a1.5 1.5 0 00-3 0c0 .41.31.702.327.707a.75.75 0 01-1.22.701A3.002 3.002 0 019.75 8c0-1.03.538-1.94.1332-2.542V3a.75.75 0 01.75-.75zM8.25 9.75A2.25 2.25 0 006 12v3A2.25 2.25 0 008.25 17.25h7.5A2.25 2.25 0 0018 15v-3A2.25 2.25 0 0015.75 9.75h-7.5zM12 21a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0v1.5A.75.75 0 0112 21z" />{" "}
  </svg>
);
const IconInformationCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2 flex-shrink-0"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.04-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06l-3.103 3.104-1.497-1.497a.75.75 0 00-1.06 1.06l2.027 2.027a.75.75 0 001.06 0l3.64-3.64z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconXCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-2"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm10.28-2.56a.75.75 0 00-1.06 1.06L12.94 12l-1.47 1.47a.75.75 0 101.06 1.06L14.47 12l1.47-1.47a.75.75 0 00-1.06-1.06L12 12.94l-1.47-1.47z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconTrophy = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-14 w-14 mx-auto text-yellow-400 mb-3"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M3.75 3.75A.75.75 0 003 4.5v15A.75.75 0 003.75 21h16.5a.75.75 0 00.75-.75V13.643c0-.421-.174-.832-.485-1.133L15.864 8.24a.75.75 0 00-1.06 0l-1.015 1.015a.75.75 0 01-1.06 0l-1.126-1.125a3 3 0 00-4.242 0L3.08 12.388a.75.75 0 01-1.06-1.061l4.287-4.287a4.5 4.5 0 016.364 0l1.125 1.125a.75.75 0 001.06 0l1.015-1.015a.75.75 0 011.06 0l4.636 4.636a1.5 1.5 0 01.485 1.133V19.5A.75.75 0 0021 18.75v-7.683a.75.75 0 00-.22-.53L16.03 5.79a4.5 4.5 0 00-6.363 0L7.91 7.547a.75.75 0 01-1.06-1.06L11.137 2.2a3 3 0 014.242 0l4.091 4.09a3 3 0 01.83 2.122V19.5a1.5 1.5 0 01-1.5 1.5H3.75A1.5 1.5 0 012.25 19.5v-15A1.5 1.5 0 013.75 2.25h2.733a.75.75 0 000-1.5H3.75zM9 8.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconPlusCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5 text-sky-400"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75 9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconBeaker = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5 mr-1.5 text-teal-400"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M10.494 2.278c-.831-1.111-2.683-1.111-3.514 0C6.393 3.054 6 3.932 6 4.846v5.504a2.626 2.626 0 00.388 1.346l2.08 3.121A2.626 2.626 0 0010.5 15.75h3a2.625 2.625 0 002.032-.928l2.08-3.121a2.626 2.626 0 00.388-1.346V4.846c0-.913-.393-1.792-.98-2.567zM9.313 8.176a.75.75 0 011.06-1.06l1.048 1.048 1.048-1.048a.75.75 0 111.06 1.06L12.53 9.237l1.048 1.048a.75.75 0 11-1.06 1.06L11.47 10.297l-1.048 1.048a.75.75 0 01-1.06-1.06L10.413 9.237l-1.047-1.048a.75.75 0 01-.053-.013z"
      clipRule="evenodd"
    />{" "}
    <path d="M6 19.5a2.25 2.25 0 012.25-2.25h7.5a2.25 2.25 0 012.25 2.25V21a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-1.5z" />{" "}
  </svg>
);
const IconDownload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-4 h-4 mr-1.5"
  >
    {" "}
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.72a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l2.75-2.75a.75.75 0 10-1.06-1.06L10.75 11.34V6.75z"
      clipRule="evenodd"
    />{" "}
  </svg>
);
const IconXMark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    {" "}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />{" "}
  </svg>
);
// --- End SVG Icons ---

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://ishanvimukthi.pythonanywhere.com";

export default function REQSIM() {
  const [concepts, setConcepts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [originalGeneratedScenarios, setOriginalGeneratedScenarios] = useState(
    []
  );
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

  const [mainMaterialFile, setMainMaterialFile] = useState(null);
  const [mainMaterialUploadStatus, setMainMaterialUploadStatus] = useState(
    "Click or Drag & Drop Main Material File..."
  );

  const [uploadStatus, setUploadStatus] = useState(
    "Upload materials and/or provide context to begin!"
  );
  const [materialsForDisplay, setMaterialsForDisplay] = useState([]);

  const [highlightedConceptId, setHighlightedConceptId] = useState(null);
  const [index, setIndex] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [totalScenariosInitialCount, setTotalScenariosInitialCount] =
    useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const headerRef = useRef();
  const mainMaterialInputRef = useRef(null);
  const domainContextFileInputRef = useRef(null);
  const [timePaused, setTimePaused] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [gameInitialized, setGameInitialized] = useState(false);
  const [isCrossDomain, setIsCrossDomain] = useState(false);
  const [gameMode, setGameMode] = useState("single");
  const [groupName, setGroupName] = useState("");

  const [domainContextFile, setDomainContextFile] = useState(null);
  const [domainContextText, setDomainContextText] = useState("");
  const [domainContextFileStatus, setDomainContextFileStatus] = useState(
    "Click or Drag & Drop Domain Context File (Optional)"
  );

  const [gameInteractionsLog, setGameInteractionsLog] = useState([]);
  const [dragStartTime, setDragStartTime] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (streakCount > maxStreak) {
      setMaxStreak(streakCount);
    }
  }, [streakCount, maxStreak]);

  useEffect(() => {
    if (isCrossDomain) {
      setHint("");
      setNpcMood(1);
    }
  }, [isCrossDomain]);

  const logInteraction = (actionType, details = {}) => {
    setGameInteractionsLog((prevLog) => [
      ...prevLog,
      {
        timestamp: new Date().toISOString(),
        actionType,
        scenarioId: currentScenario ? currentScenario.id : null,
        scenarioText: currentScenario ? currentScenario.text : null,
        ...details,
        currentScore: score,
        currentErrors: errors,
        currentStreak: streakCount,
      },
    ]);
  };

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
        startTime: Date.now(),
      };
      setCurrentScenario(nextScenario);
      setResolvedConceptsForCurrentScenario(new Set());
      logInteraction("SCENARIO_PRESENTED", {
        scenarioId: nextScenario.id,
        text: nextScenario.text,
        conceptIds: nextScenario.conceptIds,
      });
    } else {
      setCurrentScenario(null);
      if (gameInitialized && concepts.length > 0) {
        logInteraction("GAME_COMPLETED_ALL_SCENARIOS");
        setShowReportModal(true);
      }
    }
  };

  const resetGame = (newConcepts = [], newScenarios = []) => {
    setConcepts(
      newConcepts.map((c) => ({ ...c, scenarios: [], emotion: "neutral" }))
    );
    setScenarios(newScenarios);
    setOriginalGeneratedScenarios(JSON.parse(JSON.stringify(newScenarios)));

    setupNewScenario(newScenarios);
    setScore(0);
    setErrors(0);
    setNpcMood(1);
    setHint("");
    setHighlightedConceptId(null);
    setIndex(0);
    setCorrectMatches(0);
    setTotalScenariosInitialCount(newScenarios.length);
    setTimePaused(false);
    setStreakCount(0);
    setMaxStreak(0);
    setShowFeedback(null);
    setGameInteractionsLog([]);
    setShowReportModal(false);

    if (newConcepts.length > 0 || newScenarios.length > 0) {
      setGameInitialized(true);
      let statusMsg = "Game ready! ";
      const loadedInputs = [];
      if (mainMaterialFile)
        loadedInputs.push(`'${mainMaterialFile.name}' (Main)`);
      if (domainContextFile)
        loadedInputs.push(`'${domainContextFile.name}' (Domain File)`);
      else if (domainContextText.trim() && !domainContextFile)
        loadedInputs.push("Typed Domain Context");

      if (loadedInputs.length > 0) {
        statusMsg = `Using: ${loadedInputs.join(" & ")}. Game ready!`;
      } else if (isCrossDomain) {
        statusMsg = "Ready for cross-domain content generation.";
      } else {
        statusMsg = "Game ready with generated content.";
      }
      if (!isLoadingMaterials) setUploadStatus(statusMsg.trim());
    } else {
      setGameInitialized(false);
      setUploadStatus(
        "Upload materials and/or provide context to begin REQSIM!"
      );
      setMaterialsForDisplay([]);
    }
  };

  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMainMaterialFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMainMaterialFile(files[0]);
      setMainMaterialUploadStatus(`Selected: ${files[0].name}`);
    } else {
      setMainMaterialFile(null);
      setMainMaterialUploadStatus("Click or Drag & Drop Main Material File...");
    }
    e.target.value = null;
  };

  const handleDomainContextFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setDomainContextFile(files[0]);
      setDomainContextText("");
      setDomainContextFileStatus(`Context File: ${files[0].name}`);
    } else {
      setDomainContextFile(null);
      setDomainContextFileStatus(
        "Click or Drag & Drop Domain Context File (Optional)"
      );
    }
    e.target.value = null;
  };

  const triggerContentGeneration = async () => {
    if (
      !mainMaterialFile &&
      !isCrossDomain &&
      !domainContextText.trim() &&
      !domainContextFile
    ) {
      setShowFeedback({
        type: "error",
        message:
          "Please provide a main course material file, or specify domain context if using cross-domain mode.",
      });
      setTimeout(() => setShowFeedback(null), 4000);
      return;
    }
    if (
      isCrossDomain &&
      !mainMaterialFile &&
      !domainContextFile &&
      !domainContextText.trim()
    ) {
      setShowFeedback({
        type: "error",
        message:
          "For cross-domain mode, please provide either main material, a domain context file, or type domain context text.",
      });
      setTimeout(() => setShowFeedback(null), 4000);
      return;
    }

    setIsLoadingMaterials(true);
    setUploadStatus(`Processing inputs... This may take a moment.`);
    setTimePaused(true);
    setGameInitialized(false);
    setGameInteractionsLog([]);
    logInteraction("CONTENT_GENERATION_START");

    const formData = new FormData();
    if (mainMaterialFile) {
      formData.append("course_material_file", mainMaterialFile);
    }
    formData.append("isCrossDomain", isCrossDomain.toString());

    if (domainContextText.trim()) {
      formData.append("domain_context_text", domainContextText.trim());
    } else if (domainContextFile) {
      formData.append("domain_context_file", domainContextFile);
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reqsim/process-materials`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || `HTTP error! status: ${response.status}`
        );
      }

      if (
        !responseData.concepts ||
        !responseData.scenarios ||
        !Array.isArray(responseData.concepts) ||
        !Array.isArray(responseData.scenarios)
      ) {
        throw new Error("Received invalid data structure from server.");
      }
      if (
        responseData.concepts.length === 0 ||
        responseData.scenarios.length === 0
      ) {
        const message =
          responseData.error ||
          "AI could not generate relevant content. Try different/more detailed material, or ensure file has readable text.";
        setShowFeedback({ type: "info", message });
        resetGame([], []);
        setUploadStatus(message);
        setMaterialsForDisplay([]);
        logInteraction("CONTENT_GENERATION_FAILED", { reason: message });
      } else {
        const validatedScenarios = responseData.scenarios.map((s) => ({
          ...s,
          conceptIds: Array.isArray(s.conceptIds)
            ? s.conceptIds
            : s.conceptIds
            ? [s.conceptIds]
            : [],
        }));

        let currentLoadedFilesInfo = [];
        if (mainMaterialFile)
          currentLoadedFilesInfo.push({
            name: mainMaterialFile.name,
            type: "Main Material",
          });
        if (domainContextFile)
          currentLoadedFilesInfo.push({
            name: domainContextFile.name,
            type: "Domain Context File",
          });
        else if (domainContextText.trim())
          currentLoadedFilesInfo.push({
            name: "Typed Domain Context",
            type: "Domain Context Text",
          });
        setMaterialsForDisplay(currentLoadedFilesInfo);

        resetGame(responseData.concepts, validatedScenarios);
        logInteraction("CONTENT_GENERATION_SUCCESS", {
          conceptsCount: responseData.concepts.length,
          scenariosCount: validatedScenarios.length,
        });
      }
    } catch (error) {
      console.error("Error processing materials:", error);
      setUploadStatus("Error processing materials. Please try again.");
      setShowFeedback({
        type: "error",
        message: `Failed to load game data: ${error.message}. Check console for details.`,
      });
      setTimeout(() => setShowFeedback(null), 5000);
      logInteraction("CONTENT_GENERATION_ERROR", { error: error.message });
      resetGame();
    } finally {
      setIsLoadingMaterials(false);
      setTimePaused(false);
    }
  };

  const handleMainMaterialDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setMainMaterialFile(files[0]);
      setMainMaterialUploadStatus(`Dropped: ${files[0].name}`);
    }
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-gray-700/50"
    );
  };
  const handleMainDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoadingMaterials)
      e.currentTarget.classList.add(
        "ring-2",
        "ring-blue-500",
        "bg-gray-700/50"
      );
  };
  const handleMainDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-gray-700/50"
    );
  };

  const handleDomainContextFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDomainContextFile(files[0]);
      setDomainContextText("");
      setDomainContextFileStatus(`Context File Dropped: ${files[0].name}`);
    }
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-sky-500",
      "bg-gray-700/50"
    );
  };
  const handleDomainContextDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoadingMaterials)
      e.currentTarget.classList.add("ring-2", "ring-sky-500", "bg-gray-700/50");
  };
  const handleDomainContextDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-sky-500",
      "bg-gray-700/50"
    );
  };

  const handleScenarioDragStart = (e, scenario) => {
    e.dataTransfer.setData("application/json", JSON.stringify(scenario));
    setDragStartTime(Date.now());
    logInteraction("DRAG_START", { scenarioId: scenario.id });
  };
  const handleScenarioDragEnd = () => {
    setHighlightedConceptId(null);
  };

  const handleConceptDrop = (e, targetConcept) => {
    e.preventDefault();
    if (!currentScenario) return;

    const scenarioToMatch = currentScenario;
    const dropTime = Date.now();
    const latency = dragStartTime ? dropTime - dragStartTime : null;
    setDragStartTime(null);

    setHighlightedConceptId(null);

    const conceptIdsArray = Array.isArray(scenarioToMatch.conceptIds)
      ? scenarioToMatch.conceptIds
      : scenarioToMatch.conceptIds
      ? [scenarioToMatch.conceptIds]
      : [];
    const isCorrectConceptForScenario = conceptIdsArray.includes(
      targetConcept.id
    );
    const isAlreadyResolvedForThisScenario =
      resolvedConceptsForCurrentScenario.has(targetConcept.id);

    const interactionDetails = {
      scenarioId: scenarioToMatch.id,
      droppedConceptId: targetConcept.id,
      droppedConceptName: targetConcept.name,
      expectedConceptIdsInScenario: conceptIdsArray,
      isCorrectDrop:
        isCorrectConceptForScenario && !isAlreadyResolvedForThisScenario,
      isNewPartResolved:
        isCorrectConceptForScenario && !isAlreadyResolvedForThisScenario,
      latencyMs: latency,
      resolvedPartsBeforeDrop: Array.from(resolvedConceptsForCurrentScenario),
    };
    logInteraction("DROP_ATTEMPT", interactionDetails);

    if (isCorrectConceptForScenario && !isAlreadyResolvedForThisScenario) {
      const newResolvedParts = new Set(resolvedConceptsForCurrentScenario).add(
        targetConcept.id
      );
      setResolvedConceptsForCurrentScenario(newResolvedParts);

      const pointsPerPart = Math.max(
        5,
        Math.round(
          (10 * scenarioToMatch.difficulty) / (conceptIdsArray.length || 1)
        )
      );
      setScore((s) => s + pointsPerPart);

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
        const totalPointsForScenario = pointsPerPart * conceptIdsArray.length;

        setShowFeedback({
          type: "success",
          message: `Scenario complete! All ${
            conceptIdsArray.length
          } concepts found. Total +${totalPointsForScenario} pts. ${
            streakCount + 1 > 1 ? `Streak: ${streakCount + 1}` : ""
          }`,
        });
        setNpcMood(0);
        logInteraction("SCENARIO_FULLY_RESOLVED", {
          scenarioId: scenarioToMatch.id,
          timeToResolve:
            dropTime - (currentScenario.startTime || dragStartTime || dropTime),
        });

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
                  : [
                      ...c.scenarios,
                      { ...scenarioToMatch, status: "resolved" },
                    ],
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
          message: `Concept '${targetConcept.name}' found! +${pointsPerPart} pts. (${newResolvedParts.size}/${conceptIdsArray.length})`,
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

    if (
      !(
        isCorrectConceptForScenario &&
        !isAlreadyResolvedForThisScenario &&
        resolvedConceptsForCurrentScenario.size !== conceptIdsArray.length
      )
    ) {
      setHint("");
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (
        !isCorrectConceptForScenario ||
        (isCorrectConceptForScenario && isAlreadyResolvedForThisScenario)
      ) {
        setConcepts((prev) =>
          prev.map((c) => {
            if (c.id === targetConcept.id) {
              const isHappyFromOtherScenarios = c.scenarios.some(
                (s) =>
                  s.id !== scenarioToMatch.id &&
                  s.conceptIds &&
                  s.conceptIds.includes(c.id)
              );
              return isHappyFromOtherScenarios ||
                (resolvedConceptsForCurrentScenario.has(c.id) &&
                  scenarioToMatch.conceptIds.includes(c.id))
                ? c
                : { ...c, emotion: "neutral" };
            }
            return c;
          })
        );
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    if (!currentScenario) return;
    const conceptIdsArray = Array.isArray(currentScenario.conceptIds)
      ? currentScenario.conceptIds
      : currentScenario.conceptIds
      ? [currentScenario.conceptIds]
      : [];
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
    logInteraction("SCENARIO_TIMEOUT", {
      scenarioId: currentScenario.id,
      unresolvedConceptIds: conceptIdsArray.filter(
        (id) => !resolvedConceptsForCurrentScenario.has(id)
      ),
    });

    setIndex((i) => i + 1);

    const remaining = scenarios.filter((s) => s.id !== currentScenario.id);
    setScenarios(remaining);
    setupNewScenario(remaining);

    setTimeout(() => setShowFeedback(null), 3000);
  };

  const getNpcHint = async () => {
    if (!currentScenario || isLoadingHint || isCrossDomain) return;

    setIsLoadingHint(true);
    const hintPenalty = 10;
    setScore((s) => Math.max(0, s - hintPenalty));
    setHint("The Requirement Engineer is pondering...");
    setNpcMood(1);
    logInteraction("HINT_REQUESTED", {
      scenarioId: currentScenario.id,
      unresolvedConceptIds: currentScenario.conceptIds.filter(
        (id) => !resolvedConceptsForCurrentScenario.has(id)
      ),
    });

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
      setHint("Sorry, I'm a bit stumped right now! Try your best.");
      setShowFeedback(null);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleAutoCompleteGame = () => {
    if (
      !gameInitialized ||
      !originalGeneratedScenarios.length ||
      !concepts.length
    ) {
      setShowFeedback({
        type: "info",
        message: "No game active or content loaded to auto-complete.",
      });
      setTimeout(() => setShowFeedback(null), 3000);
      return;
    }

    let tempScore = 0; // Auto-complete starts score from 0 for this "run"
    let tempCorrectMatches = 0;
    let tempStreak = 0;
    let tempMaxStreak = 0; // Calculate max streak for this auto-run
    let updatedConceptsState = JSON.parse(
      JSON.stringify(
        concepts.map((c) => ({ ...c, scenarios: [], emotion: "neutral" }))
      )
    );
    let newInteractionsLog = [];

    // Use originalGeneratedScenarios for auto-completion to ensure all scenarios are processed
    originalGeneratedScenarios.forEach((scenario, scIdx) => {
      const scenarioConceptIds = Array.isArray(scenario.conceptIds)
        ? scenario.conceptIds
        : scenario.conceptIds
        ? [scenario.conceptIds]
        : [];
      let pointsForThisScenario = 0;
      let currentAutoScenarioResolvedParts = new Set();

      newInteractionsLog.push({
        timestamp: new Date().toISOString(),
        actionType: "AUTO_SCENARIO_PRESENTED",
        scenarioId: scenario.id,
        text: scenario.text,
        conceptIds: scenario.conceptIds,
        currentScore: tempScore,
        currentErrors: 0,
        currentStreak: tempStreak,
      });

      scenarioConceptIds.forEach((correctConceptId) => {
        const targetConcept = updatedConceptsState.find(
          (c) => c.id === correctConceptId
        );
        if (
          targetConcept &&
          !currentAutoScenarioResolvedParts.has(correctConceptId)
        ) {
          currentAutoScenarioResolvedParts.add(correctConceptId);
          const pointsPerPart = Math.max(
            5,
            Math.round(
              (10 * scenario.difficulty) / (scenarioConceptIds.length || 1)
            )
          );
          pointsForThisScenario += pointsPerPart;

          const conceptIndex = updatedConceptsState.findIndex(
            (c) => c.id === targetConcept.id
          );
          if (conceptIndex !== -1) {
            const scenarioExists = updatedConceptsState[
              conceptIndex
            ].scenarios.find((s) => s.id === scenario.id);
            if (!scenarioExists) {
              updatedConceptsState[conceptIndex].scenarios.push({
                ...scenario,
                status: "auto-resolved",
              });
            }
            updatedConceptsState[conceptIndex].emotion = "happy";
          }
          newInteractionsLog.push({
            timestamp: new Date().toISOString(),
            actionType: "AUTO_DROP_CORRECT",
            scenarioId: scenario.id,
            droppedConceptId: targetConcept.id,
            droppedConceptName: targetConcept.name,
            expectedConceptIdsInScenario: scenarioConceptIds,
            isCorrectDrop: true,
            isNewPartResolved: true,
            latencyMs: 10,
            resolvedPartsBeforeDrop: Array.from(
              new Set([...currentAutoScenarioResolvedParts]).delete(
                correctConceptId
              )
            ),
            currentScore: tempScore + pointsForThisScenario,
          });
        }
      });

      tempScore += pointsForThisScenario;
      tempCorrectMatches++;
      tempStreak++;
      if (tempStreak > tempMaxStreak) tempMaxStreak = tempStreak;

      newInteractionsLog.push({
        timestamp: new Date().toISOString(),
        actionType: "AUTO_SCENARIO_RESOLVED",
        scenarioId: scenario.id,
        currentScore: tempScore,
      });
    });

    setScore(tempScore);
    setCorrectMatches(tempCorrectMatches);
    setStreakCount(tempStreak);
    setMaxStreak(tempMaxStreak); // Set the max streak achieved during auto-completion
    setErrors(0); // Assuming auto-complete makes no errors
    setNpcMood(0);
    setConcepts(updatedConceptsState);
    setScenarios([]);
    setCurrentScenario(null); // This should trigger the report modal via setupNewScenario
    setIndex(totalScenariosInitialCount);
    setResolvedConceptsForCurrentScenario(new Set());
    setGameInteractionsLog(newInteractionsLog);

    setShowFeedback({
      type: "success",
      message: "Game auto-completed for testing!",
    });
    setTimeout(() => setShowFeedback(null), 2000);
    // Explicitly show modal after state updates for auto-completion
    // Note: setCurrentScenario(null) in setupNewScenario will also try to set this.
    // This direct call ensures it happens even if effect timings are tricky.
    // However, it might lead to it being called twice. Better to rely on the game end logic.
    // The call to setupNewScenario([]) after setScenarios([]) should handle setting currentScenario to null.
  };

  // --- GameReportModal Component ---
  const GameReportModal = ({
    isOpen,
    onClose,
    gameStats,
    concepts: gameConcepts,
    originalScenarios,
    interactionsLog,
  }) => {
    if (!isOpen) return null;

    const {
      score,
      errors,
      maxStreak,
      correctMatches,
      totalScenariosInitialCount,
      gameMode,
      groupName,
      isCrossDomain: reportIsCrossDomain,
    } = gameStats;

    const dropAttempts = interactionsLog.filter(
      (log) =>
        log.actionType === "DROP_ATTEMPT" ||
        log.actionType === "AUTO_DROP_CORRECT"
    );
    const totalDrops = dropAttempts.length;

    const correctNewPartDrops = dropAttempts.filter(
      (log) => log.isCorrectDrop && log.isNewPartResolved
    ).length;
    const attemptsToResolveNewPart = dropAttempts.filter(
      (log) =>
        !log.resolvedPartsBeforeDrop ||
        !log.resolvedPartsBeforeDrop.includes(log.droppedConceptId) ||
        !log.isCorrectDrop
    ).length;
    const overallDropAccuracy =
      attemptsToResolveNewPart > 0
        ? (correctNewPartDrops / attemptsToResolveNewPart) * 100
        : 0;

    const validLatencies = dropAttempts
      .filter(
        (log) =>
          log.latencyMs !== null &&
          log.isCorrectDrop &&
          log.isNewPartResolved &&
          log.actionType === "DROP_ATTEMPT"
      )
      .map((log) => log.latencyMs);
    const avgLatency =
      validLatencies.length > 0
        ? (
            validLatencies.reduce((sum, l) => sum + l, 0) /
            validLatencies.length /
            1000
          ).toFixed(2)
        : "N/A";

    const conceptPerformance = gameConcepts.map((concept) => {
      const dropsOnThisConcept = dropAttempts.filter(
        (log) => log.droppedConceptId === concept.id
      );
      const correctlyAssociated = dropsOnThisConcept.filter(
        (log) => log.isCorrectDrop && log.isNewPartResolved
      ).length;
      const incorrectlyDroppedOn = dropsOnThisConcept.filter(
        (log) => !log.isCorrectDrop
      ).length;

      let timesExpected = 0;
      (originalScenarios || []).forEach((s) => {
        const scenarioConceptIds = Array.isArray(s.conceptIds)
          ? s.conceptIds
          : s.conceptIds
          ? [s.conceptIds]
          : [];
        if (scenarioConceptIds.includes(concept.id)) timesExpected++;
      });

      return {
        ...concept,
        correctlyAssociated,
        incorrectlyDroppedOn,
        timesExpected,
        accuracyOnDrops:
          dropsOnThisConcept.length > 0
            ? (correctlyAssociated / dropsOnThisConcept.length) * 100
            : 0,
      };
    });

    const handleDownloadReport = () => {
      let reportContent = `REQSIM Game Report - ${new Date().toLocaleString()}\n\n`;
      reportContent += `Game Mode: ${
        gameMode === "multiplayer"
          ? `Group (${groupName || "Unnamed"})`
          : "Single Player"
      }\n`;
      reportContent += `Content Focus: ${
        reportIsCrossDomain ? "Cross-Domain" : "Requirements Engineering"
      }\n\n`;

      reportContent += "### Overall Performance:\n";
      reportContent += `----------------------\n`;
      reportContent += `Final Score: ${score}\n`;
      reportContent += `Scenarios Resolved: ${correctMatches} / ${totalScenariosInitialCount}\n`;
      reportContent += `Total Incorrect Drops (Errors): ${errors}\n`;
      reportContent += `Max Streak: ${maxStreak}\n`;
      reportContent += `Overall Drop Accuracy (on new parts): ${overallDropAccuracy.toFixed(
        1
      )}%\n`;
      reportContent += `Avg. Correct Decision Time (Manual): ${avgLatency}s\n\n`;

      reportContent += "### Concept Performance:\n";
      reportContent += "---------------------\n";
      conceptPerformance.forEach((stat) => {
        reportContent += `Concept: ${stat.name} (ID: ${stat.id})\n`;
        reportContent += `  Definition: ${stat.definition}\n`;
        reportContent += `  Correctly Associated In Scenarios: ${stat.correctlyAssociated}\n`;
        reportContent += `  Incorrectly Dropped On This Concept: ${stat.incorrectlyDroppedOn}\n`;
        reportContent += `  Accuracy (when dropped on this concept): ${stat.accuracyOnDrops.toFixed(
          0
        )}%\n`;
        reportContent += `  Times Expected in Scenarios: ${stat.timesExpected}\n\n`;
      });

      reportContent += "\n### Scenario Breakdown:\n";
      reportContent += "-------------------\n";
      (originalScenarios || []).forEach((scenario) => {
        reportContent += `Scenario ID: ${scenario.id}\nText: ${scenario.text}\n`;
        const scenarioConceptIds = Array.isArray(scenario.conceptIds)
          ? scenario.conceptIds
          : scenario.conceptIds
          ? [scenario.conceptIds]
          : [];
        const expectedConceptNames = scenarioConceptIds
          .map(
            (id) => gameConcepts.find((c) => c.id === id)?.name || `ID ${id}`
          )
          .join(", ");
        reportContent += `  Expected Concepts: ${
          expectedConceptNames || "N/A"
        }\n`;

        const scenarioDropInteractions = interactionsLog.filter(
          (log) =>
            log.scenarioId === scenario.id &&
            (log.actionType === "DROP_ATTEMPT" ||
              log.actionType === "AUTO_DROP_CORRECT")
        );
        const playerMatchedCorrectConceptsForThisScenario = new Set();
        scenarioDropInteractions.forEach((drop) => {
          if (drop.isCorrectDrop && drop.isNewPartResolved) {
            playerMatchedCorrectConceptsForThisScenario.add(
              drop.droppedConceptName
            );
          }
        });
        const isFullyResolvedLogged = interactionsLog.some(
          (log) =>
            (log.actionType === "SCENARIO_FULLY_RESOLVED" ||
              log.actionType === "AUTO_SCENARIO_RESOLVED") &&
            log.scenarioId === scenario.id
        );

        reportContent += `  Player Matched Concepts This Session: ${
          playerMatchedCorrectConceptsForThisScenario.size > 0
            ? Array.from(playerMatchedCorrectConceptsForThisScenario).join(", ")
            : "None correctly during play"
        }\n`;
        reportContent += `  Fully Resolved This Session: ${
          isFullyResolvedLogged ? "Yes" : "No"
        }\n\n`;
      });

      const blob = new Blob([reportContent], {
        type: "text/plain;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `REQSIM_Report_${gameMode}_${
          new Date().toISOString().split("T")[0]
        }.txt`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logInteraction("REPORT_DOWNLOADED");
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          className="bg-gray-800 p-5 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-100 transition-colors p-1 rounded-full hover:bg-gray-700"
          >
            <IconXMark />
          </button>
          <div className="text-center border-b border-gray-700 pb-3 mb-4">
            <IconTrophy />
            <h2 className="text-2xl font-bold text-yellow-400">
              REQSIM Detailed Report
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-gray-700/50 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Overall Performance
              </h3>
              <p>
                Game Mode:{" "}
                <span className="font-semibold">
                  {gameMode === "multiplayer"
                    ? `Group (${groupName || "Unnamed"})`
                    : "Single Player"}
                </span>
              </p>
              <p>
                Final Score:{" "}
                <span className="font-semibold text-green-400">{score}</span>
              </p>
              <p>
                Scenarios Resolved:{" "}
                <span className="font-semibold">
                  {correctMatches} / {totalScenariosInitialCount} (
                  {overallDropAccuracy.toFixed(1)}% scenario accuracy)
                </span>
              </p>
              <p>
                Total Incorrect Drops:{" "}
                <span className="font-semibold text-red-400">{errors}</span>
              </p>
              <p>
                Max Streak:{" "}
                <span className="font-semibold text-orange-400">
                  {maxStreak}
                </span>
              </p>
              <p>
                Avg. Correct Decision Time (Manual Play):{" "}
                <span className="font-semibold">{avgLatency}s</span>
              </p>
            </div>

            <div className="bg-gray-700/50 p-3 rounded-md">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Content Source
              </h3>
              {materialsForDisplay.map((fileInfo, i) => (
                <div
                  key={i}
                  className="truncate py-1 flex items-center text-xs"
                >
                  <IconDocument />
                  <span
                    className="ml-1.5 flex-grow truncate"
                    title={fileInfo.name}
                  >
                    {fileInfo.name}{" "}
                    <span className="text-gray-400">({fileInfo.type})</span>
                  </span>
                </div>
              ))}
              <p className="mt-1 text-xs">
                Content Focus:{" "}
                {reportIsCrossDomain
                  ? "Cross-Domain"
                  : "Requirements Engineering"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                Concept Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs bg-gray-700/30 rounded-md">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">
                        Concept
                      </th>
                      <th className="px-3 py-2 text-center font-semibold">
                        Correct Assoc.
                      </th>
                      <th className="px-3 py-2 text-center font-semibold">
                        Incorrect Drops On
                      </th>
                      <th className="px-3 py-2 text-center font-semibold">
                        Times Expected
                      </th>
                      <th className="px-3 py-2 text-center font-semibold">
                        Accuracy on Drops
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conceptPerformance.map((stat) => (
                      <tr
                        key={stat.id}
                        className="border-t border-gray-700 hover:bg-gray-700/50"
                      >
                        <td className="px-3 py-1.5 font-medium">{stat.name}</td>
                        <td className="px-3 py-1.5 text-center text-green-400">
                          {stat.correctlyAssociated}
                        </td>
                        <td className="px-3 py-1.5 text-center text-red-400">
                          {stat.incorrectlyDroppedOn}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          {stat.timesExpected}
                        </td>
                        <td
                          className={`px-3 py-1.5 text-center font-semibold ${
                            stat.accuracyOnDrops >= 75
                              ? "text-green-400"
                              : stat.accuracyOnDrops >= 50
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {stat.accuracyOnDrops.toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 text-center space-x-3">
              <button
                onClick={handleDownloadReport}
                className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 inline-flex items-center justify-center"
              >
                <IconDownload /> Download Report
              </button>
              <button
                className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition text-base shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                onClick={() => {
                  onClose();
                  setGameInitialized(false);
                  setMainMaterialFile(null);
                  setMainMaterialUploadStatus(
                    "Click or Drag & Drop Main Material File..."
                  );
                  setDomainContextFile(null);
                  setDomainContextText("");
                  setDomainContextFileStatus(
                    "Upload domain context file (optional)"
                  );
                  resetGame();
                }}
              >
                Load New Materials
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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
                  {" "}
                  <div className="flex items-center justify-center">
                    {" "}
                    {item.icon}{" "}
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>{" "}
                  </div>{" "}
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>{" "}
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
              {" "}
              {`${Math.round(
                totalScenariosInitialCount > 0
                  ? (correctMatches / totalScenariosInitialCount) * 100
                  : 0
              )}%`}{" "}
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
            {" "}
            {showFeedback.type === "success" && <IconCheckCircle />}{" "}
            {showFeedback.type === "error" && <IconXCircle />}{" "}
            {showFeedback.type === "info" && <IconInformationCircle />}{" "}
            <p className="text-white text-sm font-medium ml-2">
              {showFeedback.message}
            </p>{" "}
          </motion.div>
        )}

        <div className="lg:col-span-1 space-y-4">
          {(!gameInitialized || isLoadingMaterials) && (
            <div className="space-y-4">
              {" "}
              {/* Wrapper for the two setup boxes */}
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md space-y-3">
                <h2 className="text-md font-semibold text-center text-indigo-300 border-b border-gray-700 pb-2">
                  1. Game Setup & Main Content
                </h2>
                {!isLoadingMaterials && (
                  <div className="mb-2">
                    {" "}
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Game Mode:
                    </label>{" "}
                    <div className="flex space-x-2">
                      {" "}
                      <button
                        onClick={() => setGameMode("single")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          gameMode === "single"
                            ? "bg-indigo-500 text-white ring-1 ring-indigo-300"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        Single Player
                      </button>{" "}
                      <button
                        onClick={() => setGameMode("multiplayer")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          gameMode === "multiplayer"
                            ? "bg-teal-500 text-white ring-1 ring-teal-300"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        Group Mode
                      </button>{" "}
                    </div>{" "}
                  </div>
                )}
                {gameMode === "multiplayer" && !isLoadingMaterials && (
                  <div className="mb-2">
                    {" "}
                    <label
                      htmlFor="groupNameInput"
                      className="block text-xs font-medium text-gray-300 mb-1"
                    >
                      Group/Session Name:
                    </label>{" "}
                    <input
                      type="text"
                      id="groupNameInput"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., CS401_GroupAlpha"
                    />{" "}
                  </div>
                )}
                <div className="pt-2">
                  <label
                    htmlFor="mainMaterialInputButton"
                    className="block text-xs font-medium text-gray-300 mb-1.5"
                  >
                    {" "}
                    {isCrossDomain
                      ? "Primary Content (Optional)"
                      : "Main Course Material *"}{" "}
                  </label>
                  <div
                    className={`p-3 bg-gray-700/40 rounded-md border-2 border-dashed border-blue-500/70 transition-all ${
                      isLoadingMaterials
                        ? "opacity-50"
                        : "hover:border-blue-400 cursor-pointer"
                    }`}
                    onClick={() =>
                      !isLoadingMaterials &&
                      mainMaterialInputRef.current?.click()
                    }
                    onDrop={handleMainMaterialDrop}
                    onDragOver={handleMainDragOver}
                    onDragLeave={handleMainDragLeave}
                  >
                    <input
                      type="file"
                      ref={mainMaterialInputRef}
                      onChange={handleMainMaterialFileChange}
                      className="hidden"
                      disabled={isLoadingMaterials}
                      accept=".txt,.pdf,.pptx,.ppt"
                    />
                    <div className="flex items-center text-xs text-blue-300 justify-center">
                      {" "}
                      <IconFolder />{" "}
                      <span className="truncate flex-1 ml-1.5">
                        {" "}
                        {mainMaterialFile
                          ? `File: ${mainMaterialFile.name}`
                          : mainMaterialUploadStatus}{" "}
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md space-y-3">
                <h2 className="text-md font-semibold text-center text-sky-300 border-b border-gray-700 pb-2">
                  {" "}
                  2. Scenario Customization{" "}
                </h2>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    {" "}
                    Domain-Specific Context (Optional):{" "}
                  </label>
                  <textarea
                    value={domainContextText}
                    onChange={(e) => {
                      setDomainContextText(e.target.value);
                      if (domainContextFile) {
                        setDomainContextFile(null);
                        setDomainContextFileStatus(
                          "Upload domain context file (optional)"
                        );
                      }
                    }}
                    disabled={isLoadingMaterials}
                    placeholder="Type domain details (e.g., healthcare project specifics)..."
                    className="w-full h-20 bg-gray-700/40 border border-gray-600/50 text-gray-200 text-xs rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 resize-none mb-1"
                  />
                  <div
                    className={`p-3 bg-gray-700/40 rounded-md border-2 border-dashed border-sky-500/70 transition-all ${
                      isLoadingMaterials
                        ? "opacity-50"
                        : "hover:border-sky-400 cursor-pointer"
                    }`}
                    onClick={() =>
                      !isLoadingMaterials &&
                      domainContextFileInputRef.current?.click()
                    }
                    onDrop={handleDomainContextFileDrop}
                    onDragOver={handleDomainContextDragOver}
                    onDragLeave={handleDomainContextDragLeave}
                  >
                    <input
                      type="file"
                      ref={domainContextFileInputRef}
                      onChange={handleDomainContextFileChange}
                      className="hidden"
                      disabled={isLoadingMaterials}
                      accept=".txt,.pdf,.pptx,.ppt"
                    />
                    <div className="flex items-center text-xs text-sky-300 justify-center">
                      {" "}
                      <IconFolder />{" "}
                      <span className="truncate flex-1 ml-1.5">
                        {" "}
                        {domainContextFile
                          ? `Context File: ${domainContextFile.name}`
                          : domainContextFileStatus}{" "}
                      </span>{" "}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="crossDomainCheckboxCombined"
                      checked={isCrossDomain}
                      onChange={(e) => setIsCrossDomain(e.target.checked)}
                      className="h-3.5 w-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                      disabled={isLoadingMaterials}
                    />
                    <label
                      htmlFor="crossDomainCheckboxCombined"
                      className="ml-2 text-xs text-gray-300 select-none"
                    >
                      {" "}
                      Generate General / Cross-Domain Content{" "}
                    </label>
                  </div>
                </div>
              </div>
              <button
                onClick={triggerContentGeneration}
                disabled={
                  isLoadingMaterials ||
                  (!mainMaterialFile &&
                    !domainContextText.trim() &&
                    !domainContextFile)
                }
                className="w-full mt-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold p-2.5 rounded-md transition-colors flex items-center justify-center shadow hover:shadow-md"
              >
                {" "}
                {isLoadingMaterials ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {" "}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>{" "}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>{" "}
                  </svg>
                ) : (
                  <IconPlusCircle />
                )}{" "}
                {isLoadingMaterials ? "Processing..." : "Generate Game Content"}{" "}
              </button>
              {isLoadingMaterials && (
                <p className="text-xs text-center text-blue-300 mt-2">
                  {uploadStatus}
                </p>
              )}
            </div>
          )}

          {gameInitialized &&
            !isLoadingMaterials &&
            materialsForDisplay.length > 0 && (
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold mb-1 text-blue-300 flex items-center">
                  {" "}
                  <IconBeaker /> Active Content Drivers{" "}
                </h3>
                {materialsForDisplay.map((fileInfo, i) => (
                  <div
                    key={i}
                    className="truncate px-2 py-1.5 bg-gray-700/60 rounded-md flex items-center text-xs shadow-sm mt-1"
                  >
                    {" "}
                    <IconDocument />{" "}
                    <span
                      className="ml-1.5 flex-grow truncate"
                      title={fileInfo.name}
                    >
                      {" "}
                      {fileInfo.name}{" "}
                      <span className="text-gray-400">({fileInfo.type})</span>{" "}
                    </span>{" "}
                  </div>
                ))}
                <div className="mt-2 text-xs text-gray-400">
                  {" "}
                  Content Focus:{" "}
                  {isCrossDomain
                    ? "Cross-Domain"
                    : "Requirements Engineering"}{" "}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {" "}
                  Game Mode:{" "}
                  {gameMode === "multiplayer"
                    ? `Group (${groupName || "Unnamed"})`
                    : "Single Player"}{" "}
                </div>
              </div>
            )}

          {gameInitialized && concepts.length > 0 ? (
            <>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/70 shadow-md">
                <h2 className="text-lg font-semibold mb-2 flex items-center text-indigo-300">
                  {" "}
                  <IconClipboardList /> Current Scenario{" "}
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
                      {" "}
                      <IconDragHandle />{" "}
                      <p className="text-sm font-medium text-gray-100 leading-normal">
                        {currentScenario.text}
                      </p>{" "}
                    </div>
                    <div className="mt-2 text-xs text-indigo-300">
                      {" "}
                      Relates to: {
                        currentScenario.conceptIds.length
                      } concept(s){" "}
                    </div>
                    {currentScenario.conceptIds.length > 1 && (
                      <div className="text-xs text-green-400 mt-0.5">
                        {" "}
                        Found: {resolvedConceptsForCurrentScenario.size} /{" "}
                        {currentScenario.conceptIds.length}{" "}
                      </div>
                    )}
                    <div className="mt-1.5 text-xs text-blue-300 flex items-center justify-between">
                      {" "}
                      <span>Difficulty:</span>{" "}
                      <span className="flex">
                        {" "}
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
                              {" "}
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />{" "}
                            </svg>
                          ))}{" "}
                      </span>{" "}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-600/50">
                      {" "}
                      <CountdownTimer
                        key={`timer-${currentScenario.id}-${index}-${resolvedConceptsForCurrentScenario.size}`}
                        minutes={1}
                        onTimeUp={handleTimeUp}
                        isPaused={timePaused}
                      />{" "}
                    </div>
                  </motion.div>
                ) : null /* Report modal will be shown via state */}
              </div>

              {currentScenario && !isCrossDomain && (
                <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-green-500/50 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    {" "}
                    <div className="flex items-center">
                      {" "}
                      <IconUserCircle />{" "}
                      <div>
                        {" "}
                        <h2 className="text-lg font-semibold text-green-300">
                          {" "}
                          Requirement Engineer{" "}
                        </h2>{" "}
                        <p className="text-xs text-gray-400">
                          Available for consultation
                        </p>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="w-16 h-16 flex-shrink-0">
                      {" "}
                      <EmotionFace
                        emotion={["happy", "neutral", "angry"][npcMood]}
                      />{" "}
                    </div>{" "}
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
                    {" "}
                    {isLoadingHint ? (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {" "}
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>{" "}
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>{" "}
                      </svg>
                    ) : (
                      <IconLightBulb />
                    )}{" "}
                    {isLoadingHint
                      ? "The Engineer is Pondering..."
                      : "Ask for Hint (-10pts)"}{" "}
                  </button>
                  {hint && !isLoadingHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-3 p-2.5 bg-gray-700/80 rounded-md text-xs border-l-4 border-yellow-400 shadow-sm"
                    >
                      {" "}
                      {showFeedback &&
                      showFeedback.type === "info" &&
                      showFeedback.message.includes("Engineer says") ? null : (
                        <p className="text-yellow-300 flex items-start mb-0.5">
                          {" "}
                          <IconInformationCircle />{" "}
                          <span className="font-semibold ml-1">Hint:</span>{" "}
                        </p>
                      )}{" "}
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
                      </p>{" "}
                    </motion.div>
                  )}
                </div>
              )}
            </>
          ) : (
            !isLoadingMaterials &&
            !gameInitialized && (
              <div className="lg:col-span-4 flex items-center justify-center min-h-[400px] bg-gray-800/50 rounded-lg p-6">
                <p className="text-xl text-center text-gray-400">
                  Please use the setup panel on the left and click "Generate
                  Game Content" to start REQSIM!
                </p>
              </div>
            )
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
                className={`p-3.5 bg-gray-800/70 backdrop-blur-sm rounded-lg border-2 transition-all relative shadow-md hover:shadow-lg ${
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
                  {" "}
                  <div className="flex-1 pr-2">
                    {" "}
                    <h3 className="text-lg font-bold text-indigo-200">
                      {concept.name}
                    </h3>{" "}
                    <p className="text-xs text-gray-400 mt-0.5 italic leading-snug">
                      {concept.definition}
                    </p>{" "}
                  </div>{" "}
                  <div className="w-14 h-14 flex-shrink-0 -mt-1 -mr-1">
                    {" "}
                    <EmotionFace emotion={concept.emotion} />{" "}
                  </div>{" "}
                </div>
                {concept.scenarios.length > 0 && (
                  <div className="mt-2 border-t border-gray-700/50 pt-2">
                    {" "}
                    <h4 className="text-xs font-semibold mb-1.5 text-green-400 flex items-center">
                      {" "}
                      <IconCheckCircle className="w-4 h-4 mr-1" /> Related
                      Scenarios ({concept.scenarios.length}):{" "}
                    </h4>{" "}
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {" "}
                      {concept.scenarios.map((s, idx) => (
                        <motion.div
                          key={`${s.id}-${idx}-${concept.id}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs bg-gray-700/50 p-1.5 rounded border-l-4 border-green-600/80 shadow-sm"
                        >
                          {" "}
                          {s.text}{" "}
                        </motion.div>
                      ))}{" "}
                    </div>{" "}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : gameInitialized && concepts.length === 0 && !isLoadingMaterials ? (
          <div className="lg:col-span-3 flex items-center justify-center min-h-[400px]">
            <p className="text-xl text-gray-500 text-center">
              No concepts or scenarios were generated. <br />
              Please try a different file or adjust its content.
            </p>
          </div>
        ) : null}
      </main>
      <GameReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        gameStats={{
          score,
          errors,
          maxStreak,
          correctMatches,
          totalScenariosInitialCount,
          gameMode,
          groupName,
          isCrossDomain,
        }}
        concepts={concepts}
        originalScenarios={originalGeneratedScenarios}
        interactionsLog={gameInteractionsLog}
      />
      {gameInitialized &&
        currentScenario &&
        (process.env.NODE_ENV === "development" || true) && (
          <div className="fixed bottom-4 right-4 z-30">
            <button
              onClick={handleAutoCompleteGame}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-lg"
              title="Auto-completes the current game for testing purposes."
            >
              Auto-Complete Game (Test)
            </button>
          </div>
        )}
    </div>
  );
}
