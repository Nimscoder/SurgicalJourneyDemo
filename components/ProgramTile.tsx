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
        "group rounded-2xl border px-4 py-4 text-left transition-all duration-200",
        "focus:outline-none focus:ring-2",
        selected
          ? `${accent.soft} ${accent.ring} scale-[1.01] shadow-sm`
          : "border-slate-200/90 bg-white/90 text-slate-700 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{program.shortLabel}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{program.displayName}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{program.durationLabel} structured journey</p>
      <span className="mt-3 inline-flex text-xs font-medium text-slate-600 transition-transform group-hover:translate-x-0.5">
        View journey
      </span>
    </button>
  );
}
