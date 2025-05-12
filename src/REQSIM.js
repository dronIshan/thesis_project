// src/REQSIM.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmotionFace from "./EmotionFace";
import CountdownTimer from "./CountdownTimer";

// Import the separated modals
import SurveyModal from "./SurveyModal";
import GameReportModal from "./GameReportModal";

// Import all icons from our icons.js
import {
  IconAcademicCap,
  IconStar,
  IconExclamationTriangle,
  IconFire,
  IconFolder,
  IconDocument,
  IconClipboardList,
  IconDragHandle,
  IconUserCircle,
  IconLightBulb,
  IconInformationCircle,
  IconCheckCircle,
  IconXCircle,
  IconTrophy,
  IconPlusCircle,
  IconBeaker,
  IconDownload,
  IconXMark,
  IconClipboardDocumentList,
  IconChevronRight,
  IconChevronLeft,
} from "./icons"; // Assuming icons.js is in the same directory

// Backend URL configuration
const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://ishanvimukthi.pythonanywhere.com";

export default function REQSIM() {
  // --- React Refs ---
  // These are declared at the top level of the component function
  const headerRef = useRef();
  const mainMaterialInputRef = useRef(null); // Correctly declared here
  const domainContextFileInputRef = useRef(null); // Correctly declared here

  // --- Game State ---
  const [concepts, setConcepts] = useState([]); // AI-generated concepts
  const [scenarios, setScenarios] = useState([]); // Remaining scenarios to play
  const [originalGeneratedScenarios, setOriginalGeneratedScenarios] = useState(
    []
  ); // Full list of scenarios generated for the session
  const [currentScenario, setCurrentScenario] = useState(null); // The scenario currently presented
  const [
    resolvedConceptsForCurrentScenario,
    setResolvedConceptsForCurrentScenario,
  ] = useState(new Set()); // Concepts already matched for the current scenario

  // --- Player Stats State ---
  const [score, setScore] = useState(0); // Player's score
  const [errors, setErrors] = useState(0); // Count of incorrect drops or timeouts
  const [streakCount, setStreakCount] = useState(0); // Current correct match streak
  const [maxStreak, setMaxStreak] = useState(0); // Highest streak achieved
  const [correctMatches, setCorrectMatches] = useState(0); // Count of scenarios fully resolved by the player
  const [totalScenariosInitialCount, setTotalScenariosInitialCount] =
    useState(0); // Total scenarios at the start of the game

  // --- Game UI/Flow State ---
  const [npcMood, setNpcMood] = useState(1); // NPC mood (0: happy, 1: neutral, 2: angry)
  const [hint, setHint] = useState(""); // Current hint text
  const [isLoadingHint, setIsLoadingHint] = useState(false); // Hint loading state
  const [timePaused, setTimePaused] = useState(false); // Timer pause state
  const [showFeedback, setShowFeedback] = useState(null); // Feedback message state ({type, message})
  const [highlightedConceptId, setHighlightedConceptId] = useState(null); // Concept being hovered for drop
  const [index, setIndex] = useState(0); // Count of scenarios attempted (resolved or timed out)

  // --- Material Upload / Generation State ---
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false); // Content generation loading state
  const [mainMaterialFile, setMainMaterialFile] = useState(null); // File object for main material
  const [mainMaterialUploadStatus, setMainMaterialUploadStatus] = useState(
    "Click or Drag & Drop Main Material File..."
  );
  const [domainContextFile, setDomainContextFile] = useState(null); // File object for domain context
  const [domainContextText, setDomainContextText] = useState(""); // Text input for domain context
  const [domainContextFileStatus, setDomainContextFileStatus] = useState(
    "Click or Drag & Drop Domain Context File (Optional)"
  );
  const [uploadStatus, setUploadStatus] = useState(
    "Upload materials and/or provide context to begin REQSIM!"
  ); // Status message during upload/processing
  const [materialsForDisplay, setMaterialsForDisplay] = useState([]); // List of loaded materials for display in report

  // --- Game Mode State ---
  const [gameInitialized, setGameInitialized] = useState(false); // Flag after content is generated and game is ready
  const [isCrossDomain, setIsCrossDomain] = useState(false); // Flag for cross-domain mode
  const [gameMode, setGameMode] = useState("single"); // Game mode ('single' or 'multiplayer')
  const [groupName, setGroupName] = useState(""); // Group name for multiplayer mode

  // --- Data Logging State ---
  const [gameInteractionsLog, setGameInteractionsLog] = useState([]); // Array to store interaction logs
  const [dragStartTime, setDragStartTime] = useState(null); // Timestamp when drag starts

  // --- Modal State ---
  const [showReportModal, setShowReportModal] = useState(false); // Report modal visibility
  const [showSurveyModal, setShowSurveyModal] = useState(false); // Survey modal visibility
  const [surveySkippedOrCompleted, setSurveySkippedOrCompleted] =
    useState(false); // Flag to prevent showing survey again
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false); // State to track if survey is being submitted

  // --- Survey State (Managed in REQSIM to collect data) ---
  const [surveyData, setSurveyData] = useState({
    email: "",
    age: "",
    gender: "",
    education: "",
    reFamiliarity: "",
    // These will be dynamically added based on generated concepts for RE mode
    // e.g., reConceptUnderstand_conceptId: ""
    reScenarioClarity: "",
    reGameplayEngagement: "",
    rePrinciplesImprovement: "",
    reConceptRequests: "", // Open text feedback
    reOtherFeedback: "", // Open text feedback
    // General feedback questions (appear in both modes)
    generalGameplayEngagement: "",
    interfaceUserFriendliness: "",
    instructionsClear: "",
    technicalIssues: "", // Open text feedback
    recommendLikelihood: "",
    likedMost: "", // Open text feedback
    couldBeImproved: "", // Open text feedback
    otherComments: "", // Open text feedback
  });

  // --- Other ---
  const THESIS_TITLE =
    "Developing AI-Driven Simulation Game for Enhanced Learning in Requirements Engineering"; // Thesis title constant

  // --- Effects ---

  // Update max streak when streak count changes
  useEffect(() => {
    if (streakCount > maxStreak) {
      setMaxStreak(streakCount);
    }
  }, [streakCount, maxStreak]);

  // Reset hint and NPC mood when cross-domain mode changes
  useEffect(() => {
    if (isCrossDomain) {
      setHint(""); // No hints in cross-domain mode
      setNpcMood(1); // Neutral mood
    } else {
      // If switching *back* to RE mode, maybe set a default hint or mood?
      // For now, just ensure they are not stuck in a cross-domain state.
    }
  }, [isCrossDomain]);

  // Effect to handle game completion and trigger modals
  useEffect(() => {
    // Check if game is initialized, there were scenarios to play, and no scenarios remain
    if (
      gameInitialized &&
      totalScenariosInitialCount > 0 &&
      scenarios.length === 0 &&
      !currentScenario
    ) {
      setTimePaused(true); // Ensure timer is paused (though it should already be if currentScenario is null)
      if (!surveySkippedOrCompleted && !showSurveyModal && !showReportModal) {
        // If game is over, and survey hasn't been done/skipped, show survey
        logInteraction("GAME_COMPLETED_TRIGGERING_SURVEY");
        setShowSurveyModal(true);
      } else if (surveySkippedOrCompleted && !showReportModal) {
        // If game is over and survey was done/skipped, show report
        logInteraction("GAME_COMPLETED_TRIGGERING_REPORT");
        setShowReportModal(true);
      } else if (!showReportModal) {
        // If game is over and report isn't showing, maybe trigger report?
        // This case might cover scenarios where the user somehow closed the survey without marking it complete/skipped.
        // Let's default to showing the report if the game is over and report isn't visible.
        logInteraction("GAME_COMPLETED_REPORT_NOT_VISIBLE");
        setShowReportModal(true);
      }
    } else if (
      !gameInitialized &&
      !isLoadingMaterials &&
      totalScenariosInitialCount > 0
    ) {
      // This case might happen if game was initialized but then reset unexpectedly,
      // or if content generation failed after getting some initial scenario count.
      // Ensure modals are hidden if the game isn't in a completed state.
      setShowSurveyModal(false);
      setShowReportModal(false);
      setSurveySkippedOrCompleted(false); // Reset survey status if game state is inconsistent with completion
    }
    // Add dependencies that should re-run this check
  }, [
    gameInitialized,
    scenarios.length,
    currentScenario,
    surveySkippedOrCompleted,
    showSurveyModal,
    showReportModal,
    totalScenariosInitialCount,
    isLoadingMaterials,
  ]);

  // --- Interaction Logging ---

  // Log interaction function
  const logInteraction = (actionType, details = {}) => {
    setGameInteractionsLog((prevLog) => [
      ...prevLog,
      {
        timestamp: new Date().toISOString(),
        actionType,
        scenarioId: currentScenario ? currentScenario.id : null, // Log scenario ID if applicable
        scenarioText: currentScenario ? currentScenario.text : null, // Log scenario text if applicable
        ...details, // Include any specific details for this interaction
        // Include current game state for context
        currentScore: score,
        currentErrors: errors,
        currentStreak: streakCount,
        gameMode: gameMode,
        groupName: groupName,
        isCrossDomain: isCrossDomain,
        scenariosRemaining: scenarios.length, // Number of scenarios left in the queue
        conceptsResolvedInCurrent: currentScenario
          ? Array.from(resolvedConceptsForCurrentScenario).length
          : 0, // How many parts found for the current scenario
      },
    ]);
  };

  // --- Game Setup / Reset ---

  // Sets up the next scenario from the queue
  const setupNewScenario = (scenarioList) => {
    if (scenarioList && scenarioList.length > 0) {
      const nextScenarioSource = scenarioList[0];
      const nextScenario = {
        ...nextScenarioSource,
        // Ensure conceptIds is always an array, handling cases where it might be a single value or null
        conceptIds: Array.isArray(nextScenarioSource.conceptIds)
          ? nextScenarioSource.conceptIds
          : nextScenarioSource.conceptIds
          ? [nextScenarioSource.conceptIds]
          : [],
        difficulty: nextScenarioSource.difficulty || 1, // Ensure difficulty defaults if missing
        startTime: Date.now(), // Record when the scenario is presented
      };
      setCurrentScenario(nextScenario);
      setResolvedConceptsForCurrentScenario(new Set()); // Reset resolved concepts for the new scenario
      setHint(""); // Clear hint for the new scenario
      setNpcMood(1); // Reset NPC mood to neutral

      // Log the scenario being presented
      if (nextScenario.id !== undefined) {
        logInteraction("SCENARIO_PRESENTED", {
          scenarioId: nextScenario.id,
          text: nextScenario.text,
          conceptIds: nextScenario.conceptIds,
        });
      }
    } else {
      // No more scenarios left
      setCurrentScenario(null);
      // The useEffect hook for game completion handles triggering the modals
    }
  };

  // Resets the game state to initial or provided content
  const resetGame = (newConcepts = [], newScenarios = []) => {
    // Log game reset
    logInteraction("GAME_RESET", {
      reason:
        newConcepts.length === 0
          ? "No content generated or explicit reset"
          : "New game started after content generation",
      conceptsProvidedCount: newConcepts.length,
      scenariosProvidedCount: newScenarios.length,
    });

    // Reset core game state
    setConcepts(
      newConcepts.map((c) => ({ ...c, scenarios: [], emotion: "neutral" })) // Ensure concepts start with empty scenario list and neutral emotion
    );
    setScenarios(newScenarios);
    // Store a deep copy of original scenarios for reporting
    setOriginalGeneratedScenarios(JSON.parse(JSON.stringify(newScenarios)));

    // Reset player stats state
    setScore(0);
    setErrors(0); // Reset errors
    setStreakCount(0);
    setMaxStreak(0);
    setCorrectMatches(0); // Reset completed scenario count
    setTotalScenariosInitialCount(newScenarios.length); // Set the total count for progress display

    // Reset UI/Flow state
    setNpcMood(1); // Neutral mood
    setHint(""); // Clear hint
    setIsLoadingHint(false); // Ensure hint is not loading
    setTimePaused(false); // Ensure timer is not paused (it will be paused if currentScenario is null)
    setShowFeedback(null); // Clear feedback message
    setHighlightedConceptId(null); // Clear highlighted concept
    setIndex(0); // Reset scenario index

    // Reset data logging state
    setGameInteractionsLog([]); // Clear interaction log
    setDragStartTime(null); // Reset drag start time

    // Reset modal state
    setShowReportModal(false);
    setShowSurveyModal(false);
    setSurveySkippedOrCompleted(false); // Allow survey again for a new game
    setIsSubmittingSurvey(false); // Ensure submitting state is false

    // Reset survey data state
    setSurveyData({
      email: "",
      age: "",
      gender: "",
      education: "",
      reFamiliarity: "",
      reScenarioClarity: "",
      reGameplayEngagement: "",
      rePrinciplesImprovement: "",
      reConceptRequests: "",
      reOtherFeedback: "",
      generalGameplayEngagement: "",
      interfaceUserFriendliness: "",
      instructionsClear: "",
      technicalIssues: "",
      recommendLikelihood: "",
      likedMost: "",
      couldBeImproved: "",
      otherComments: "",
    });

    // Reset material display state
    setMaterialsForDisplay([]);

    // Initialize game if content was provided
    if (newConcepts.length > 0 && newScenarios.length > 0) {
      setGameInitialized(true);
      // Setup the first scenario. Use a slight delay to ensure state updates propagate.
      setTimeout(() => setupNewScenario(newScenarios), 0);

      // Update upload status message
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
        statusMsg = "Game ready with generated content."; // Default if only RE material used
      }
      // Only update status if not currently showing a loading message
      if (!isLoadingMaterials) setUploadStatus(statusMsg.trim());
    } else {
      // Game is not initialized if no content was provided
      setGameInitialized(false);
      setUploadStatus(
        "Upload materials and/or provide context to begin REQSIM!"
      );
      // Ensure materials display is clear if no content
      setMaterialsForDisplay([]);
    }
  };

  // Effect to perform initial game setup on component mount
  useEffect(() => {
    resetGame(); // Initialize the game on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only once on mount

  // --- File Handling ---

  const handleMainMaterialFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setMainMaterialFile(files[0]);
      setMainMaterialUploadStatus(`Selected: ${files[0].name}`);
    } else {
      setMainMaterialFile(null);
      setMainMaterialUploadStatus("Click or Drag & Drop Main Material File...");
    }
    e.target.value = null; // Clear input value to allow selecting the same file again
  };

  const handleDomainContextFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setDomainContextFile(files[0]);
      setDomainContextText(""); // Clear text input if file is selected
      setDomainContextFileStatus(`Context File: ${files[0].name}`);
    } else {
      setDomainContextFile(null);
      setDomainContextFileStatus(
        "Click or Drag & Drop Domain Context File (Optional)"
      );
    }
    e.target.value = null; // Clear input value
  };

  // --- Content Generation ---

  const triggerContentGeneration = async () => {
    // --- Validation ---
    // If not cross-domain, main material file is required. Domain context is optional.
    if (!isCrossDomain && !mainMaterialFile) {
      setShowFeedback({
        type: "error",
        message:
          "Please provide a main course material file to generate RE-focused content.",
      });
      setTimeout(() => setShowFeedback(null), 4000);
      return;
    }
    // If in cross-domain mode, provide *some* context: main file, domain file, or domain text.
    if (
      isCrossDomain &&
      !mainMaterialFile &&
      !domainContextFile &&
      !domainContextText.trim()
    ) {
      setShowFeedback({
        type: "error",
        message:
          "For cross-domain mode, please provide either main material, a domain context file, or type domain context text to provide context.",
      });
      setTimeout(() => setShowFeedback(null), 4000);
      return;
    }
    // If multiplayer mode, group name is required
    if (gameMode === "multiplayer" && !groupName.trim()) {
      setShowFeedback({
        type: "error",
        message: "Please provide a Group/Session Name for multiplayer mode.",
      });
      setTimeout(() => setShowFeedback(null), 4000);
      return;
    }
    // --- End Validation ---

    setIsLoadingMaterials(true); // Set loading state
    setUploadStatus(`Processing inputs... This may take a moment.`); // Update status message
    setTimePaused(true); // Pause game timer (if any was running)
    setGameInitialized(false); // De-initialize the current game state
    setGameInteractionsLog([]); // Start a new interaction log for this session
    logInteraction("CONTENT_GENERATION_START"); // Log the start of generation

    const formData = new FormData();
    if (mainMaterialFile) {
      formData.append("course_material_file", mainMaterialFile);
    }
    // Append crossDomain flag - explicitly 'true' or 'false' string
    formData.append("isCrossDomain", isCrossDomain.toString());

    if (domainContextText.trim()) {
      formData.append("domain_context_text", domainContextText.trim());
    } else if (domainContextFile) {
      formData.append("domain_context_file", domainContextFile);
    }
    formData.append("gameMode", gameMode); // Include game mode
    formData.append("groupName", groupName.trim()); // Include group name

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reqsim/process-materials`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json(); // Parse JSON response

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500)
        throw new Error(
          responseData.error || `HTTP error! status: ${response.status}`
        );
      }

      // Validate response data structure
      if (
        !responseData.concepts ||
        !responseData.scenarios ||
        !Array.isArray(responseData.concepts) ||
        !Array.isArray(responseData.scenarios)
      ) {
        throw new Error("Received invalid data structure from server.");
      }

      // Check if content was actually generated
      if (
        responseData.concepts.length === 0 ||
        responseData.scenarios.length === 0
      ) {
        const message =
          responseData.error ||
          "AI could not generate relevant content. Try different/more detailed material, or ensure file has readable text.";
        setShowFeedback({ type: "info", message }); // Show info message
        resetGame([], []); // Reset game with empty data
        setUploadStatus(message); // Update status message
        setMaterialsForDisplay([]); // Clear displayed materials
        logInteraction("CONTENT_GENERATION_FAILED", { reason: message }); // Log failure
      } else {
        // --- Success: Content Generated ---
        // Validate and map scenarios to ensure correct structure
        const validatedScenarios = responseData.scenarios.map((s) => ({
          ...s,
          conceptIds: Array.isArray(s.conceptIds)
            ? s.conceptIds
            : s.conceptIds
            ? [s.conceptIds]
            : [], // Ensure conceptIds is an array
          difficulty: s.difficulty || 1, // Ensure difficulty is set
        }));

        // Prepare materials info for display in report
        let currentLoadedFilesInfo = [];
        if (mainMaterialFile)
          currentLoadedFilesInfo.push({
            name: mainMaterialFile.name,
            type: isCrossDomain ? "Primary Content" : "Main Material",
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

        // Reset game state and initialize with generated content
        resetGame(responseData.concepts, validatedScenarios);
        logInteraction("CONTENT_GENERATION_SUCCESS", {
          conceptsCount: responseData.concepts.length,
          scenariosCount: validatedScenarios.length,
          isCrossDomainGenerated: isCrossDomain,
          generatedConceptNames: responseData.concepts.map((c) => c.name),
          generatedScenarioTexts: validatedScenarios.map((s) => s.text),
        });
        setShowFeedback({
          type: "success",
          message: "Content generated! Game is ready.",
        }); // Show success feedback
        setTimeout(() => setShowFeedback(null), 3000); // Hide feedback after delay
      }
    } catch (error) {
      // Handle any errors during the fetch or processing
      console.error("Error processing materials:", error);
      setUploadStatus("Error processing materials. Please try again.");
      setShowFeedback({
        type: "error",
        message: `Failed to load game data: ${error.message}. Check console for details.`,
      });
      setTimeout(() => setShowFeedback(null), 5000);
      logInteraction("CONTENT_GENERATION_ERROR", {
        error: error.message,
        materials: materialsForDisplay,
        isCrossDomain,
        gameMode,
        groupName,
      }); // Log the error details
      resetGame(); // Reset to initial empty state on error
    } finally {
      setIsLoadingMaterials(false); // Turn off loading state
      setTimePaused(false); // Ensure timer is unpaused if it was paused for loading
    }
  };

  // --- Drag and Drop Handlers ---

  // Handlers for main material file drop area
  const handleMainMaterialDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingMaterials) return; // Ignore drops while loading
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setMainMaterialFile(files[0]);
      setMainMaterialUploadStatus(`Dropped: ${files[0].name}`);
    }
    // Remove drag-over styles
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
      // Only show drag-over styles when not loading
      e.currentTarget.classList.add(
        "ring-2",
        "ring-blue-500",
        "bg-gray-700/50"
      );
  };
  const handleMainDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove drag-over styles
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-blue-500",
      "bg-gray-700/50"
    );
  };

  // Handlers for domain context file drop area
  const handleDomainContextFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingMaterials) return; // Ignore drops while loading
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDomainContextFile(files[0]);
      setDomainContextText(""); // Clear text input if file is dropped
      setDomainContextFileStatus(`Context File Dropped: ${files[0].name}`);
    }
    // Remove drag-over styles
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
      // Only show drag-over styles when not loading
      e.currentTarget.classList.add("ring-2", "ring-sky-500", "bg-gray-700/50");
  };
  const handleDomainContextDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove drag-over styles
    e.currentTarget.classList.remove(
      "ring-2",
      "ring-sky-500",
      "bg-gray-700/50"
    );
  };

  // Handler for scenario drag start
  const handleScenarioDragStart = (e, scenario) => {
    e.dataTransfer.setData("application/json", JSON.stringify(scenario)); // Set data to be transferred
    setDragStartTime(Date.now()); // Record drag start time for latency calculation
    logInteraction("DRAG_START", { scenarioId: scenario.id }); // Log the action
  };
  // Handler for scenario drag end
  const handleScenarioDragEnd = () => {
    setHighlightedConceptId(null); // Remove highlighting from concepts
  };

  // Handler for concept drop (the core game logic)
  const handleConceptDrop = (e, targetConcept) => {
    e.preventDefault();
    // Prevent drops if there's no current scenario or game isn't initialized
    if (!currentScenario || !gameInitialized) return;

    const scenarioToMatch = currentScenario;
    const dropTime = Date.now(); // Record drop time
    const latency = dragStartTime ? dropTime - dragStartTime : null; // Calculate latency if drag start time was recorded
    setDragStartTime(null); // Reset drag start time

    setHighlightedConceptId(null); // Remove concept highlighting

    // Ensure conceptIds is an array for the current scenario
    const conceptIdsArray = Array.isArray(scenarioToMatch.conceptIds)
      ? scenarioToMatch.conceptIds
      : scenarioToMatch.conceptIds
      ? [scenarioToMatch.conceptIds]
      : [];

    // Check if the dropped concept is correct for the current scenario
    const isCorrectConceptForScenario = conceptIdsArray.includes(
      targetConcept.id
    );
    // Check if this correct concept has already been resolved for THIS scenario
    const isAlreadyResolvedForThisScenario =
      resolvedConceptsForCurrentScenario.has(targetConcept.id);
    // Check if this drop is a correct match that resolves a NEW part of the scenario
    const isNewPartResolved =
      isCorrectConceptForScenario && !isAlreadyResolvedForThisScenario;

    // --- Log the Drop Attempt ---
    const interactionDetails = {
      scenarioId: scenarioToMatch.id,
      droppedConceptId: targetConcept.id,
      droppedConceptName: targetConcept.name,
      expectedConceptIdsInScenario: conceptIdsArray, // List all expected concept IDs
      isCorrectDrop: isCorrectConceptForScenario, // Was the dropped concept one of the expected ones?
      isNewPartResolved: isNewPartResolved, // Did this drop complete a new part of the scenario?
      latencyMs: latency, // Time taken for the drag-drop action
      resolvedPartsBeforeDrop: Array.from(resolvedConceptsForCurrentScenario), // State of resolved parts before this drop
      targetConceptEmotionBefore: targetConcept.emotion, // Log concept emotion before update
    };
    logInteraction("DROP_ATTEMPT", interactionDetails);
    // --- End Log ---

    // --- Process Drop Result ---
    if (isNewPartResolved) {
      // Correct drop that resolves a new part of the scenario
      const newResolvedParts = new Set(resolvedConceptsForCurrentScenario).add(
        targetConcept.id
      );
      setResolvedConceptsForCurrentScenario(newResolvedParts); // Update resolved concepts for current scenario

      // Calculate points for this match
      const pointsPerPart = Math.max(
        5, // Minimum points per part
        Math.round(
          (10 * (scenarioToMatch.difficulty || 1)) /
            (conceptIdsArray.length || 1) // Points based on difficulty and number of concepts needed
        )
      );
      setScore((s) => s + pointsPerPart); // Update score

      // Set concept emotion to happy temporarily
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === targetConcept.id ? { ...c, emotion: "happy" } : c
        )
      );

      // Check if the scenario is now fully resolved
      if (newResolvedParts.size === conceptIdsArray.length) {
        // --- Scenario Fully Resolved ---
        setStreakCount((prev) => {
          const newStreak = prev + 1;
          if (newStreak > maxStreak) setMaxStreak(newStreak); // Update max streak
          return newStreak; // Increment streak
        });
        setCorrectMatches((prev) => prev + 1); // Increment count of fully resolved scenarios
        const totalPointsForScenario = pointsPerPart * conceptIdsArray.length; // Total points for this scenario

        // Show success feedback for scenario completion
        setShowFeedback({
          type: "success",
          message: `Scenario complete! All ${
            conceptIdsArray.length
          } concepts found. Total +${totalPointsForScenario} pts. ${
            streakCount + 1 > 1 ? `Streak: ${streakCount + 1}` : ""
          }`,
        });
        setNpcMood(0); // Set NPC mood to happy

        // Log the scenario completion
        logInteraction("SCENARIO_FULLY_RESOLVED", {
          scenarioId: scenarioToMatch.id,
          timeToResolve: dropTime - (currentScenario.startTime || dropTime), // Time from scenario start to completion
          resolvedConceptIds: Array.from(newResolvedParts),
          pointsEarned: totalPointsForScenario,
        });

        // Update the list of scenarios the concept is associated with (for display in concept card)
        setConcepts((prevConcepts) =>
          prevConcepts.map((c) => {
            if (conceptIdsArray.includes(c.id)) {
              // Add the resolved scenario to the concept's scenario list if not already there
              const scenarioExists = c.scenarios.find(
                (s) => s.id === scenarioToMatch.id
              );
              return {
                ...c,
                scenarios: scenarioExists
                  ? c.scenarios // Keep existing list if already added
                  : [
                      ...c.scenarios,
                      { ...scenarioToMatch, status: "resolved" }, // Add the new resolved scenario
                    ],
                emotion: "happy", // Keep concepts involved in a completed scenario happy
              };
            }
            return c; // Other concepts remain unchanged
          })
        );

        // Remove the completed scenario from the active list and set up the next one
        const remaining = scenarios.filter((s) => s.id !== scenarioToMatch.id);
        setScenarios(remaining);
        setupNewScenario(remaining); // Setup the next scenario or trigger game completion
        setIndex((i) => i + 1); // Increment the scenario attempt index
      } else {
        // --- Scenario Partially Resolved (Found a new concept for it) ---
        setShowFeedback({
          type: "success",
          message: `Concept '${targetConcept.name}' found! +${pointsPerPart} pts. (${newResolvedParts.size}/${conceptIdsArray.length})`,
        });
        setNpcMood(1); // Set NPC mood to neutral

        // Concept emotion is already set to happy above
      }
    } else if (
      isCorrectConceptForScenario &&
      isAlreadyResolvedForThisScenario
    ) {
      // --- Correct Concept, but Already Resolved for this Scenario ---
      setShowFeedback({
        type: "info",
        message: `You've already matched '${targetConcept.name}' for this scenario.`,
      });
      setNpcMood(1); // Neutral NPC
      // Keep concept emotion happy if it's already resolved for the current scenario
    } else {
      // --- Incorrect Drop ---
      const penalty = 5; // Penalty for incorrect drop
      setScore((s) => Math.max(0, s - penalty)); // Decrease score (minimum 0)
      setErrors((e) => e + 1); // Increment error count
      setStreakCount(0); // Break streak

      // Set concept emotion to sad temporarily for the incorrectly dropped concept
      setConcepts((prev) =>
        prev.map((c) =>
          c.id === targetConcept.id ? { ...c, emotion: "sad" } : c
        )
      );

      setShowFeedback({
        type: "error",
        message: `-${penalty} pts. '${targetConcept.name}' is not relevant here.`,
      });
      setNpcMood(2); // Set NPC mood to angry
    }

    // --- Cleanup after Feedback Delay ---
    // Use a single timeout to handle feedback hiding and emotion resetting
    setTimeout(() => {
      setShowFeedback(null); // Hide feedback message
      setHint(""); // Clear hint text

      setConcepts((prev) =>
        prev.map((c) => {
          // Reset emotion to neutral IF it was sad AND wasn't involved in a successful match
          if (c.id === targetConcept.id && c.emotion === "sad") {
            // If this concept is NOT resolved for the current scenario OR (it is resolved, but this specific drop was incorrect/duplicate)
            if (
              !resolvedConceptsForCurrentScenario.has(c.id) ||
              (resolvedConceptsForCurrentScenario.has(c.id) &&
                (!isCorrectConceptForScenario ||
                  isAlreadyResolvedForThisScenario))
            ) {
              return { ...c, emotion: "neutral" };
            }
          }
          // For concepts that were temporarily happy (because they were correctly matched),
          // ensure they stay happy if they are part of the currently resolved set for THIS scenario.
          // If they were temporarily happy but were NOT the target of this specific drop,
          // their emotion will be reset below if they are not in the resolved set.
          if (c.id !== targetConcept.id && c.emotion === "happy") {
            // Keep happy if it's still resolved for the current scenario
            if (
              currentScenario &&
              resolvedConceptsForCurrentScenario.has(c.id) &&
              currentScenario.conceptIds.includes(c.id)
            ) {
              return c;
            }
            // Otherwise, reset to neutral
            return { ...c, emotion: "neutral" };
          }

          // Reset any lingering 'sad' emotions on concepts not related to this scenario timeout
          if (c.id !== targetConcept.id && c.emotion === "sad") {
            return { ...c, emotion: "neutral" };
          }

          return c; // Keep other concepts as they are
        })
      );

      // Reset NPC mood if it's angry after an incorrect drop (unless a new scenario started immediately)
      if (
        npcMood === 2 &&
        currentScenario &&
        scenarios.some((s) => s.id === currentScenario.id)
      ) {
        setNpcMood(1); // Reset to neutral
      }
    }, 3000); // Matches the feedback display duration
  };

  // --- Timer Handler ---

  // Handles the time running out for a scenario
  const handleTimeUp = () => {
    if (!currentScenario) return; // Do nothing if no current scenario

    const conceptIdsArray = Array.isArray(currentScenario.conceptIds)
      ? currentScenario.conceptIds
      : currentScenario.conceptIds
      ? [currentScenario.conceptIds]
      : [];

    // Calculate penalty based on unresolved concepts (minimum 1 part penalty)
    const unresolvedPartsCount =
      conceptIdsArray.length - resolvedConceptsForCurrentScenario.size;
    const penalty = 5 * (unresolvedPartsCount > 0 ? unresolvedPartsCount : 1);

    setScore((s) => Math.max(0, s - penalty)); // Apply penalty (minimum score 0)
    setErrors((e) => e + 1); // Count as an error scenario-wise
    setStreakCount(0); // Break streak

    setShowFeedback({
      type: "error",
      message: `Time's up! -${penalty} points for unfinished scenario.`,
    });
    setNpcMood(2); // Angry NPC

    // Log the scenario timeout
    logInteraction("SCENARIO_TIMEOUT", {
      scenarioId: currentScenario.id,
      unresolvedConceptIds: conceptIdsArray.filter(
        (id) => !resolvedConceptsForCurrentScenario.has(id)
      ),
      penaltyApplied: penalty,
    });

    setIndex((i) => i + 1); // Increment scenario attempt index

    // Remove the timed-out scenario from the active list and set up the next one
    const remaining = scenarios.filter((s) => s.id !== currentScenario.id);
    setScenarios(remaining);
    setupNewScenario(remaining); // Setup the next scenario or trigger game completion

    // Reset feedback, hint, and concept emotions after a delay
    setTimeout(() => {
      setShowFeedback(null);
      setHint(""); // Clear hint
      setNpcMood(1); // Reset NPC mood
      // Reset emotions of concepts that were part of the timed-out scenario and were not resolved
      setConcepts((prev) =>
        prev.map((c) => {
          if (
            conceptIdsArray.includes(c.id) &&
            !resolvedConceptsForCurrentScenario.has(c.id)
          ) {
            return { ...c, emotion: "neutral" }; // Reset unresolved concepts from this scenario
          }
          // Also reset any sad emotions on concepts not related to this scenario timeout
          if (c.emotion === "sad" && !conceptIdsArray.includes(c.id)) {
            return { ...c, emotion: "neutral" };
          }
          return c; // Keep others as they are
        })
      );
    }, 3000);
  };

  // --- NPC Hint Logic ---

  // Fetches a hint from the backend NPC
  const getNpcHint = async () => {
    // Prevent hint if no current scenario, hint is already loading, in cross-domain mode,
    // or if all concepts for the current scenario are already resolved.
    if (
      !currentScenario ||
      isLoadingHint ||
      isCrossDomain ||
      (currentScenario &&
        resolvedConceptsForCurrentScenario.size ===
          currentScenario.conceptIds.length)
    ) {
      // Provide specific feedback if hint is unavailable for a known reason
      if (
        currentScenario &&
        resolvedConceptsForCurrentScenario.size ===
          currentScenario.conceptIds.length
      ) {
        setShowFeedback({
          type: "info",
          message: "All concepts for this scenario are already found!",
        });
      } else if (isCrossDomain) {
        setShowFeedback({
          type: "info",
          message: "Hints are not available in Cross-Domain mode.",
        });
      } else if (!currentScenario) {
        setShowFeedback({
          type: "info",
          message: "No active scenario to get a hint for.",
        });
      }
      setTimeout(() => setShowFeedback(null), 3000);
      return;
    }

    const hintPenalty = 10; // Score penalty for asking for a hint
    setScore((s) => Math.max(0, s - hintPenalty)); // Apply penalty immediately
    setHint("The Requirement Engineer is pondering..."); // Set loading message for the hint
    setNpcMood(1); // Set NPC mood to neutral while thinking
    setIsLoadingHint(true); // Set hint loading state

    // Log the hint request
    logInteraction("HINT_REQUESTED", {
      scenarioId: currentScenario.id,
      unresolvedConceptIds: currentScenario.conceptIds.filter(
        (id) => !resolvedConceptsForCurrentScenario.has(id)
      ),
      penaltyApplied: hintPenalty,
    });

    try {
      const payload = {
        current_scenario: currentScenario,
        resolved_concept_ids_for_current_scenario: Array.from(
          resolvedConceptsForCurrentScenario
        ),
        all_concepts: concepts.map((c) => ({
          id: c.id,
          name: c.name,
          definition: c.definition,
        })), // Send simplified concepts
        is_cross_domain: isCrossDomain, // Tell backend if it's cross-domain mode
        game_mode: gameMode, // Tell backend the game mode
        group_name: groupName, // Tell backend the group name
      };
      const response = await fetch(`${BACKEND_URL}/api/reqsim/npc-hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send payload as JSON
      });

      if (!response.ok) {
        // Handle HTTP errors from hint endpoint
        const errData = await response
          .json()
          .catch(() => ({ error: "Unknown hint error" }));
        throw new Error(
          errData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      const receivedHint =
        data.hint_text || "Hmm, try to look at it from a different angle."; // Use default if no hint text received
      setHint(receivedHint); // Set the received hint text

      // Show feedback message indicating penalty and hint received
      setShowFeedback({
        type: "info",
        message: `-${hintPenalty} points for hint! The Engineer says:`,
      });
      logInteraction("HINT_RECEIVED", {
        scenarioId: currentScenario.id,
        hintText: receivedHint,
      });
    } catch (error) {
      // Handle any errors during the hint fetch
      console.error("Error fetching NPC hint:", error);
      setHint("Sorry, I'm a bit stumped right now! Try your best."); // Show a fallback message
      setShowFeedback({
        type: "error",
        message: `Failed to get hint: ${error.message}`,
      });
      logInteraction("HINT_ERROR", {
        error: error.message,
        scenarioId: currentScenario?.id,
      });
    } finally {
      setIsLoadingHint(false); // Turn off hint loading state
      // NPC mood can remain neutral or change based on success/failure of hint fetch if desired.
    }
  };

  // --- Auto-Complete Game (for testing) ---
  const handleAutoCompleteGame = () => {
    // Prevent auto-completion if game is not initialized or no content exists
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

    logInteraction("AUTO_COMPLETE_GAME_START"); // Log auto-complete start

    let tempScore = score; // Start from current score
    let tempCorrectMatches = correctMatches; // Start from current completed matches
    let tempStreak = streakCount; // Start from current streak
    let tempMaxStreak = maxStreak; // Start from current max streak
    // Clone concepts state to simulate updates without affecting UI until the end
    let updatedConceptsState = JSON.parse(
      JSON.stringify(
        concepts.map((c) => ({
          ...c,
          scenarios: c.scenarios || [],
          emotion: c.emotion || "neutral",
        })) // Preserve existing matched scenarios and emotions
      )
    );
    // Filter out scenarios already completed by the player
    let remainingScenariosToAuto = originalGeneratedScenarios.filter(
      (os) =>
        !gameInteractionsLog.some(
          (
            log // CORRECTED LINE: Using gameInteractionsLog instead of interactionsLog
          ) =>
            (log.actionType === "SCENARIO_FULLY_RESOLVED" ||
              log.actionType === "AUTO_SCENARIO_RESOLVED") &&
            log.scenarioId === os.id
        )
    );

    let newInteractionsLog = [...gameInteractionsLog]; // Continue from the current log

    remainingScenariosToAuto.forEach((scenario, autoIdx) => {
      const scenarioConceptIds = Array.isArray(scenario.conceptIds)
        ? scenario.conceptIds
        : scenario.conceptIds
        ? [scenario.conceptIds]
        : [];
      let pointsForThisScenario = 0;
      let autoResolvedPartsForThisScenario = new Set(); // Track resolved parts within this scenario's auto-completion

      // Log the scenario being 'presented' in auto-complete simulation
      newInteractionsLog.push({
        timestamp: new Date().toISOString(),
        actionType: "AUTO_SCENARIO_PRESENTED",
        scenarioId: scenario.id,
        text: scenario.text,
        conceptIds: scenario.conceptIds,
        currentScore: tempScore,
        currentErrors: errors, // Keep existing error count in log context
        currentStreak: tempStreak,
        gameMode,
        groupName,
        isCrossDomain, // Include game context
        scenariosRemaining: remainingScenariosToAuto.length - autoIdx, // Simulate remaining count
        conceptsResolvedInCurrent: 0, // Starts at 0 for each auto-scenario
      });

      // Simulate dropping each correct concept for the scenario
      scenarioConceptIds.forEach((correctConceptId) => {
        const targetConceptIndex = updatedConceptsState.findIndex(
          (c) => c.id === correctConceptId
        );
        const targetConcept = updatedConceptsState[targetConceptIndex];

        if (
          targetConcept &&
          !autoResolvedPartsForThisScenario.has(correctConceptId)
        ) {
          // Simulate a correct drop that resolves a new part
          autoResolvedPartsForThisScenario.add(correctConceptId); // Mark as resolved for this scenario simulation

          const pointsPerPart = Math.max(
            5,
            Math.round(
              (10 * (scenario.difficulty || 1)) /
                (scenarioConceptIds.length || 1)
            )
          );
          pointsForThisScenario += pointsPerPart; // Add points

          // Update the concept's associated scenarios in the temporary state
          const scenarioExistsInConcept = updatedConceptsState[
            targetConceptIndex
          ].scenarios.find((s) => s.id === scenario.id);
          if (!scenarioExistsInConcept) {
            updatedConceptsState[targetConceptIndex].scenarios.push({
              ...scenario,
              status: "auto-resolved", // Mark as auto-resolved
            });
          }
          updatedConceptsState[targetConceptIndex].emotion = "happy"; // Set emotion to happy

          // Log the simulated successful 'drop'
          newInteractionsLog.push({
            timestamp: new Date().toISOString(),
            actionType: "AUTO_DROP_CORRECT",
            scenarioId: scenario.id,
            droppedConceptId: targetConcept.id,
            droppedConceptName: targetConcept.name,
            expectedConceptIdsInScenario: scenarioConceptIds,
            isCorrectDrop: true,
            isNewPartResolved: true,
            latencyMs: 10, // Simulate minimal latency
            resolvedPartsBeforeDrop: Array.from(
              autoResolvedPartsForThisScenario
            ).filter((id) => id !== correctConceptId),
            currentScore: tempScore + pointsForThisScenario, // Log score *after* this part's points
            gameMode,
            groupName,
            isCrossDomain,
            scenariosRemaining:
              remainingScenariosToAuto.length -
              autoIdx -
              (scenarioConceptIds.length ===
              autoResolvedPartsForThisScenario.size
                ? 1
                : 0),
            conceptsResolvedInCurrent: autoResolvedPartsForThisScenario.size,
          });
        }
      });

      // After simulating all correct drops for the scenario
      tempScore += pointsForThisScenario; // Add total scenario points to the running score
      tempCorrectMatches++; // Count as a fully completed scenario
      tempStreak++; // Increment streak
      if (tempStreak > tempMaxStreak) tempMaxStreak = tempStreak; // Update max streak

      // Log scenario fully resolved in auto-complete
      newInteractionsLog.push({
        timestamp: new Date().toISOString(),
        actionType: "AUTO_SCENARIO_RESOLVED",
        scenarioId: scenario.id,
        currentScore: tempScore, // Log final score for this scenario simulation
        timeToResolve: 1000, // Simulate a time
        resolvedConceptIds: Array.from(autoResolvedPartsForThisScenario),
        pointsEarned: pointsForThisScenario,
        gameMode,
        groupName,
        isCrossDomain,
        scenariosRemaining: remainingScenariosToAuto.length - (autoIdx + 1),
        conceptsResolvedInCurrent: scenarioConceptIds.length,
      });
    });

    // --- Update state with simulation results ---
    setScore(tempScore); // Set final score
    setCorrectMatches(tempCorrectMatches); // Set final count of completed scenarios
    setStreakCount(tempStreak); // Set final streak
    setMaxStreak(tempMaxStreak); // Set final max streak
    setErrors(errors); // Errors are not generated by auto-complete, keep original count
    setNpcMood(0); // Happy at the end of auto-complete
    setConcepts(updatedConceptsState); // Apply the updated concepts state (with associated scenarios and emotions)
    setScenarios([]); // All scenarios are resolved in auto-complete
    setCurrentScenario(null); // No current scenario
    setIndex(totalScenariosInitialCount); // Set index to total count
    setResolvedConceptsForCurrentScenario(new Set()); // Clear resolved concepts for current scenario
    setGameInteractionsLog(newInteractionsLog); // Set the new log including auto-complete events

    setShowFeedback({
      type: "success",
      message: "Game auto-completed for testing!",
    });
    setTimeout(() => setShowFeedback(null), 2000);

    // Trigger the survey/report flow
    // Check if there were scenarios generated initially for this session
    const hadInitialContent = totalScenariosInitialCount > 0;

    if (hadInitialContent && !surveySkippedOrCompleted) {
      // If game had content and survey wasn't done/skipped, show survey
      logInteraction("AUTO_GAME_COMPLETED_PENDING_SURVEY");
      setShowSurveyModal(true);
    } else if (hadInitialContent && surveySkippedOrCompleted) {
      // If game had content and survey was done/skipped, show report
      logInteraction("AUTO_GAME_COMPLETED_SURVEY_DONE");
      setShowReportModal(true);
    } else {
      // If auto-complete was clicked when there was no initial content
      logInteraction("AUTO_COMPLETE_CLICKED_NO_INITIAL_CONTENT");
      // Optionally show report modal anyway, it will be empty or show minimal data
      setShowReportModal(true);
    }
  };

  // --- Survey and Report Logic ---

  // Handles changes in survey form inputs
  const handleSurveyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSurveyData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handles survey submission
  const handleSurveySubmit = async () => {
    setIsSubmittingSurvey(true); // Set submitting state

    // Log survey submission start (hide actual email for privacy in logs if needed)
    logInteraction("SURVEY_SUBMISSION_STARTED", {
      surveyData: {
        ...surveyData,
        email: surveyData.email ? "Provided" : "Not Provided",
      },
    });

    // Prepare payload for backend
    const payload = {
      surveyData, // Include survey responses
      gameStats: {
        // Include final game stats
        score,
        errors,
        maxStreak,
        correctMatches,
        totalScenariosInitialCount,
        gameMode,
        groupName: groupName.trim(), // Use trimmed group name
        isCrossDomain,
      },
      gameInteractionsLog, // Include the full interaction log
      gameContent: {
        // Include details about the game content
        concepts: concepts.map((c) => ({
          id: c.id,
          name: c.name,
          definition: c.definition,
        })), // Send simplified concepts
        originalGeneratedScenarios: originalGeneratedScenarios.map((s) => ({
          ...s,
          text: s.text,
        })), // Send original scenarios
        isCrossDomain: isCrossDomain,
        gameMode: gameMode,
        groupName: groupName.trim(),
        materialsForDisplay: materialsForDisplay, // Include info about loaded materials
      },
      thesisReference: THESIS_TITLE, // Include thesis title for context
      submittedAtClient: new Date().toISOString(), // Timestamp of submission
    };

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/reqsim/save-survey-and-game-data`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload), // Send payload as JSON
        }
      );

      if (!response.ok) {
        // Handle submission errors
        const errData = await response
          .json()
          .catch(() => ({ error: "Unknown submission error" }));
        throw new Error(
          errData.error || `HTTP error! Status: ${response.status}`
        );
      }

      const result = await response.json(); // Parse response

      // --- Submission Success ---
      setShowFeedback({
        type: "success",
        message: "Survey submitted successfully! Thank you.",
      });
      logInteraction("SURVEY_SUBMISSION_SUCCESS", { backendResponse: result }); // Log success
      setSurveySkippedOrCompleted(true); // Mark survey as completed
      setShowSurveyModal(false); // Close survey modal
      setShowReportModal(true); // Show report modal
    } catch (error) {
      // --- Submission Failed ---
      console.error("Error submitting survey:", error);
      setShowFeedback({
        type: "error",
        message: `Survey submission failed: ${error.message}. Please try again.`,
      });
      logInteraction("SURVEY_SUBMISSION_FAILED", {
        error: error.message,
        payloadAttempt: payload,
      }); // Log failure
    } finally {
      setIsSubmittingSurvey(false); // Turn off submitting state
    }
  };

  // Handles skipping the survey
  const handleSkipSurvey = () => {
    logInteraction("SURVEY_SKIPPED"); // Log skipping
    setSurveySkippedOrCompleted(true); // Mark survey as skipped
    setShowSurveyModal(false); // Close survey modal
    setShowReportModal(true); // Show report modal
  };

  // Handles closing the report modal and resets the game
  const handleCloseReportModal = () => {
    setShowReportModal(false); // Close the report modal
    logInteraction("REPORT_CLOSED"); // Log closing the report
    // Reset the game to the initial state (upload panel visible)
    setGameInitialized(false); // Game is no longer initialized
    setMainMaterialFile(null); // Clear file state
    setMainMaterialUploadStatus("Click or Drag & Drop Main Material File...");
    setDomainContextFile(null); // Clear domain context file state
    setDomainContextText(""); // Clear domain context text
    setDomainContextFileStatus(
      "Click or Drag & Drop Domain Context File (Optional)"
    );
    resetGame(); // Perform a full game state reset
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans text-sm">
      {/* Header Section (Scoreboard, Progress) */}
      <header
        ref={headerRef}
        className="bg-gray-800/80 backdrop-blur-md p-3 border-b border-gray-700 sticky top-0 z-20 shadow-lg"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            {/* Logo/Title */}
            <div className="flex items-center">
              <IconAcademicCap className="h-6 w-6 mr-2 text-indigo-400" />
              <h1 className="text-xl font-bold text-indigo-300">REQSIM</h1>
            </div>
            {/* Score/Stats Display */}
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
                    {/* Clone icon to add dynamic class */}
                    {React.cloneElement(item.icon, {
                      className: `h-5 w-5 mr-1 ${item.color}`,
                    })}
                    <p className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-700/70 h-3 rounded-full overflow-hidden shadow-inner relative">
            <motion.div
              className="bg-green-500 h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  totalScenariosInitialCount > 0
                    ? (correctMatches / totalScenariosInitialCount) * 100 // Progress based on fully resolved scenarios
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
          {/* Progress Text */}
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <p>
              Scenarios Resolved: {correctMatches} /{" "}
              {totalScenariosInitialCount}
            </p>
            <p>
              Current Scenario:{" "}
              {/* Display current scenario index, handling completed state */}
              {
                index + 1 > totalScenariosInitialCount && !currentScenario
                  ? totalScenariosInitialCount // If index passed total and no current scenario, show total
                  : totalScenariosInitialCount === 0 // If no scenarios generated, show 0
                  ? 0
                  : Math.min(index + 1, totalScenariosInitialCount) // Otherwise show current index (minned at total)
              }{" "}
              / {totalScenariosInitialCount}
            </p>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="max-w-6xl mx-auto p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
        {/* Feedback Messages (Error, Success, Info) */}
        <AnimatePresence>
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
              {/* Display appropriate icon based on feedback type */}
              {showFeedback.type === "success" && (
                <IconCheckCircle className="h-5 w-5 text-white" />
              )}
              {showFeedback.type === "error" && (
                <IconXCircle className="h-5 w-5 text-white" />
              )}
              {showFeedback.type === "info" && (
                <IconInformationCircle className="h-5 w-5 text-white" />
              )}
              <p className="text-white text-sm font-medium ml-2">
                {showFeedback.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Panel (Setup, Current Scenario, NPC/Hint) */}
        <div className="lg:col-span-1 space-y-4">
          {/* Content Generation Setup Panel (Shown when game is not initialized or loading) */}
          {(!gameInitialized || isLoadingMaterials) && (
            <div className="space-y-4">
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md space-y-3">
                <h2 className="text-md font-semibold text-center text-indigo-300 border-b border-gray-700 pb-2">
                  1. Game Setup & Main Content
                </h2>
                {/* Game Mode Selection */}
                {!isLoadingMaterials && (
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Game Mode:
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setGameMode("single")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          gameMode === "single"
                            ? "bg-indigo-500 text-white ring-1 ring-indigo-300"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        Single Player
                      </button>
                      <button
                        onClick={() => setGameMode("multiplayer")}
                        className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          gameMode === "multiplayer"
                            ? "bg-teal-500 text-white ring-1 ring-teal-300"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        Group Mode
                      </button>
                    </div>
                  </div>
                )}
                {/* Group Name Input (Multiplayer mode) */}
                {gameMode === "multiplayer" && !isLoadingMaterials && (
                  <div className="mb-2">
                    <label
                      htmlFor="groupNameInput"
                      className="block text-xs font-medium text-gray-300 mb-1"
                    >
                      Group/Session Name:
                    </label>
                    <input
                      type="text"
                      id="groupNameInput"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-gray-200 text-xs rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., CS401_GroupAlpha"
                      disabled={isLoadingMaterials}
                    />
                  </div>
                )}
                {/* Main Material Upload Area */}
                <div className="pt-2">
                  <label
                    htmlFor="mainMaterialInputButton"
                    className="block text-xs font-medium text-gray-300 mb-1.5"
                  >
                    {isCrossDomain
                      ? "Primary Content (Optional)"
                      : "Main Course Material *"}{" "}
                    {/* Required in RE mode */}
                  </label>
                  <div
                    className={`p-3 bg-gray-700/40 rounded-md border-2 border-dashed border-blue-500/70 transition-all ${
                      isLoadingMaterials
                        ? "opacity-50"
                        : "hover:border-blue-400 cursor-pointer"
                    }`}
                    onClick={
                      () =>
                        !isLoadingMaterials &&
                        mainMaterialInputRef.current?.click() // Trigger file input click
                    }
                    onDrop={handleMainMaterialDrop}
                    onDragOver={handleMainDragOver}
                    onDragLeave={handleMainDragLeave}
                  >
                    <input
                      type="file"
                      ref={mainMaterialInputRef} // Ref attached here
                      onChange={handleMainMaterialFileChange}
                      className="hidden"
                      disabled={isLoadingMaterials}
                      accept=".txt,.pdf,.pptx,.ppt" // Accepted file types
                    />
                    <div className="flex items-center text-xs text-blue-300 justify-center">
                      <IconFolder className="h-4 w-4 mr-1 text-blue-400" />
                      <span className="truncate flex-1 ml-1.5">
                        {mainMaterialFile
                          ? `File: ${mainMaterialFile.name}`
                          : mainMaterialUploadStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md space-y-3">
                <h2 className="text-md font-semibold text-center text-sky-300 border-b border-gray-700 pb-2">
                  2. Scenario Customization
                </h2>
                {/* Domain Context Text Area */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Domain-Specific Context (Optional):
                  </label>
                  <textarea
                    value={domainContextText}
                    onChange={(e) => {
                      setDomainContextText(e.target.value);
                      // Clear file if user starts typing text
                      if (domainContextFile) {
                        setDomainContextFile(null);
                        setDomainContextFileStatus(
                          "Click or Drag & Drop Domain Context File (Optional)"
                        );
                      }
                    }}
                    disabled={isLoadingMaterials}
                    placeholder="Type domain details (e.g., healthcare project specifics)..."
                    className="w-full h-20 bg-gray-700/40 border border-gray-600/50 text-gray-200 text-xs rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 resize-none mb-1"
                  />
                  {/* Domain Context File Upload Area */}
                  <div
                    className={`p-3 bg-gray-700/40 rounded-md border-2 border-dashed border-sky-500/70 transition-all ${
                      isLoadingMaterials
                        ? "opacity-50"
                        : "hover:border-sky-400 cursor-pointer"
                    }`}
                    onClick={
                      () =>
                        !isLoadingMaterials &&
                        domainContextFileInputRef.current?.click() // Trigger file input click
                    }
                    onDrop={handleDomainContextFileDrop}
                    onDragOver={handleDomainContextDragOver}
                    onDragLeave={handleDomainContextDragLeave}
                  >
                    <input
                      type="file"
                      ref={domainContextFileInputRef} // Ref attached here
                      onChange={handleDomainContextFileChange}
                      className="hidden"
                      disabled={isLoadingMaterials}
                      accept=".txt,.pdf,.pptx,.ppt" // Accepted file types
                    />
                    <div className="flex items-center text-xs text-sky-300 justify-center">
                      <IconFolder className="h-4 w-4 mr-1 text-sky-400" />
                      <span className="truncate flex-1 ml-1.5">
                        {domainContextFile
                          ? `Context File: ${domainContextFile.name}`
                          : domainContextFileStatus}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Cross-Domain Checkbox */}
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
                      Generate General / Cross-Domain Content
                    </label>
                  </div>
                </div>
              </div>
              {/* Generate Game Content Button */}
              <button
                onClick={triggerContentGeneration}
                disabled={
                  isLoadingMaterials || // Disable if loading
                  (!mainMaterialFile && // Disable if no main file AND
                    !domainContextText.trim() && // no text AND
                    !domainContextFile) || // no domain file (needs *some* input for generation)
                  (gameMode === "multiplayer" && !groupName.trim()) // Disable if multiplayer and no group name
                }
                className="w-full mt-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold p-2.5 rounded-md transition-colors flex items-center justify-center shadow hover:shadow-md"
              >
                {isLoadingMaterials ? (
                  // Loading spinner
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
                  <IconPlusCircle className="h-5 w-5 mr-2" />
                )}
                {isLoadingMaterials ? "Processing..." : "Generate Game Content"}
              </button>
              {/* Loading/Upload Status Message */}
              {isLoadingMaterials && (
                <p className="text-xs text-center text-blue-300 mt-2">
                  {uploadStatus}
                </p>
              )}
            </div>
          )}

          {/* Active Content Display (Shown when game is initialized and not loading) */}
          {gameInitialized &&
            !isLoadingMaterials &&
            materialsForDisplay.length > 0 && (
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
                <h3 className="text-sm font-semibold mb-1 text-blue-300 flex items-center">
                  <IconBeaker className="h-4 w-4 mr-1" /> Active Content Drivers
                </h3>
                {/* List of loaded materials */}
                {materialsForDisplay.map((fileInfo, i) => (
                  <div
                    key={i}
                    className="truncate px-2 py-1.5 bg-gray-700/60 rounded-md flex items-center text-xs shadow-sm mt-1"
                  >
                    <IconDocument className="h-4 w-4 mr-1 text-gray-400" />
                    <span
                      className="ml-1.5 flex-grow truncate"
                      title={fileInfo.name}
                    >
                      {fileInfo.name}
                      <span className="text-gray-400">({fileInfo.type})</span>
                    </span>
                  </div>
                ))}
                {/* Content Focus and Game Mode Display */}
                <div className="mt-2 text-xs text-gray-400">
                  Content Focus:
                  {isCrossDomain ? "Cross-Domain" : "Requirements Engineering"}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  Game Mode:
                  {gameMode === "multiplayer"
                    ? `Group (${groupName || "Unnamed"})`
                    : "Single Player"}
                </div>
              </div>
            )}

          {/* Current Scenario Panel (Shown when game initialized, not loading, and there's a current scenario) */}
          {gameInitialized && concepts.length > 0 && !isLoadingMaterials ? (
            <>
              <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/70 shadow-md">
                <h2 className="text-lg font-semibold mb-2 flex items-center text-indigo-300">
                  <IconClipboardList className="h-6 w-6 mr-2" /> Current
                  Scenario
                </h2>
                {currentScenario ? (
                  <motion.div
                    // Key changes to trigger re-render animation on scenario or part completion
                    key={
                      currentScenario.id +
                      "-" +
                      resolvedConceptsForCurrentScenario.size
                    }
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-700/80 rounded-md cursor-grab shadow border border-gray-600/70 hover:shadow-indigo-500/30"
                    draggable // Make scenario draggable
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
                    {/* Scenario Text */}
                    <div className="flex items-start mb-1.5">
                      <IconDragHandle className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-100 leading-normal">
                        {currentScenario.text}
                      </p>
                    </div>
                    {/* Concepts Info */}
                    <div className="mt-2 text-xs text-indigo-300">
                      Relates to: {currentScenario.conceptIds.length} concept(s)
                    </div>
                    {currentScenario.conceptIds.length > 0 && (
                      <div className="text-xs text-green-400 mt-0.5">
                        Found: {resolvedConceptsForCurrentScenario.size} /{" "}
                        {currentScenario.conceptIds.length}
                      </div>
                    )}

                    {/* Difficulty Display */}
                    <div className="mt-1.5 text-xs text-blue-300 flex items-center justify-between">
                      <span>Difficulty:</span>
                      <span className="flex">
                        {/* Render stars based on difficulty level */}
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
                    {/* Countdown Timer */}
                    <div className="mt-3 pt-2 border-t border-gray-600/50">
                      <CountdownTimer
                        // Key ensures timer resets on new scenario or partial completion
                        key={`timer-${currentScenario.id}-${resolvedConceptsForCurrentScenario.size}`}
                        minutes={1} // Set scenario time limit (1 minute)
                        onTimeUp={handleTimeUp} // Handler for time up
                        isPaused={
                          timePaused ||
                          !currentScenario ||
                          resolvedConceptsForCurrentScenario.size ===
                            currentScenario.conceptIds.length
                        } // Pause conditions
                      />
                    </div>
                  </motion.div>
                ) : (
                  // Message when all scenarios are completed
                  <div className="p-3 bg-gray-700/80 rounded-md text-gray-400 text-center italic">
                    All scenarios completed! View your report below.
                  </div>
                )}
              </div>

              {/* NPC and Hint Panel (Shown when game initialized, not loading, RE mode, and there's a current scenario) */}
              {currentScenario && !isCrossDomain && (
                <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-green-500/50 shadow-md">
                  {/* NPC Info and Emotion Face */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <IconUserCircle className="h-8 w-8 mr-2 text-green-400" />
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
                  {/* Ask for Hint Button */}
                  <button
                    onClick={getNpcHint}
                    disabled={
                      !currentScenario || // Disable if no current scenario
                      isLoadingHint || // Disable if hint is loading
                      isCrossDomain || // Disable in cross-domain mode
                      (currentScenario &&
                        resolvedConceptsForCurrentScenario.size ===
                          currentScenario.conceptIds.length) // Disable if current scenario is already fully resolved
                    }
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white text-sm font-semibold p-2.5 rounded-md transition-colors flex items-center justify-center shadow hover:shadow-md"
                  >
                    {isLoadingHint ? (
                      // Loading spinner for hint
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
                      <IconLightBulb className="h-5 w-5 mr-2" />
                    )}
                    {isLoadingHint
                      ? "The Engineer is Pondering..."
                      : "Ask for Hint (-10pts)"}
                  </button>
                  {/* Hint Display */}
                  <AnimatePresence>
                    {hint && !isLoadingHint && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.1 }}
                        className="mt-3 p-2.5 bg-gray-700/80 rounded-md text-xs border-l-4 border-yellow-400 shadow-sm"
                      >
                        {/* Only show "Hint:" label if it's not part of the feedback message */}
                        {showFeedback &&
                        showFeedback.type === "info" &&
                        showFeedback.message.includes(
                          "Engineer says"
                        ) ? null : (
                          <p className="text-yellow-300 flex items-start mb-0.5">
                            <IconInformationCircle className="h-4 w-4 mr-1" />
                            <span className="font-semibold ml-1">Hint:</span>
                          </p>
                        )}
                        <p
                          className={`pl-${
                            showFeedback &&
                            showFeedback.type === "info" &&
                            showFeedback.message.includes("Engineer says")
                              ? "0" // No extra padding if hint is part of feedback
                              : "7" // Add padding if hint is separate
                          } text-gray-300`}
                        >
                          {hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* Message shown when game is initialized, not loading, but all scenarios are complete */}
              {!currentScenario &&
                gameInitialized &&
                totalScenariosInitialCount > 0 &&
                !isLoadingMaterials && (
                  <div className="bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg border border-yellow-500/70 shadow-md text-center text-gray-400 italic">
                    All scenarios completed! Your game session is over. Please
                    view the report.
                  </div>
                )}
            </>
          ) : (
            // Message shown when game is not initialized and not loading materials
            !isLoadingMaterials && (
              <div className="lg:col-span-4 flex flex-col items-center justify-center min-h-[400px] bg-gray-800/50 rounded-lg p-6">
                <IconAcademicCap className="h-16 w-16 text-indigo-400 mb-4 opacity-70" />
                <p className="text-xl text-center text-gray-400">
                  Please use the setup panel on the left and click "Generate
                  Game Content" to start REQSIM!
                </p>
              </div>
            )
          )}
        </div>
        {/* End Left Panel */}

        {/* Concepts Display Area (Shown when game initialized, has concepts, and not loading) */}
        {gameInitialized && concepts.length > 0 && !isLoadingMaterials ? (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {concepts.map((concept) => (
              <motion.div
                key={concept.id}
                onDrop={(e) => handleConceptDrop(e, concept)} // Handle scenario drop here
                onDragOver={(e) => {
                  e.preventDefault(); // Prevent default to allow drop
                  setHighlightedConceptId(concept.id); // Highlight concept on drag over
                }}
                onDragLeave={() => setHighlightedConceptId(null)} // Remove highlight on drag leave
                className={`p-3.5 bg-gray-800/70 backdrop-blur-sm rounded-lg border-2 transition-all relative shadow-md hover:shadow-lg ${
                  highlightedConceptId === concept.id
                    ? "border-yellow-400 ring-2 ring-yellow-300/70 bg-gray-700/70 transform scale-105 z-10" // Highlight style
                    : concept.emotion === "happy"
                    ? "border-green-500/70" // Happy style
                    : concept.emotion === "sad"
                    ? "border-red-500/70" // Sad style
                    : "border-gray-700/50" // Default style
                }`}
                // Animation for hover and layout changes
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.25)",
                }}
                layout
              >
                {/* Concept Name and Definition */}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-bold text-indigo-200">
                      {concept.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 italic leading-snug">
                      {concept.definition}
                    </p>
                  </div>
                  {/* Concept Emotion Face */}
                  <div className="w-14 h-14 flex-shrink-0 -mt-1 -mr-1">
                    <EmotionFace emotion={concept.emotion} />
                  </div>
                </div>
                {/* List of Associated Scenarios */}
                {concept.scenarios.length > 0 && (
                  <div className="mt-2 border-t border-gray-700/50 pt-2">
                    <h4 className="text-xs font-semibold mb-1.5 text-green-400 flex items-center">
                      <IconCheckCircle className="w-4 h-4 mr-1" /> Related
                      Scenarios ({concept.scenarios.length}):
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {concept.scenarios.map((s, idx) => (
                        <motion.div
                          // Key for list animation
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
        ) : // Message shown if game initialized but no concepts/scenarios were generated
        gameInitialized && concepts.length === 0 && !isLoadingMaterials ? (
          <div className="lg:col-span-3 flex flex-col items-center justify-center min-h-[400px]">
            <IconXCircle className="h-16 w-16 text-red-400 mb-4 opacity-70" />
            <p className="text-xl text-gray-500 text-center">
              No concepts or scenarios were generated. <br />
              Please try a different file or adjust its content.
            </p>
            {/* Button to reset and try generating content again */}
            <button
              onClick={() => resetGame()}
              className="mt-6 px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition text-sm shadow-md"
            >
              Try New Materials
            </button>
          </div>
        ) : null}
      </main>

      {/* --- Modals --- */}

      {/* Survey Modal */}
      <SurveyModal
        isOpen={showSurveyModal} // Controlled by REQSIM state
        onClose={() => setShowSurveyModal(false)} // Basic close handler (skipping survey is separate)
        surveyData={surveyData} // Pass survey state
        handleSurveyChange={handleSurveyChange} // Pass change handler
        handleSurveySubmit={handleSurveySubmit} // Pass submit handler
        isSubmittingSurvey={isSubmittingSurvey} // Pass submitting state (defined in REQSIM)
        onSkipSurvey={handleSkipSurvey} // Pass skip handler
        concepts={concepts} // Pass concepts for dynamic questions
        isCrossDomain={isCrossDomain} // Pass cross-domain status for conditional questions
        thesisTitle={THESIS_TITLE} // Pass thesis title
      />

      {/* Game Report Modal */}
      <GameReportModal
        isOpen={showReportModal} // Controlled by REQSIM state
        onClose={handleCloseReportModal} // Pass the close report handler
        gameStats={{
          // Pass final game stats
          score,
          errors,
          maxStreak,
          correctMatches,
          totalScenariosInitialCount,
          gameMode,
          groupName,
          isCrossDomain,
        }}
        concepts={concepts} // Pass concepts for concept performance
        originalScenarios={originalGeneratedScenarios} // Pass original scenarios for breakdown
        interactionsLog={gameInteractionsLog} // Pass the full log
        materialsForDisplay={materialsForDisplay} // Pass materials info for source display
        // If you wanted to log report download in REQSIM, you'd add:
        // onDownloadReport={() => logInteraction("REPORT_DOWNLOADED")}
      />

      {/* Auto-Complete Game Button (for testing) */}
      {gameInitialized &&
        currentScenario && // Only show if a game is active and there's a scenario
        (process.env.NODE_ENV === "development" || true) && ( // Show in dev mode or if 'true' for testing builds
          <div className="fixed bottom-4 right-4 z-30">
            <button
              onClick={handleAutoCompleteGame} // Trigger auto-complete
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-lg"
              title="Auto-completes the current game for testing purposes."
              disabled={isLoadingMaterials} // Disable while materials are loading
            >
              <IconCheckCircle className="h-4 w-4 mr-1" /> Auto-Complete Game
              (Test)
            </button>
          </div>
        )}
    </div>
  );
}
