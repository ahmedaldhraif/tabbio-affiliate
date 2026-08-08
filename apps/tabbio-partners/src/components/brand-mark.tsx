import { Sparkle } from "lucide-react";

export function BrandMark({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-bold tracking-[-0.035em] ${light ? "text-white" : "text-[#2b2b2b]"}`}
      role="img"
      aria-label="Tabbio"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-[#5a2aff] text-white shadow-[0_8px_22px_rgba(90,42,255,.28)]">
        <Sparkle className="size-4" aria-hidden="true" />
      </span>
      {!compact && <span className="text-[1.35rem]">tabbio</span>}
    </span>
  );
}
