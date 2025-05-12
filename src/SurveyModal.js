import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconClipboardDocumentList,
  IconChevronRight,
  IconChevronLeft,
  IconInformationCircle,
} from "./icons"; // Assuming icons.js is in the same directory

const LikertScale = ({ name, question, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {question}
    </label>
    <div className="flex flex-wrap justify-between items-center space-x-1 text-xs">
      {[
        "Strongly Disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly Agree",
      ].map((label, index) => (
        <label
          key={index}
          className="flex flex-col items-center cursor-pointer p-1.5 rounded hover:bg-gray-600/50 transition-colors min-w-[18%] text-center"
        >
          <input
            type="radio"
            name={name}
            value={index + 1}
            checked={String(value) === String(index + 1)}
            onChange={onChange}
            className="form-radio h-3.5 w-3.5 text-indigo-500 bg-gray-700 border-gray-600 focus:ring-indigo-400 mb-1"
          />
          <span
            className={
              String(value) === String(index + 1)
                ? "text-indigo-300 font-medium"
                : "text-gray-400"
            }
          >
            {label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default function SurveyModal({
  isOpen,
  onClose,
  surveyData,
  handleSurveyChange,
  handleSurveySubmit,
  isSubmittingSurvey,
  onSkipSurvey,
  concepts, // Pass concepts down
  isCrossDomain, // Pass isCrossDomain down
  thesisTitle, // Pass thesisTitle down
}) {
  const [surveyStep, setSurveyStep] = useState(1);
  const totalSurveySteps = 2;

  useEffect(() => {
    // Reset to step 1 when modal opens
    if (isOpen) {
      setSurveyStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextSurveyStep = () =>
    setSurveyStep((s) => Math.min(s + 1, totalSurveySteps));
  const prevSurveyStep = () => setSurveyStep((s) => Math.max(s - 1, 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      <motion.div
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-gray-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        <div className="text-center border-b border-gray-700 pb-3 mb-4">
          <IconClipboardDocumentList className="mx-auto h-8 w-8 text-blue-400 mb-2" />
          <h2 className="text-xl font-bold text-blue-300">
            Post-Game Survey (Step {surveyStep}/{totalSurveySteps})
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Your feedback is crucial for the research: "{thesisTitle}". All data
            will be handled confidentially.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (surveyStep === totalSurveySteps) handleSurveySubmit();
            else nextSurveyStep();
          }}
        >
          {surveyStep === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 text-sm"
            >
              <h3 className="text-md font-semibold text-indigo-300 mb-2">
                About You
              </h3>
              <div>
                <label
                  htmlFor="surveyEmail"
                  className="block text-xs font-medium"
                >
                  Email (Optional - for potential follow-up only):
                </label>
                <input
                  type="email"
                  name="email"
                  id="surveyEmail"
                  value={surveyData.email}
                  onChange={handleSurveyChange}
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="surveyAge"
                  className="block text-xs font-medium"
                >
                  Age:
                </label>
                <input
                  type="number"
                  name="age"
                  id="surveyAge"
                  value={surveyData.age}
                  onChange={handleSurveyChange}
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="surveyGender"
                  className="block text-xs font-medium"
                >
                  Gender:
                </label>
                <select
                  name="gender"
                  id="surveyGender"
                  value={surveyData.gender}
                  onChange={handleSurveyChange}
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="surveyEducation"
                  className="block text-xs font-medium"
                >
                  Highest Level of Education:
                </label>
                <select
                  name="education"
                  id="surveyEducation"
                  value={surveyData.education}
                  onChange={handleSurveyChange}
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select...</option>
                  <option value="high_school">High School</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="vocational">
                    Vocational/Technical Training
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              {!isCrossDomain && (
                <LikertScale
                  name="reFamiliarity"
                  question="How familiar are you with Requirements Engineering concepts?"
                  value={surveyData.reFamiliarity}
                  onChange={handleSurveyChange}
                />
              )}
            </motion.div>
          )}

          {surveyStep === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 text-sm"
            >
              <h3 className="text-md font-semibold text-indigo-300 mb-2">
                Simulation Feedback
              </h3>
              {!isCrossDomain ? (
                <>
                  {/* This logic maps only the first concept for a specific question.
                      If you want a question per concept, you'd adjust this mapping.
                      Or keep it as is for a general question about concepts from the material.
                   */}
                  {concepts.slice(0, 1).map((c) => (
                    <LikertScale
                      key={c.id}
                      name={`reConceptUnderstand_${c.id}`}
                      question={`Did the game help you understand the concept: "${c.name}"?`}
                      value={surveyData[`reConceptUnderstand_${c.id}`] || ""}
                      onChange={handleSurveyChange}
                    />
                  ))}
                  <LikertScale
                    name="reScenarioClarity"
                    question="The scenarios clearly related to the RE concepts."
                    value={surveyData.reScenarioClarity}
                    onChange={handleSurveyChange}
                  />
                  <LikertScale
                    name="reGameplayEngagement"
                    question="The RE-focused gameplay was engaging."
                    value={surveyData.reGameplayEngagement}
                    onChange={handleSurveyChange}
                  />
                  <LikertScale
                    name="rePrinciplesImprovement"
                    question="The game improved my understanding of RE principles."
                    value={surveyData.rePrinciplesImprovement}
                    onChange={handleSurveyChange}
                  />
                  <div>
                    <label className="block text-xs font-medium">
                      What RE concepts would you like to see more of, or
                      explained differently?
                    </label>
                    <textarea
                      name="reConceptRequests"
                      value={surveyData.reConceptRequests}
                      onChange={handleSurveyChange}
                      rows="2"
                      className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-medium">
                      Other feedback on the RE learning aspect?
                    </label>
                    <textarea
                      name="reOtherFeedback"
                      value={surveyData.reOtherFeedback}
                      onChange={handleSurveyChange}
                      rows="2"
                      className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <LikertScale
                    name="generalGameplayEngagement"
                    question="The gameplay was engaging."
                    value={surveyData.generalGameplayEngagement}
                    onChange={handleSurveyChange}
                  />
                  <LikertScale
                    name="interfaceUserFriendliness"
                    question="The game interface was user-friendly."
                    value={surveyData.interfaceUserFriendliness}
                    onChange={handleSurveyChange}
                  />
                  <div>
                    <label className="block text-xs font-medium">
                      Were the game instructions clear?
                    </label>
                    <select
                      name="instructionsClear"
                      value={surveyData.instructionsClear}
                      onChange={handleSurveyChange}
                      className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes, very clear</option>
                      <option value="mostly">Mostly clear</option>
                      <option value="partially">Partially clear</option>
                      <option value="no">Not clear</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium">
                  Did you encounter any technical issues or bugs? If so, please
                  describe.
                </label>
                <textarea
                  name="technicalIssues"
                  value={surveyData.technicalIssues}
                  onChange={handleSurveyChange}
                  rows="2"
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <LikertScale
                name="recommendLikelihood"
                question="How likely are you to recommend this simulation for learning?"
                value={surveyData.recommendLikelihood}
                onChange={handleSurveyChange}
              />
              <div>
                <label className="block text-xs font-medium">
                  What did you like most about the simulation?
                </label>
                <textarea
                  name="likedMost"
                  value={surveyData.likedMost}
                  onChange={handleSurveyChange}
                  rows="2"
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium">
                  What could be improved in the simulation?
                </label>
                <textarea
                  name="couldBeImproved"
                  value={surveyData.couldBeImproved}
                  onChange={handleSurveyChange}
                  rows="2"
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium">
                  Any other comments or suggestions?
                </label>
                <textarea
                  name="otherComments"
                  value={surveyData.otherComments}
                  onChange={handleSurveyChange}
                  rows="2"
                  className="mt-1 w-full bg-gray-700 border-gray-600 rounded-md p-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </motion.div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
            <button
              type="button"
              onClick={prevSurveyStep}
              disabled={surveyStep === 1 || isSubmittingSurvey}
              className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <IconChevronLeft className="mr-1 h-4 w-4" /> Previous
            </button>
            <button
              type="submit"
              disabled={isSubmittingSurvey}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isSubmittingSurvey
                ? "Submitting..."
                : surveyStep === totalSurveySteps
                ? "Submit Survey"
                : "Next"}
              {surveyStep < totalSurveySteps && !isSubmittingSurvey && (
                <IconChevronRight className="ml-1 h-4 w-4" />
              )}
            </button>
          </div>
        </form>
        <button
          onClick={onSkipSurvey}
          disabled={isSubmittingSurvey}
          className="w-full mt-3 text-center text-xs text-gray-400 hover:text-gray-200 underline"
        >
          Skip Survey & View Report
        </button>
      </motion.div>
    </motion.div>
  );
}
