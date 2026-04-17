import { cn } from "@/lib/utils";

export type CalloutVariant = "note" | "tip" | "warning" | "question";

interface CalloutProps {
  variant: CalloutVariant;
  title: string;
  children: React.ReactNode;
}

const variantConfig: Record<CalloutVariant, { label: string; rail: string; accent: string }> = {
  note: {
    label: "Note",
    rail: "border-l-sky-400/60 dark:border-l-sky-300/50",
    accent: "text-sky-600 dark:text-sky-300/90",
  },
  tip: {
    label: "Tip",
    rail: "border-l-emerald-500/60 dark:border-l-emerald-300/50",
    accent: "text-emerald-700 dark:text-emerald-300/90",
  },
  warning: {
    label: "Warning",
    rail: "border-l-amber-500/70 dark:border-l-amber-300/60",
    accent: "text-amber-700 dark:text-amber-300/90",
  },
  question: {
    label: "Question",
    rail: "border-l-violet-500/60 dark:border-l-violet-300/50",
    accent: "text-violet-700 dark:text-violet-300/90",
  },
};

export const Callout = ({ variant, title, children }: CalloutProps) => {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "my-6 pl-4 border-l-2",
        config.rail
      )}
    >
      <div
        className={cn(
          "text-[12px] font-medium uppercase tracking-[0.08em] mb-1.5",
          config.accent
        )}
      >
        {title || config.label}
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/85 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted/60 [&_code]:text-[13px] [&_code]:font-mono [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
};
