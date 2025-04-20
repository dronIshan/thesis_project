// src/PhoneCallAnimation.js
import React from "react";

// Pulse animation CSS
const pulseAnimationStyles = `
  .phone-call-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .pulse {
    position: relative;
    width: 80px;
    height: 80px;
    background-color: rgba(16,185,129,0.2);
    border: 2px solid #10b981;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .pulse::before,
  .pulse::after {
    content: "";
    position: absolute;
    border: 2px solid #10b981;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    animation: pulse 1.5s ease-out infinite;
    top: 0;
    left: 0;
  }

  .pulse::after {
    animation-delay: 0.75s;
  }

  @keyframes pulse {
    0%   { transform: scale(0.8); opacity: 0.6; }
    50%  { transform: scale(1.2); opacity: 0;   }
    100% { transform: scale(1.4); opacity: 0;   }
  }

  .calling-text {
    color: #10b981;
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: 0 0 4px rgba(16,185,129,0.5);
  }
`;

export default function PhoneCallAnimation() {
  return (
    <>
      <style>{pulseAnimationStyles}</style>
      <div className="phone-call-overlay">
        <div className="pulse">
          <i className="fas fa-phone-alt fa-2x" style={{ color: "#10b981" }} />
        </div>
        <div className="calling-text">Calling Stakeholder…</div>
      </div>
    </>
  );
}
