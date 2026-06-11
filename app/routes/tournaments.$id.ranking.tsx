import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { ChampionBanner } from "~/components/ranking/ChampionBanner";
import { RankingTable } from "~/components/ranking/RankingTable";
import { EmptyState } from "~/components/shared/EmptyState";
import { getTournamentRanking } from "~/services/scores.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const ranking = await getTournamentRanking(Number(params.id));
  return { ranking };
}

export default function TournamentRanking() {
  const { ranking } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  if (ranking.ranking.length === 0) {
    return (
      <EmptyState title={t("ranking.empty.title")} description={t("ranking.empty.description")} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ChampionBanner champion={ranking.ranking[0]} />
      <RankingTable rows={ranking.ranking} />
    </div>
  );
}
