import { animate, motion, useMotionValue } from "framer-motion";
import { ComponentProps, FC, forwardRef, useEffect } from "react";
import { interpolatePath } from "d3-interpolate-path";

// eslint-disable-next-line react/display-name
export const Path = forwardRef<
  SVGPathElement,
  ComponentProps<typeof motion.path>
>(({ d }, ref) => {
  const path = useMotionValue(d);

  useEffect(() => {
    const interpolator = interpolatePath(path.get() as string, d as string);

    const controls = animate(0, 1, {
      onUpdate: (progress) => path.set(interpolator(progress)),
      duration: 0.2,
    });

    return () => controls.stop();
  }, [d, path]);

  return (
    <motion.path
      ref={ref}
      d={path}
      strokeWidth={2}
      strokeOpacity={0.8}
      strokeLinecap="round"
      fill="none"
      stroke="#1DE9B6"
    />
  );
});
