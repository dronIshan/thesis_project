import React from "react";
import { motion } from "framer-motion";

const EmotionFace = ({ emotion }) => {
  const getEyebrowPath = (leftStart, leftEnd, rightStart, rightEnd) => {
    return {
      left: `M60,${leftStart} Q70,${leftEnd} 80,${leftStart}`,
      right: `M120,${rightStart} Q130,${rightEnd} 140,${rightStart}`,
    };
  };

  const getMouthPath = (start, middle, end) => {
    return `M70,${start} Q100,${middle} 130,${end}`;
  };

  const emotions = {
    neutral: {
      eyebrows: getEyebrowPath(65, 65, 65, 65),
      mouth: getMouthPath(130, 130, 130),
    },
    happy: {
      eyebrows: getEyebrowPath(60, 55, 60, 55),
      mouth: getMouthPath(130, 150, 130),
    },
    sad: {
      eyebrows: getEyebrowPath(70, 75, 70, 75),
      mouth: getMouthPath(140, 120, 140),
    },
    fearful: {
      // This was not in your game's logic but present in EmotionFace
      eyebrows: getEyebrowPath(55, 50, 55, 50),
      mouth: getMouthPath(130, 110, 130),
    },
    angry: {
      eyebrows: getEyebrowPath(60, 70, 60, 70), // Adjusted based on likely intent for anger
      mouth: getMouthPath(135, 125, 135), // Slightly adjusted for a more downturned/angry mouth
    },
    surprised: {
      // This was not in your game's logic but present in EmotionFace
      eyebrows: getEyebrowPath(50, 45, 50, 45),
      mouth: getMouthPath(140, 170, 140), // Typically a rounder mouth for surprise
    },
    disgusted: {
      // This was not in your game's logic but present in EmotionFace
      eyebrows: getEyebrowPath(60, 65, 65, 60),
      mouth: getMouthPath(135, 115, 140),
    },
    // Add more emotions if needed
  };

  const currentEmotion = emotions[emotion] || emotions.neutral;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      // MODIFICATION: SVG scales to the size of its parent container
      className="w-full h-full"
    >
      <circle
        cx="100"
        cy="100"
        // MODIFICATION: Slightly reduced radius for more visual padding within the viewBox
        r="75"
        stroke="black"
        strokeWidth="4"
        fill="white"
      />
      {/* Eyes */}
      <g id="leftEyeGroup" transform="translate(70,80)">
        <motion.circle
          id="leftEye"
          cx="0"
          cy="0"
          r="10"
          fill="black"
          animate={{ scale: [1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            // Blink quickly, then wait
            times: [0, 0.05, 0.1, 1], // Adjusted times for a more natural blink interval
          }}
        />
      </g>
      <g id="rightEyeGroup" transform="translate(130,80)">
        <motion.circle
          id="rightEye"
          cx="0"
          cy="0"
          r="10"
          fill="black"
          animate={{ scale: [1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            delay: 0.02, // Slight delay for the second eye for natural blink
            times: [0, 0.05, 0.1, 1], // Adjusted times
          }}
        />
      </g>
      {/* Mouth */}
      <motion.path
        id="mouth"
        d={currentEmotion.mouth}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.mouth }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }} // Adjusted spring
      />
      {/* Eyebrows */}
      <motion.path
        id="leftEyebrow"
        d={currentEmotion.eyebrows.left}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.eyebrows.left }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }} // Adjusted spring
      />
      <motion.path
        id="rightEyebrow"
        d={currentEmotion.eyebrows.right}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.eyebrows.right }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }} // Adjusted spring
      />
    </svg>
  );
};

export default EmotionFace;
