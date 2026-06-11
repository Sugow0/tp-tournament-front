import { Button } from "~/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-[var(--color-brown-light)] opacity-50">{icon}</div>}
      <h3 className="font-heading text-lg text-[var(--color-brown)] mb-2">{title}</h3>
      {description && (
        <p className="text-[var(--color-brown-mid)] font-ui text-sm max-w-xs mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
