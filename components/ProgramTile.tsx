import clsx from "clsx";
import { ProgramTemplate } from "@/lib/types";
import { accentClasses } from "@/lib/theme";

type ProgramTileProps = {
  program: ProgramTemplate;
  selected: boolean;
  onSelect: () => void;
};

export function ProgramTile({ program, selected, onSelect }: ProgramTileProps) {
  const accent = accentClasses(program.accent);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "rounded-2xl border p-4 text-left transition-all",
        "hover:shadow-md focus:outline-none focus:ring-2",
        selected ? `${accent.soft} ${accent.ring}` : "border-slate-200 bg-white/90 text-slate-700",
      )}
    >
      <p className="text-sm font-medium">{program.shortLabel}</p>
      <p className="mt-1 text-lg font-semibold">{program.displayName}</p>
      <p className="mt-2 text-xs text-slate-500">{program.durationLabel} structured journey</p>
    </button>
  );
}
