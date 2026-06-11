export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div
        role="status"
        aria-label="Chargement"
        className={`${sizeClasses[size]} rounded-full border-[var(--color-arena-elevated)] border-t-[var(--color-gold)] animate-spin`}
      />
    </div>
  );
}
