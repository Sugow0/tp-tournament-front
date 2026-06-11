import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { TournamentStatus } from "~/types/tournament";

const NEXT_STATUS: Partial<Record<TournamentStatus, TournamentStatus>> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "CLOSED",
};

interface Props {
  status: TournamentStatus;
}

export function AdvanceTournamentButton({ status }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const next = NEXT_STATUS[status];

  if (!next) return null;

  const label = status === "OPEN" ? t("tournament.advance.start") : t("tournament.advance.close");

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="advanceStatus" />
      <input type="hidden" name="status" value={next} />
      <Button
        type="submit"
        variant={status === "IN_PROGRESS" ? "destructive" : "default"}
        disabled={fetcher.state !== "idle"}
      >
        {label}
      </Button>
    </fetcher.Form>
  );
}
