import { Button } from "~/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-[var(--color-text-muted)] opacity-40 text-5xl">{icon}</div>
      )}
      <h3 className="font-heading text-xl text-[var(--color-text)] mb-2">{title}</h3>
      {description && (
        <p className="font-ui text-sm text-[var(--color-text-muted)] max-w-xs mb-6">
          {description}
        </p>
      )}
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
