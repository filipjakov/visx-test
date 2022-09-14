import { animate, motion, useMotionValue } from "framer-motion";
import { ComponentProps, FC, useEffect } from "react";

interface Props extends ComponentProps<typeof motion.svg> {
  newX: number;
  newY: number;
}

export const Circle: FC<Props> = ({ newX, newY, ...rest }) => {
  const x = useMotionValue(newX);
  const y = useMotionValue(newY);

  useEffect(() => {
    animate(x.get(), newX, {
      onUpdate: (progress) => x.set(progress),
      duration: 0,
    });
  }, [newX, x]);

  useEffect(() => {
    animate(y.get(), newY, {
      onUpdate: (progress) => y.set(progress),
      duration: 0,
    });
  }, [newY, y]);

  return (
    <motion.g
      initial={false}
      // TODO: move away from absolute values; move to percentages on svg?
      style={{
        translateX: +(rest.width ?? 0) / -2,
        translateY: +(rest.height ?? 0) / -2,
      }}
      {...rest}
    >
      <motion.svg
        x={x}
        y={y}
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <circle cx="22" cy="22" fill="#1DE9B6" r="6" />
        <circle cx="22" cy="22" opacity="0.12" fill="#1DE9B6" r="14" />
        <circle cx="22" cy="22" opacity="0.12" fill="#1DE9B6" r="22">
          <animate
            attributeName="r"
            from="6"
            to="22"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.12"
            to="0"
            dur="1.5s"
            begin="0s"
            repeatCount="indefinite"
          />
        </circle>
      </motion.svg>
    </motion.g>
  );
};
