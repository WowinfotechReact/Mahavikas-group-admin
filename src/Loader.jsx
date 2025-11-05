import React, { useState, useEffect } from 'react';
import { Backdrop } from '@mui/material';
import './Loader.css';

const Loader = () => {
  const professionalMessages = [
    "Almost done… thank you for your patience.",
    "Fetching the latest information…",
    "Preparing your dashboard…",
    "Updating records…",
    "Retrieving your requested data…",
    "Loading resources… almost there.",
    "Your data is being processed.",
    "Synchronizing information with the server…",
    "Compiling the latest reports…",
    "Generating insights…",
    // "Fetching data from our super computer",
    // "Applying your Zomato coupon… ",
    // "Receiving 4 missed calls from NASA",
    // "Area 51 Want to know your location",
  ];

  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % professionalMessages.length);
    }, 1000); // change message every 3 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <Backdrop
      sx={{
        backgroundColor: '#ffffff80',
        zIndex: 1305
      }}
      open={true}
    >
      <div className="battery-loader">
        <div className="battery-cap" />
        <div className="battery-body">
          <div className="charge" />
        </div>
        <span className="loading-text">{professionalMessages[msgIndex]}</span>
      </div>
    </Backdrop>
  );
};

export default Loader;
