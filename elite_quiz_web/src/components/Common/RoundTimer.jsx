"use client"
import React, { forwardRef, useImperativeHandle } from "react";
import { useTimer } from "react-timer-hook";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles
import { websettingsData } from "@/store/reducers/webSettings";
import { useSelector } from "react-redux";
import { getImageSource, imgError } from "@/utils";


const RoundTimer = forwardRef(({ timerSeconds, onTimerExpire, userProfile }, ref) => {


    const time = new Date();

    time.setSeconds(time.getSeconds() + timerSeconds)

    const websettingsdata = useSelector(websettingsData);

    const themecolor = websettingsdata && websettingsdata?.primary_color

    const { seconds, restart, start, minutes, pause, hours } = useTimer({
        expiryTimestamp: time,
        autoStart: true,
        onExpire: () => {
            setTimeout(() => {
                onTimerExpire();
            }, 500);
        },
    });

    useImperativeHandle(ref, () => ({

        startTimer() {
            start();
        },

        resetTimer() {
            const time = new Date();
            time.setSeconds(time.getSeconds() + timerSeconds);
            restart(time);
        },

        pauseTimer() {
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
    let progressBarColor = '#ef5388'; // Default color

    if (timerSeconds <= 60 && seconds <= 10) {
        progressBarColor = 'red'; // Change to red when 10 seconds or less are remaining
    } else if (hours === 0 && minutes === 0 && timerSeconds >= 60 && timerSeconds <= 3600 && seconds <= 10) {
        progressBarColor = 'red';
    } else {
        progressBarColor
    }

    return (
        <div className="w-full">
            <div className="w-[70px] md:w-[110px]">
                <CircularProgressbar
                    value={timervalue}
                    // text={
                    //     (hours === 0 && minutes === 0) ? `${seconds}` :
                    //     (hours === 0) ? `${minutes}:${seconds}` :
                    //     `${hours}:${minutes}:${seconds}`
                    // }
                    styles={buildStyles({
                        textSize: '16px',
                        textColor: themecolor,
                        pathColor: progressBarColor, // Use the calculated color
                        trailColor: '#d6d6d6',
                        circleTop: '0%',
                    })}
                />
                <img
                    src={getImageSource(userProfile)}
                    alt="Timer Icon"
                    className="absolute translate-y-[-50%] translate-x-[-50%] top-1/2 left-1/2 rounded-full  w-[60px] h-[60px] md:w-[90px] md:h-[90px]"
                    onError={imgError}
                // style={{
                //     position: 'absolute',
                //     top: '50%',
                //     left: '50%',
                //     transform: 'translate(-50%, -50%)',
                //     width: '90px',
                //     height: '90px',
                //     borderRadius: '100%',
                // }}
                />
            </div>
        </div>
    );
});


export default RoundTimer;
