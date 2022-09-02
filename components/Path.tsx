import { animate, motion, useMotionValue } from "framer-motion";
import { FC, useEffect, useMemo } from "react";
import { interpolatePath } from "d3-interpolate-path";

export const Path: FC<{
  d: string;
}> = ({ d }) => {
  const path = useMotionValue(d);

  useEffect(() => {
    const interpolator = interpolatePath(path.get(), d);

    animate(0, 1, {
      onUpdate: (progress) => path.set(interpolator(progress)),
    });
  }, [d, path]);

  return (
    <motion.path
      d={path}
      strokeWidth={2}
      strokeOpacity={0.8}
      strokeLinecap="round"
      fill="none"
      stroke="#ff008c"
    />
  );
};
