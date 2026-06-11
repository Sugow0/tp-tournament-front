import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";

interface Props {
  playerId: number;
  isDisqualified: boolean;
}

export function DisqualifyButton({ playerId, isDisqualified }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="disqualify" />
      <input type="hidden" name="playerId" value={playerId} />
      <Button type="submit" disabled={isDisqualified} variant="destructive" size="sm">
        {t("player.disqualify")}
      </Button>
    </fetcher.Form>
  );
}
