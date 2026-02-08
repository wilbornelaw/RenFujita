type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, description, eyebrow, action }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}
