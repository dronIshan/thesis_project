import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ minutes = 1, onTimeUp }) => {
  const [time, setTime] = useState(minutes * 60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [onTimeUp]);

  useEffect(() => {
    setTime(minutes * 60);
  }, [minutes]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressDegrees = ((minutes * 60 - time) / (minutes * 60)) * 360;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <div style={{ position: 'relative', width: '12rem', height: '12rem', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          style={{
            position: 'absolute',
            inset: '0.5rem',
            borderRadius: '50%',
            background: `conic-gradient(#ef4444 0deg, #ef4444 ${progressDegrees}deg, #f3f4f6 ${progressDegrees}deg, #f3f4f6 360deg)`
          }}
        ></div>
        <div style={{ position: 'absolute', top: 0, left: '50%', width: '0.25rem', height: '1rem', backgroundColor: '#9ca3af', transform: 'translateX(-50%)' }}></div>
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '10rem', height: '10rem', borderRadius: '50%', backgroundColor: 'white' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>{formatTime(time)}</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
