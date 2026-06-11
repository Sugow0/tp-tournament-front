import { AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Une erreur est survenue.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="mb-4 text-[var(--color-crimson)] opacity-70" size={40} />
      <p className="text-[var(--color-brown)] font-ui text-sm max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Réessayer
        </Button>
      )}
    </div>
  );
}
