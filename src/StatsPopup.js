// src/components/StatsPopup.jsx
import React, { useState } from "react";

/* ────────────────────────────────────────────────────────────────── */
/*  STATS POPUP COMPONENT                                            */
/* ────────────────────────────────────────────────────────────────── */
const StatsPopup = ({
  score,
  correctAssignments,
  falseSelections,
  decisionTimes,
  pdStats,
  simulationTime,
  onRestart,
}) => {
  /* ── derived numbers ─────────────────────────────────────────── */
  const totalDecisions = decisionTimes.length;
  const totalDecisionTime = decisionTimes.reduce((a, t) => a + t, 0);
  const averageDecisionTime =
    totalDecisions === 0
      ? "0.00"
      : (totalDecisionTime / totalDecisions / 1000).toFixed(2);

  /* ── local state ─────────────────────────────────────────────── */
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    gender: "",
    education: "",
    reqEngExperience: "",
    productDesignExperience: "",
    industry: "",
    status: "",
    familiarity: "",
    difficulty: "",
    strategy: "",
    engagement: "",
    realism: "",
    comments: "",
    // Post-quiz responses
    quiz1: "",
    quiz2: "",
    quiz3: "",
    quiz4: "",
    quiz5: "",
    reConfidence: "",
    pdConfidence: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  /* ── helpers ─────────────────────────────────────────────────── */
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── submit handler  (send to Flask) ─────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError("");
    setIsSending(true);

    const payload = {
      formData: formData, // includes post-quiz responses
      gameStats: {
        score,
        correctAssignments,
        falseSelections,
        totalDecisions,
        averageDecisionTime: Number(averageDecisionTime),
        simulationTime: Number(simulationTime),
        pdStats, // { timeTaken, correctMatches, falseMatches }
      },
    };

    try {
      const res = await fetch(
        "https://ishanvimukthi.pythonanywhere.com/api/save-results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setFormSubmitted(true); // show thank‑you screen
    } catch (err) {
      console.error(err);
      setSendError("❌ Could not upload data, please try again.");
      /*  ► If you want to proceed even on error, uncomment: */
      // setFormSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  /* ── quiz options ────────────────────────────────────────────── */
  const quizOptions = {
    quiz1: [
      "Writing backend code",
      "Managing cloud infrastructure",
      "Translating user needs into product features",
      "Testing software",
    ],
    quiz2: [
      "Minimize dev costs by cutting requirements",
      "Identify, analyze & validate stakeholder needs",
      "Create ready‑to‑code specs",
      "Eliminate need for testing",
    ],
    quiz3: [
      "Guess at their intent",
      "Document your assumptions & later validate",
      "Restart the project",
      "Ignore the issue",
    ],
    quiz4: [
      "Refactoring backend code",
      "Removing unnecessary requirements",
      "Splitting complex features into smaller tasks",
      "Writing design docs",
    ],
    quiz5: [
      "Stakeholders never get frustrated",
      "Importance of efficient, thoughtful questions",
      "You can ask unlimited hints",
      "Always escalate to management",
    ],
    confidence: ["1", "2", "3", "4", "5"],
  };

  /* ── render ──────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-11/12 max-w-4xl overflow-hidden">
        {/* header */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <span className="text-4xl mr-2">🎉</span> Game Complete!
          </h2>
          <p className="text-blue-100">
            Thanks for participating in our research study!
          </p>
        </header>

        {!formSubmitted ? (
          /* ────────────── SURVEY & POST QUIZ FORM ────────────── */
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-6">
              Research Participant Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address*"
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="your.email@example.com"
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Age*"
                  name="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Gender*"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  options={[
                    "Male",
                    "Female",
                    "Non-binary",
                    "Other",
                    "Prefer not to say",
                  ]}
                />
                <Select
                  label="Highest Education Level*"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  options={[
                    "High School",
                    "Bachelor's Degree",
                    "Master's Degree",
                    "PhD",
                    "Other",
                  ]}
                />
              </div>

              {/* PROFESSIONAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Requirement Engineering Experience (years)*"
                  name="reqEngExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.reqEngExperience}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Product Design Experience (years)*"
                  name="productDesignExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.productDesignExperience}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Industry*"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  options={[
                    "Software Engineering",
                    "Product Management",
                    "UX/UI Design",
                    "Systems Engineering",
                    "Game Development",
                    "Healthcare IT",
                    "Financial Technology",
                    "Automotive",
                    "Aerospace & Defense",
                    "Telecommunications",
                    "Other",
                  ]}
                />
                <Select
                  label="Professional Status*"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  options={[
                    "Student",
                    "Junior Professional (0-3 years)",
                    "Mid-level Professional (4-7 years)",
                    "Senior Professional (8+ years)",
                    "Manager/Director",
                    "Executive",
                    "Researcher",
                    "Educator",
                    "Other",
                  ]}
                />
              </div>

              {/* GAME EXPERIENCE */}
              <SectionTitle>Game Experience Assessment</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Familiarity with this type of simulation?*"
                  name="familiarity"
                  value={formData.familiarity}
                  onChange={handleChange}
                  required
                  options={[
                    "Not at all familiar",
                    "Slightly familiar",
                    "Moderately familiar",
                    "Very familiar",
                    "Extremely familiar",
                  ]}
                />
                <Select
                  label="How difficult was the simulation?*"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  options={[
                    "Very easy",
                    "Easy",
                    "Moderate",
                    "Difficult",
                    "Very difficult",
                  ]}
                />
              </div>

              <TextArea
                label="Strategy to complete the simulation*"
                name="strategy"
                value={formData.strategy}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Select
                  label="Engagement level*"
                  name="engagement"
                  value={formData.engagement}
                  onChange={handleChange}
                  required
                  options={[
                    "Not engaged at all",
                    "Slightly engaged",
                    "Moderately engaged",
                    "Very engaged",
                    "Extremely engaged",
                  ]}
                />
                <Select
                  label="Realism level*"
                  name="realism"
                  value={formData.realism}
                  onChange={handleChange}
                  required
                  options={[
                    "Not realistic at all",
                    "Slightly realistic",
                    "Moderately realistic",
                    "Very realistic",
                    "Extremely realistic",
                  ]}
                />
              </div>

              {/* POST-SIMULATION QUIZ */}
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mt-8 mb-4">
                Post‑Simulation Quiz
              </h3>
              <div className="space-y-4">
                {["quiz1", "quiz2", "quiz3", "quiz4", "quiz5"].map((key) => (
                  <Select
                    key={key}
                    label={(() => {
                      switch (key) {
                        case "quiz1":
                          return "Which best describes a product designer's role?*";
                        case "quiz2":
                          return "What is the primary goal of requirement engineering?*";
                        case "quiz3":
                          return "Which practice helps when a stakeholder refuses to clarify requirements?*";
                        case "quiz4":
                          return "Requirement decomposition means:*";
                        case "quiz5":
                          return "In this simulation, what did the '5‑tries' stakeholder mechanic teach you?*";
                        default:
                          return "";
                      }
                    })()}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                    options={quizOptions[key]}
                  />
                ))}
                <Select
                  label="After playing, how confident are you in your Requirements Engineering skills?*"
                  name="reConfidence"
                  value={formData.reConfidence}
                  onChange={handleChange}
                  required
                  options={quizOptions.confidence}
                />
                <Select
                  label="After playing, how confident are you in your Product Design skills?*"
                  name="pdConfidence"
                  value={formData.pdConfidence}
                  onChange={handleChange}
                  required
                  options={quizOptions.confidence}
                />
              </div>

              <TextArea
                label="Additional Comments or Feedback"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />

              {sendError && <p className="text-red-500 text-sm">{sendError}</p>}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-blue-600 disabled:opacity-60 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow-md"
                >
                  {isSending ? "Uploading…" : "Submit Research Data"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ────────────── THANK‑YOU + STATS ────────────── */
          <ThankYou
            score={score}
            correctAssignments={correctAssignments}
            falseSelections={falseSelections}
            totalDecisions={totalDecisions}
            averageDecisionTime={averageDecisionTime}
            simulationTime={simulationTime}
            pdStats={pdStats}
            onRestart={onRestart}
          />
        )}
      </div>
    </div>
  );
};

/* ── tiny re‑usables ───────────────────────────────────────────── */
const Input = (props) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {props.label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    />
  </div>
);

const Select = ({ label, options, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      {...rest}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    >
      <option value="">Select option</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, ...rest }) => (
  <div className="pt-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      {...rest}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-24"
    />
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-lg font-medium text-gray-800 dark:text-white mt-8 mb-3">
    {children}
  </h4>
);

/* ── thank‑you block ───────────────────────────────────────────── */
const ThankYou = ({
  score,
  correctAssignments,
  falseSelections,
  totalDecisions,
  averageDecisionTime,
  simulationTime,
  pdStats,
  onRestart,
}) => (
  <div className="p-6">
    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
      <span className="text-green-500 mr-2">✓</span> Thank you for your
      participation!
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-8">
      Your responses have been recorded and will contribute to our research.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <StatsCard
        title="Requirement Engineering Performance"
        rows={[
          ["Total Score", score],
          ["Correct Decisions", correctAssignments],
          ["Incorrect Decisions", falseSelections],
          ["Total Decisions", totalDecisions],
          ["Avg. Decision Time", `${averageDecisionTime} s`],
          ["Total Time", `${simulationTime} s`],
        ]}
      />
      <StatsCard
        title="Product Design Performance"
        rows={[
          ["Time Taken", `${pdStats.timeTaken} s`],
          ["Correct Matches", pdStats.correctMatches],
          ["Incorrect Matches", pdStats.falseMatches],
        ]}
      />
    </div>

    <div className="mt-8 text-center">
      <button
        onClick={onRestart}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-8 rounded-xl shadow-lg"
      >
        Play Again
      </button>
    </div>
  </div>
);

const StatsCard = ({ title, rows }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
      <span className="mr-2">📊</span> {title}
    </h3>
    <div className="space-y-3">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between items-center border-b last:border-none border-gray-200 dark:border-gray-600 pb-2 last:pb-0"
        >
          <span className="text-gray-600 dark:text-gray-300">{k}</span>
          <span className="font-medium text-gray-900 dark:text-white">{v}</span>
        </div>
      ))}
    </div>
  </div>
);

export default StatsPopup;
