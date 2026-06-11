import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { CreateSeasonForm } from "~/components/season/CreateSeasonForm";
import { SeasonCard } from "~/components/season/SeasonCard";
import { EmptyState } from "~/components/shared/EmptyState";
import { createSeason, listSeasons } from "~/services/seasons.service";

export async function loader() {
  const seasons = await listSeasons();
  return { seasons };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;

  switch (intent) {
    case "create": {
      const name = form.get("name") as string;
      const startDate = form.get("startDate") as string;
      const endDate = form.get("endDate") as string;
      return createSeason({ name, startDate, endDate });
    }
    default:
      return null;
  }
}

export default function SeasonsIndex() {
  const { seasons } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("season.title")} actions={<CreateSeasonForm />} />

      <div className="px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12">
        {seasons.length === 0 ? (
          <EmptyState title={t("season.empty.title")} description={t("season.empty.description")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {seasons.map((season) => (
              <SeasonCard key={season.id} season={season} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
