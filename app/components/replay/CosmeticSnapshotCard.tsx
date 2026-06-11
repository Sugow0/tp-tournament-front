import { useTranslation } from "react-i18next";
import { Card } from "~/components/ui/card";
import type { CosmeticSnapshot } from "~/types/replay";

interface Props {
  snapshot: CosmeticSnapshot;
}

function SnapshotRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="font-ui text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="font-heading text-sm font-semibold text-[var(--color-text-bright)]">
        {value ?? "—"}
      </span>
    </div>
  );
}

export function CosmeticSnapshotCard({ snapshot }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="bg-[var(--color-arena-mid)] border-[var(--color-border)] p-4">
      <h3 className="font-heading text-base font-semibold text-[var(--color-gold)] mb-2">
        {t("replay.snapshot.title")}
      </h3>
      <div className="divide-y divide-[var(--color-border)]">
        <SnapshotRow label={t("replay.snapshot.player1")} value={snapshot.player1SkinName} />
        <SnapshotRow label={t("replay.snapshot.player2")} value={snapshot.player2SkinName} />
        <SnapshotRow label={t("replay.snapshot.background")} value={snapshot.backgroundSkinName} />
      </div>
    </Card>
  );
}
