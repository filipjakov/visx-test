import { Label } from "@visx/annotation";
import { Group } from "@visx/group";
import { animate, motion, useMotionValue } from "framer-motion";
import { ComponentProps, FC, useEffect } from "react";

const titleProps: ComponentProps<typeof Label>["titleProps"] = {
  fill: "#FFFFFF",
  textAnchor: "middle",
};

const subtitleProps: ComponentProps<typeof Label>["subtitleProps"] = {
  fill: "#1DE9B6",
  textAnchor: "middle",
};

interface PointProps extends ComponentProps<typeof motion.g> {
  x: number;
  y: number;
  coef?: string;
  money?: string;
}

export const Point: FC<PointProps> = ({
  x: newX,
  y: newY,
  coef = "1.43x",
  money = "$34.33",
  ...rest
}) => {
  const x = useMotionValue(newX);
  const y = useMotionValue(newY);

  useEffect(() => {
    const controls = animate(x.get(), newX, {
      onUpdate: (progress) => x.set(progress),
      duration: 0.1,
    });

    return () => controls.stop();
  }, [newX, x]);

  useEffect(() => {
    const controls = animate(y.get(), newY, {
      onUpdate: (progress) => y.set(progress),
      duration: 0.1,
    });

    return () => controls.stop();
  }, [newY, y]);

  return (
    <motion.g style={{ x, y }} {...rest}>
      {/* Translate by half the size of the svg */}
      <Group transform="translate(-10, -10)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
          width="20"
          height="20"
        >
          <path
            fill="#F7931A"
            fillRule="evenodd"
            d="M19.997 10c0 5.523-4.476 10-9.998 10C4.477 20 0 15.523 0 10S4.477 0 9.999 0s9.998 4.477 9.998 10Zm-7.596-3.715c1.39.477 2.408 1.193 2.208 2.524-.145.974-.687 1.446-1.408 1.61.989.514 1.326 1.487 1.013 2.663-.595 1.693-2.007 1.836-3.886 1.482l-.457 1.82-1.101-.274.45-1.796a46.35 46.35 0 0 1-.878-.226l-.452 1.804-1.1-.274.455-1.824-2.219-.558.548-1.256s.812.214.8.199c.312.077.451-.126.506-.26l1.236-4.94c.014-.234-.067-.527-.513-.639.017-.012-.8-.198-.8-.198l.293-1.172 2.222.548.451-1.803 1.101.274-.442 1.767c.296.067.594.135.883.207l.44-1.756 1.1.274-.45 1.804ZM9.764 9.292c.75.2 2.384.632 2.668-.503.29-1.161-1.296-1.512-2.072-1.684a9.485 9.485 0 0 1-.23-.052l-.548 2.192.182.047Zm-.85 3.53c.9.236 2.865.754 3.177-.497.32-1.279-1.585-1.705-2.515-1.913a12.889 12.889 0 0 1-.27-.062L8.7 12.766l.214.055Z"
            clipRule="evenodd"
          />
        </svg>
      </Group>

      <Label
        title={coef}
        subtitle={money}
        showAnchorLine={false}
        showBackground={false}
        titleFontSize={13}
        titleFontWeight={400}
        subtitleFontSize={13}
        subtitleFontWeight={400}
        // TODO: this gets smaller on bigger screens, check on how to solve
        subtitleDy={2}
        titleProps={titleProps}
        subtitleProps={subtitleProps}
        verticalAnchor="start"
        horizontalAnchor="middle"
      />
    </motion.g>
  );
};
