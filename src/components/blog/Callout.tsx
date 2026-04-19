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
    rail: "border-l-foreground/25",
    accent: "text-foreground/55",
  },
  tip: {
    label: "Tip",
    rail: "border-l-foreground/45",
    accent: "text-foreground/75",
  },
  warning: {
    label: "Warning",
    rail: "border-l-amber-600/70 dark:border-l-amber-300/50",
    accent: "text-amber-700 dark:text-amber-300/85",
  },
  question: {
    label: "Question",
    rail: "border-l-foreground/35 italic",
    accent: "text-foreground/65 italic",
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
