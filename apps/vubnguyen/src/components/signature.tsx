"use client";

import { type FC } from "react";
import { motion, type SVGMotionProps } from "framer-motion";

const svgVariant = {
  finished: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
  start: {
    opacity: 0,
    pathLength: 0,
  },
};

const pathProps: SVGMotionProps<SVGPathElement> = {
  animate: "finished",
  className: "stroke-gray-800 dark:stroke-gray-200",
  initial: "start",
  strokeLinecap: "round",
  strokeWidth: "25",
  variants: svgVariant,
};

export const Signature: FC = () => {
  return (
    <svg
      className="h-[200px] md:h-[400px]"
      fill="none"
      viewBox="0 0 852 902"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        {...pathProps}
        d="M13.4795 335.712C13.4795 343.362 12.3038 344.03 16.2877 351.002C43.3765 398.407 101.453 272.417 105.839 261.139C109.982 250.485 128.442 172.898 137.665 211.839C171.832 356.099 213.423 492.513 266.063 631.199C296.915 712.482 325.918 794.412 355.458 876.139C379.59 942.903 355.93 734.135 358.266 663.182C364.367 477.946 405.835 295.652 473.091 123.224C487.605 86.0134 509.24 50.3495 521.767 12.7671"
      />
      <motion.path
        {...pathProps}
        d="M569.507 540.712C560.877 535.636 559.617 526.365 554.842 518.247C549.838 509.74 555.806 561.209 556.714 565.674C569.252 627.349 583.634 687.054 612.566 743.216C637.208 791.05 671.963 800.261 686.828 739.316C701.355 679.754 697.404 616.674 704.145 556.002C707.618 524.748 723.412 615.928 735.192 645.084C756.629 698.142 818.113 762.246 839.096 678.315"
      />
    </svg>
  );
};

export default Signature;
