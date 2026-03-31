"use client";
import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from "react";
import { useTimer } from "react-timer-hook";
import "react-circular-progressbar/dist/styles.css"; // Import the styles
import { websettingsData } from "@/store/reducers/webSettings";
import { useSelector } from "react-redux";
import { Progress } from "@/components/ui/progress";
import { t } from "@/utils";

// import LinearProgress from '@mui/material/LinearProgress';
// import Box from '@mui/material/Box';

const Timer = forwardRef(({ timerSeconds, onTimerExpire, isQuiz }, ref) => {
  const time = new Date();

  time.setSeconds(time.getSeconds() + timerSeconds);

  const websettingsdata = useSelector(websettingsData);

  const isDarkMode = localStorage.getItem("theme") === "dark";

  const themecolor = isDarkMode ? process.env.NEXT_PUBLIC_DARK_MODE_PRIMARY_COLOR : websettingsdata && websettingsdata?.primary_color;
  

  // State for smooth progress animation
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const totalTimeRef = useRef(timerSeconds * 1000); // Total time in milliseconds
  const isRunningRef = useRef(true);

  const { seconds, restart, start, minutes, pause, hours } = useTimer({
    expiryTimestamp: time,
    autoStart: true,
    onExpire: () => {
      isRunningRef.current = false;
      setProgress(0);
      setTimeout(() => {
        onTimerExpire();
      }, 500);
    },
  });

  // Progress calculation
  useEffect(() => {
    const totalSeconds = timerSeconds;    
    const remainingSeconds = seconds + (minutes * 60) + (hours * 3600);
    const newProgress = totalSeconds < 600 ? Math.floor((remainingSeconds / totalSeconds) * 100) :  Math.floor((remainingSeconds / totalSeconds) * 1000)/10;
    setProgress(newProgress);
  }, [timerSeconds, seconds, minutes, hours]);

  useImperativeHandle(ref, () => ({
    startTimer() {
      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      totalTimeRef.current = timerSeconds * 1000;
      setProgress(100);
      start();
    },

    resetTimer() {
      const time = new Date();
      time.setSeconds(time.getSeconds() + timerSeconds);
      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      totalTimeRef.current = timerSeconds * 1000;
      setProgress(100);
      restart(time);
    },

    pauseTimer() {
      isRunningRef.current = false;
      pause();
    },

    getTimerSeconds() {
      return seconds;
    },

    getMinuteandSeconds() {
      return `${hours}:${minutes}:${seconds}`;
    },
  }));

  // this logic for reverse progressbar and based on hours and minutes and seconds check conditions
  const value = 100 / timerSeconds;

  let timervalue = 0;

  if (timerSeconds <= 60) {
    timervalue = value * seconds;
  } else if (timerSeconds >= 60 && timerSeconds <= 3600) {
    timervalue = value * (seconds + 60 * minutes);
  } else {
    timervalue = value * (seconds + 60 * minutes + 3600 * hours);
  }

  // this logic for circular progress color change
  let progressBarColor = themecolor || "#ef5388"; // Use theme color if available

  // if (timerSeconds <= 60 && seconds <= 5) {
  //   progressBarColor = "red";
  // } else if (
  //   hours === 0 &&
  //   minutes === 0 &&
  //   timerSeconds >= 60 &&
  //   timerSeconds <= 3600 &&
  //   seconds <= 10
  // ) {
  //   progressBarColor = "red";
  // }
  const displayTime =
    hours === 0 && minutes === 0
      ? seconds < 10 ? `0${seconds}` : `${seconds}`
      : hours === 0
      ? minutes < 10 ? `0${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}` : `${minutes}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`
      : `${hours < 10 ? `0${hours}` : `${hours}`}:${minutes < 10 ? `0${minutes}` : `${minutes}`}:${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
  return (
    <div
      className={`w-full rounded-[50%] flex justify-center items-center h-auto relative pt-6 max-479:h-[50px]  ${
        isQuiz && "px-2"
      }`}
    >
      <div className="w-full">
        <div
          style={{
            marginTop: "10px",
            fontSize: "16px",
            color: progressBarColor,
          }}
          className="w-full flex rtl:justify-end mb-2"
        >
          {t('timer')}: {displayTime}
        </div>
        <div className="h-[7px] rounded-[20px] bg-gray-300 relative overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: progressBarColor,
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default Timer;


