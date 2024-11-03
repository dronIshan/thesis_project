import React from 'react';
import { motion } from 'framer-motion';

const EmotionFace = ({ emotion }) => {
  const getEyebrowPath = (leftStart, leftEnd, rightStart, rightEnd) => {
    return {
      left: `M60,${leftStart} Q70,${leftEnd} 80,${leftStart}`,
      right: `M120,${rightStart} Q130,${rightEnd} 140,${rightStart}`
    };
  };

  const getMouthPath = (start, middle, end) => {
    return `M70,${start} Q100,${middle} 130,${end}`;
  };

  const emotions = {
    neutral: {
      eyebrows: getEyebrowPath(65, 65, 65, 65),
      mouth: getMouthPath(130, 130, 130)
    },
    happy: {
      eyebrows: getEyebrowPath(60, 55, 60, 55),
      mouth: getMouthPath(130, 150, 130)
    },
    sad: {
      eyebrows: getEyebrowPath(70, 75, 70, 75),
      mouth: getMouthPath(140, 120, 140)
    },
    fearful: {
      eyebrows: getEyebrowPath(55, 50, 55, 50),
      mouth: getMouthPath(130, 110, 130)
    },
    angry: {
      eyebrows: getEyebrowPath(60, 70, 60, 70),
      mouth: getMouthPath(135, 145, 135)
    },
    surprised: {
      eyebrows: getEyebrowPath(50, 45, 50, 45),
      mouth: getMouthPath(140, 170, 140)
    },
    disgusted: {
      eyebrows: getEyebrowPath(60, 65, 65, 60),
      mouth: getMouthPath(135, 115, 140)
    }
    // Add more emotions if needed
  };

  const currentEmotion = emotions[emotion] || emotions.neutral;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="w-32 h-32"
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="black"
        strokeWidth="4"
        fill="white"
      />
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
            times: [0, 0.1, 0.2]
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
            times: [0, 0.1, 0.2]
          }}
        />
      </g>
      <motion.path
        id="mouth"
        d={currentEmotion.mouth}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.mouth }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
      <motion.path
        id="leftEyebrow"
        d={currentEmotion.eyebrows.left}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.eyebrows.left }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
      <motion.path
        id="rightEyebrow"
        d={currentEmotion.eyebrows.right}
        stroke="black"
        strokeWidth="4"
        fill="transparent"
        initial={false}
        animate={{ d: currentEmotion.eyebrows.right }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
    </svg>
  );
};

export default EmotionFace;
