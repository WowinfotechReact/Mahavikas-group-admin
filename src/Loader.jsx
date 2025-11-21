import React, { useState, useEffect } from 'react';
import { Backdrop } from '@mui/material';
import './Loader.css';

const Loader = () => {

  return (
    <Backdrop
      sx={{
        backgroundColor: '#ffffff80',
        zIndex: 1305
      }}
      open={true}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        {/* Teacher Icon */}
        <div
          className="mb-3"
          style={{
            fontSize: "60px",
            color: "#0d6efd",
            animation: "pulse 1.5s infinite"
          }}
        >
          📚
        </div>

        {/* Bootstrap Spinner */}
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>

        {/* Animated Text */}
        <h5
          style={{
            color: "#0d6efd",
            letterSpacing: "1px",
            animation: "typing 2s steps(25,end) infinite"
          }}
        >
          Loading Attendance Data...
        </h5>

        {/* Custom Keyframes */}
        <style>{`
        @keyframes pulse {
          0%   { transform: scale(1); opacity: 0.7; }
          50%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }

        @keyframes typing {
          0% { opacity: 0.2 }
          50% { opacity: 1 }
          100% { opacity: 0.2 }
        }
      `}</style>
      </div>
    </Backdrop>
  );
};

export default Loader;
