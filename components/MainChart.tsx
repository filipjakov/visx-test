import { scaleLinear } from "@visx/scale";
import { useCallback, useEffect, useMemo, useState } from "react";

import { LinearGradient } from "@visx/gradient";
import { max } from "d3-array";

import { Axis } from "@visx/axis";
import { curveBasisOpen } from "@visx/curve";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";

import { Path } from "./Path";

import { Rocket } from "./Rocket";
import { animate } from "framer-motion";

import throttle from "lodash.throttle";

/**
 * TODO:
 * - useTransform to calculate the rotation angle? ✅
 * - why is motion.g transition duration not working? ✅
 * - how to animate axis growing (https://stackoverflow.com/questions/71328594/axis-scale-shift-in-d3-js) ✅
 *    - how about interpolating the axis scale??? ✅
 * - how to sync everything so that it animates with new data??? (clip pathing + domain changing???)
 *    - solved by interpolating everything with js
 */

// Initialize some variables
const chartSeparation = 30;
const GRADIENT_ID = "brush_gradient";
export const background = "#584153";
export const background2 = "#af8baf";

const axisColor = "#fff";

const axisBottomTickLabelProps = {
  textAnchor: "middle" as const,
  fontFamily: "Arial",
  fontSize: 10,
  fill: axisColor,
};

const axisLeftTickLabelProps = {
  dx: "-0.25em",
  dy: "0.25em",
  fontFamily: "Arial",
  fontSize: 10,
  textAnchor: "end" as const,
  fill: axisColor,
};

export type BrushProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  compact?: boolean;
};

export function Chart({
  width,
  height,
  margin = {
    top: 20,
    left: 50,
    bottom: 20,
    right: 20,
  },
}: BrushProps) {
  const [stock, setStock] = useState([0, 1]);

  useEffect(() => {
    const i = setInterval(() => {
      setStock((s) => s.concat(1.1 ** (s.length - 2)));
    }, 0.5 * 1000);

    return () => clearInterval(i);
  }, []);

  const innerHeight = height - margin.top - margin.bottom;
  const topChartBottomMargin = chartSeparation + 10;
  const topChartHeight = innerHeight - topChartBottomMargin;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(topChartHeight, 0);

  const [timeScale, setTimeScale] = useState(() =>
    scaleLinear<number>({
      range: [0, xMax],
      domain: [0, stock.length + 1],
      round: true,
    })
  );

  const [numberScale, setNumberScale] = useState(() =>
    scaleLinear<number>({
      range: [yMax, 0],
      domain: [0, stock[stock.length - 1] + 1],
      round: true,
    })
  );

  const onUpdateTime = useCallback(
    throttle((progress: number) => {
      const newScale = scaleLinear<number>({
        range: [0, xMax],
        domain: [0, progress + 1],
      });

      setTimeScale(() => newScale);
    }, 50),
    []
  );

  const onUpdateValue = useCallback(
    throttle((progress: number) => {
      const newScale = scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, progress + 1],
      });

      setNumberScale(() => newScale);
    }, 50),
    []
  );

  useEffect(() => {
    animate(stock.length, stock.length + 1, {
      duration: 0.5,
      ease: "linear",
      onUpdate: onUpdateTime,
    });
  }, [onUpdateTime, stock.length]);

  useEffect(() => {
    animate(stock[stock.length - 2], stock[stock.length - 1], {
      duration: 0.5,
      ease: "linear",
      onUpdate: onUpdateValue,
    });
  }, [onUpdateValue, stock]);

  const newX = timeScale(stock.length - 2);
  const newY = numberScale(stock[stock.length - 1]);
  const dy = stock[stock.length - 1] - stock[stock.length - 2];
  const dx = 1;
  const angle = (Math.atan2(dy, dx) * 180) / -Math.PI + 45;

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <LinearGradient
        id={GRADIENT_ID}
        from={background}
        to={background2}
        rotate={45}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={`url(#${GRADIENT_ID})`}
        rx={8}
      />

      <Group left={margin.left} top={margin.top}>
        <LinePath
          data={stock}
          x={(d) => timeScale(stock.indexOf(d))!}
          y={(d) => numberScale(d)}
          curve={curveBasisOpen}
        >
          {({ path }) => <Path d={path(stock) || ""} />}
        </LinePath>

        <Axis
          top={topChartHeight}
          left={0}
          scale={timeScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisBottomTickLabelProps}
          numTicks={5}
        />

        <Axis
          orientation="left"
          top={0}
          left={0}
          scale={numberScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
          numTicks={5}
        />

        <Rocket newX={newX} newY={newY} angle={angle} />
      </Group>
    </svg>
  );
}
