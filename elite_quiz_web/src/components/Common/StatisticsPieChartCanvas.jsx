"use client"
import { t } from "@/utils";
import React, { useEffect, useRef, useState } from 'react';

const StatisticsPieChartCanvas = ({ width, height, values, strokeWidth, totalBattles }) => {
  const [displayTotalBattles, setDisplayTotalBattles] = useState(totalBattles);

  const pi = 3.1415926535897932;

  const paintCanvas = (ctx) => {
    const halfWidth = width * 0.5;
    const center = { x: width * 0.5, y: halfWidth };
    const radius = 50;

    const total = values.reduce((prev, v) => prev + v.no, 0);

    const drawCircle = () => {
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, 2 * pi);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    };

    if (total === 0) {
      drawCircle();
      return;
    }

    const pi2 = pi * 2;
    let oldStart = 3 * (pi * 0.5); // 0 deg

    for (const val of values) {
      const sweep = (val.no * pi2) / total;

      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, oldStart, oldStart + sweep);
      ctx.strokeStyle = val.arcColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      oldStart += sweep;
    }

    // Update the state variable to display total battles in the span
    setDisplayTotalBattles(totalBattles);
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        paintCanvas(ctx);
      }
    }
  }, [values, width, height, strokeWidth, totalBattles]);

  return (
    <div className='relative w-1/2 flex-center m-auto'>

      <canvas ref={canvasRef} width={width} height={height} className='block m-auto pb-0 pt-0' />
      <span className='absolute top-[28%] break-words w-full h-[60px] left-0 right-0 text-center text-[17px] flex flex-col'>
        <span className="font-semibold text-text-color text-lg">
          {displayTotalBattles}
        </span>
        <span className="text-text-color text-base">
          {t("battles")}
        </span>
      </span>

    </div>
  );
};

export default StatisticsPieChartCanvas;
