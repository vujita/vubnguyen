"use client";

import React, { forwardRef, useState } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import type { ClassValue } from "./classnames";
import cn from "./classnames";
import type { Maybe } from "./type-helpers";

/** TODO: options, also add storybook story
 * state options
 * online/offline
 * border: boolean
 */

const placeHolderVariants = cva("overflow-clip text-center select-none ", {
  variants: {},
});

export const avatarVariants = cva("relative flex items-center justify-center overflow-hidden border-width-2", {
  defaultVariants: {
    backgroundColor: "gray",
    border: false,
    shape: "rounded",
    size: "sm",
  },
  variants: {
    backgroundColor: {
      gray: "bg-gray-300 dark:bg-gray-600",
    },
    border: {
      false: [],
      true: [],
    },
    shape: {
      rounded: "rounded-full",
      square: "",
    },
    size: {
      lg: ["h-32 w-32"],
      md: ["h-16 w-16"],
      sm: ["h-8 w-8"],
      xs: ["h-4 w-4"],
    },
  },
});

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "className" | "placeholder">, VariantProps<typeof avatarVariants> {
  className?: ClassValue;
  imgClassName?: ClassValue;
  imgProps?: Omit<React.HTMLAttributes<HTMLImageElement>, "src" | "className">;
  placeholder?: Maybe<React.ReactNode>;
  src?: Maybe<string>;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { border = false, backgroundColor, imgClassName, imgProps, src, placeholder, ...divProps } = props;
  const divClassNames = avatarVariants({
    backgroundColor,
    border,
  });
  const [showPlaceholder, setShowPlaceholder] = useState(!src);
  return (
    <div
      {...divProps}
      className={divClassNames}
      ref={ref}
    >
      {src && (
        <img
          aria-label="Avatar photo"
          {...imgProps}
          className={cn(["h-full w-full object-cover"], imgClassName)}
          src={src}
          onLoad={() => {
            setShowPlaceholder(false);
          }}
          onError={() => {
            setShowPlaceholder(true);
          }}
        />
      )}
      {showPlaceholder && <div className={placeHolderVariants({})}>{placeholder}</div>}
    </div>
  );
});
