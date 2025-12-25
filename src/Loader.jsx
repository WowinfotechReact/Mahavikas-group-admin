// Loader.jsx
import React, { useEffect, useState } from "react";
import { Backdrop } from "@mui/material";

const Loader = ({ duration = 1200, onComplete }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 800);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <Backdrop
      sx={{
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        backdropFilter: "blur(10px)",
        zIndex: 9999
      }}
      open={true}
    >
      <div className="sa-wrapper">

        {/* Neon holo ring */}
        <div className={`sa-holo ${showSuccess ? "scaleOut" : ""}`}>
          <div className="ring ring1"></div>
          <div className="ring ring2"></div>
          <div className="ring ring3"></div>

          {/* Center Icon / Check */}
          <div className="sa-center">
            {!showSuccess ? (
              <div className="scan-icon">📋</div>
            ) : (
              <div className="success-check">✔</div>
            )}
          </div>
        </div>

        {/* Brand / Status */}
        <h3 className={`sa-title ${showSuccess ? "fadeOut" : ""}`}>
          Smart Attendance
        </h3>

        <p className={`sa-status ${showSuccess ? "fadeOut" : ""}`}>
          Syncing records...
        </p>
      </div>

      <style>{`
        .sa-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeIn .3s ease-out;
        }

        /* HOLOGRAM CONTAINER */
        .sa-holo {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(18px);
          overflow: hidden;
          box-shadow: 0 0 20px rgba(13,110,253,0.3), inset 0 0 25px rgba(13,110,253,0.15);
          transition: transform .6s ease, opacity .6s;
        }
        .scaleOut {
          transform: scale(0.85) translateY(-10px);
          opacity: 0.2;
        }

        /* RINGS */
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 3px solid rgba(13,110,253,0.4);
          animation: spin 3.5s linear infinite;
        }
        .ring1 { width: 130%; height: 130%; }
        .ring2 { width: 90%; height: 90%; animation-duration: 2.8s; }
        .ring3 { width: 50%; height: 50%; animation-duration: 1.8s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* CENTER ICON */
        .sa-center {
          position: absolute;
          font-size: 42px;
          font-weight: bold;
        }
        .scan-icon {
          animation: iconPulse 1.2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(13,110,253,0.6));
        }
        .success-check {
          font-size: 58px;
          color: #d7732f;
          animation: checkPop .5s ease forwards;
          text-shadow: 0 0 10px rgba(13,110,253,0.6);
        }

        @keyframes iconPulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.13); }
        }
        @keyframes checkPop {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* TEXT */
        .sa-title {
          margin-top: 15px;
          font-size: 22px;
          font-weight: 700;
          color: #d7732f;
          letter-spacing: 0.6px;
          filter: drop-shadow(0 2px 6px rgba(13,110,253,0.3));
          transition: opacity .4s;
        }
        .sa-status {
          font-size: 15px;
          color: #d7732f;
          margin-top: 4px;
          animation: blink 1.4s ease-in-out infinite;
          transition: opacity .4s;
        }

        .fadeOut { opacity: 0; }

        @keyframes blink {
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Backdrop>
  );
};

export default Loader;
