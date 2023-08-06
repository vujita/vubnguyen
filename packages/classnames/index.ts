import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function classnames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default classnames;

export { ClassValue };
