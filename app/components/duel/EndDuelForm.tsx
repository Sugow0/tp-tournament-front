import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Props {
  duelId: number;
}

export function EndDuelForm({ duelId }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="endDuel" />
      <input type="hidden" name="duelId" value={duelId} />
      <Input
        type="number"
        name="durationSeconds"
        defaultValue={60}
        min={1}
        className="w-24 bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)]"
      />
      <Button type="submit" size="sm" variant="outline">
        {t("duel.endDuel")}
      </Button>
    </fetcher.Form>
  );
}
