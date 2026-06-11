import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Props {
  playerId: number;
}

export function PenaltyForm({ playerId }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="addPenalty" />
      <input type="hidden" name="playerId" value={playerId} />
      <Input
        type="number"
        name="penaltyPoints"
        defaultValue={1}
        min={1}
        className="w-20 bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)]"
      />
      <Button type="submit" size="sm" variant="outline">
        {t("player.addPenalty")}
      </Button>
    </fetcher.Form>
  );
}
