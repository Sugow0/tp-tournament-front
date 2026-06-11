import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import type { TournamentStatus } from "~/types/tournament";

const variantMap: Record<TournamentStatus, "default" | "secondary" | "outline"> = {
  OPEN: "default",
  IN_PROGRESS: "secondary",
  CLOSED: "outline",
};

interface Props {
  status: TournamentStatus;
}

export function TournamentStatusBadge({ status }: Props) {
  const { t } = useTranslation();
  return <Badge variant={variantMap[status]}>{t(`tournament.status.${status}`)}</Badge>;
}
