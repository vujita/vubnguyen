import React from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import cn from "./classnames";
import type { ClassValue } from "./classnames";

const skeleton = cva("bg-primary/10 animate-pulse rounded-md", {
  variants: {
    // TODO: Determin the height/width values that would make this simple to work with
    height: {
      full: ["h-full"],
    },
    width: {
      full: ["w-full"],
    },
  },
});
export type SkeletonProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className" | keyof VariantProps<typeof skeleton>> &
  VariantProps<typeof skeleton> & {
    className?: ClassValue;
  };

export const Skeleton: React.FC<SkeletonProps> = ({ className, children, ...props }) => <div className={cn(skeleton(props), className)}>{children}</div>;
