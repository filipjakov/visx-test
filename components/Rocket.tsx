import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { FC, useEffect } from "react";
import { Rocket as R } from "./RocketAsset";

export const Rocket: FC<{
  newX: number;
  newY: number;
  angle: number;
}> = ({ newX, newY, angle }) => {
  const x = useMotionValue(newX);
  const y = useMotionValue(newY);

  useEffect(() => {
    animate(x.get(), newX, {
      onUpdate: (progress) => x.set(progress),
    });
  }, [newX, x]);

  useEffect(() => {
    animate(y.get(), newY, {
      // ...config,
      onUpdate: (progress) => y.set(progress),
    });
  }, [newY, y]);

  return (
    <motion.g
      initial={false}
      // transitions do not seem to be necessary
      transition={{ duration: 0 }}
      style={{ x, y, translateX: -20, rotate: angle }}
    >
      <R width={40} height={40} />
    </motion.g>
  );
};
