import { ProgramTemplate } from "@/lib/types";

export const accentClasses = (accent: ProgramTemplate["accent"]) => {
  switch (accent) {
    case "rose":
      return {
        soft: "bg-rose-50 text-rose-700 border-rose-200",
        solid: "bg-rose-600 text-white",
        ring: "ring-rose-200",
        progress: "bg-rose-500",
      };
    case "amber":
      return {
        soft: "bg-amber-50 text-amber-800 border-amber-200",
        solid: "bg-amber-600 text-white",
        ring: "ring-amber-200",
        progress: "bg-amber-500",
      };
    default:
      return {
        soft: "bg-sky-50 text-sky-700 border-sky-200",
        solid: "bg-sky-600 text-white",
        ring: "ring-sky-200",
        progress: "bg-sky-500",
      };
  }
};
