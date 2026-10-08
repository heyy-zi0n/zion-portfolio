import { ArrowRight } from "lucide-react";
import type { SystemFlowStep } from "../types/database";

interface SystemFlowProps {
  steps: SystemFlowStep[];
}

export function SystemFlow({ steps }: SystemFlowProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-y-4 gap-x-2">
      {steps.map((step, index) => (
        <div key={step.id || index} className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-[var(--muted)]/50 border border-[var(--border)] text-sm font-medium text-[var(--foreground)] whitespace-nowrap shadow-sm">
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <ArrowRight size={16} className="text-[var(--muted-foreground)]" />
          )}
        </div>
      ))}
    </div>
  );
}
