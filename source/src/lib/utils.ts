import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prefix a path in /public with Vite's base so it resolves on GitHub Pages sub-paths. */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, "")
