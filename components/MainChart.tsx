import { Axis } from "@visx/axis";
import { curveLinear } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { ComponentProps, useEffect, useRef, useState } from "react";

import { Path } from "./Path";

import { animate, AnimatePresence } from "framer-motion";
import { Circle } from "./Circle";

import throttle from "lodash.throttle";
import { Point } from "./Points";

const formatAxisValue: ComponentProps<typeof Axis>["tickFormat"] = (val) =>
  val === 0 ? val : val.toFixed(1) + "x";

const axisColor = "rgba(255 255 255 / 0.34)";

const axisLeftTickLabelProps = {
  dx: "-0.3125em",
  dy: "0.25em",
  fontSize: "0.8125rem",
  textAnchor: "end" as const,
  fill: axisColor,
};

export type Props = {
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
    left: 81,
    bottom: 28,
    right: 68,
  },
}: Props) {
  const [stock, setStock] = useState([1]);
  const pathRef = useRef<SVGPathElement>(null);

  const [points, setPoints] = useState([]);

  useEffect(() => {
    const i = setInterval(() => {
      if (stock.length > 29) {
        return;
      }

      setStock((s) => s.concat(1.05 ** (s.length - 1)));

      if (!(stock.length % 10)) {
        setPoints((s) => s.concat([stock.length]));
      }
    }, 0.5 * 1000);

    return () => clearInterval(i);
  }, [stock.length]);

  const innerHeight = height - margin.top - margin.bottom;

  // bounds
  const xMax = Math.max(width - margin.left - margin.right, 0);
  const yMax = Math.max(innerHeight - margin.bottom, 0);

  const onUpdateTime = useRef((progress: number) => {
    const newScale = scaleLinear<number>({
      range: [0, xMax],
      domain: [0, progress + 1],
    });
    setTimeScale(() => newScale);
  });

  const onUpdateValue = useRef((progress: number) => {
    const newScale = scaleLinear<number>({
      range: [yMax, 0],
      domain: [1, progress + 1],
    });
    setNumberScale(() => newScale);
  });

  // TODO: somehow reuse above function?
  // TODO: do i even need the
  const [timeScale, setTimeScale] = useState(() =>
    scaleLinear<number>({
      range: [0, xMax],
      domain: [0, stock.length + 1],
    })
  );

  const [numberScale, setNumberScale] = useState(() =>
    scaleLinear<number>({
      range: [yMax, 0],
      domain: [1, stock[stock.length - 1] + 1],
    })
  );

  useEffect(() => {
    const controls = animate(stock.length, stock.length + 1, {
      duration: 0.5,
      ease: "linear",
      onUpdate: throttle(onUpdateTime.current, 20),
    });

    return () => controls.stop();
  }, [stock]);

  useEffect(() => {
    const controls = animate(stock[stock.length - 2], stock[stock.length - 1], {
      duration: 0.5,
      ease: "linear",
      onUpdate: throttle(onUpdateValue.current, 20),
    });

    return () => controls.stop();
  }, [stock]);

  let newX = timeScale(0);
  let newY = numberScale(stock[0]);

  if (pathRef.current?.getTotalLength()) {
    const point = pathRef.current.getPointAtLength(
      pathRef.current.getTotalLength()
    );
    newX = point.x;
    newY = point.y;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ background: "#5cc9ff10" }}>
      <Group left={margin.left} top={margin.top}>
        <LinePath
          data={stock}
          x={(d) => timeScale(stock.indexOf(d))!}
          y={(d) => numberScale(d)}
          curve={curveLinear}
        >
          {({ path }) => <Path ref={pathRef} d={path(stock) || ""} />}
        </LinePath>

        <Axis
          orientation="left"
          top={0}
          left={-13}
          scale={numberScale}
          stroke="transparent"
          tickStroke={axisColor}
          tickLabelProps={() => axisLeftTickLabelProps}
          tickFormat={formatAxisValue}
          numTicks={6}
          rangePadding={12}
        />

        <AnimatePresence>
          <Circle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            width={44}
            height={44}
            newX={newX}
            newY={newY}
          />
        </AnimatePresence>

        {points.length > 0 && (
          <AnimatePresence>
            {points.map((point, i) => {
              const domPoint = pathRef.current!.getPointAtLength(
                pathRef.current!.getTotalLength() * (point / stock.length)
              );

              return (
                <Point
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 1 },
                  }}
                  key={point}
                  x={domPoint.x}
                  y={domPoint.y}
                />
              );
            })}
          </AnimatePresence>
        )}
      </Group>
    </svg>
  );
}
