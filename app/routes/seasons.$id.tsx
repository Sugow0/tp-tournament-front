import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { CreateSeasonRewardForm } from "~/components/season/CreateSeasonRewardForm";
import { SeasonRewardList } from "~/components/season/SeasonRewardList";
import { SeasonStatusBadge } from "~/components/season/SeasonStatusBadge";
import { Button } from "~/components/ui/button";
import { createReward, distributeRewards, listRewards } from "~/services/season-rewards.service";
import { getSeason, updateSeasonStatus } from "~/services/seasons.service";
import type { SeasonStatus } from "~/types/season";

const NEXT_STATUS: Partial<Record<SeasonStatus, SeasonStatus>> = {
  UPCOMING: "ACTIVE",
  ACTIVE: "ENDED",
};

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const [season, rewards] = await Promise.all([getSeason(id), listRewards(id)]);
  return { season, rewards };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const seasonId = Number(params.id);

  switch (intent) {
    case "advanceStatus": {
      const current = form.get("status") as SeasonStatus;
      const next = NEXT_STATUS[current];
      if (!next) return null;
      return updateSeasonStatus(seasonId, { status: next });
    }
    case "createReward": {
      const rankMin = Number(form.get("rankMin"));
      const rawMax = form.get("rankMax") as string | null;
      const rankMax = rawMax && rawMax.trim() !== "" ? Number(rawMax) : undefined;
      const rewardType = form.get("rewardType") as string;
      const rewardData = form.get("rewardData") as string;
      const label = form.get("label") as string;
      return createReward(seasonId, { rankMin, rankMax, rewardType, rewardData, label });
    }
    case "distribute": {
      return distributeRewards(seasonId);
    }
    default:
      return null;
  }
}

export default function SeasonDetail() {
  const { season, rewards } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const next = NEXT_STATUS[season.status];

  return (
    <>
      <PageHeader
        title={season.name}
        breadcrumb={[
          { label: t("season.title"), href: "/seasons" },
          { label: season.name, href: `/seasons/${season.id}` },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <SeasonStatusBadge status={season.status} />
            {next && (
              <Form method="post">
                <input type="hidden" name="intent" value="advanceStatus" />
                <input type="hidden" name="status" value={season.status} />
                <Button type="submit">{t("season.advance")}</Button>
              </Form>
            )}
          </div>
        }
      />

      <div className="px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12 flex flex-col gap-10">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)]">
              {t("season.rewards.title")}
            </h2>
            <Form method="post">
              <input type="hidden" name="intent" value="distribute" />
              <Button type="submit" variant="outline">
                {t("season.rewards.distribute")}
              </Button>
            </Form>
          </div>
          <SeasonRewardList rewards={rewards} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)]">
            {t("season.rewards.create")}
          </h2>
          <CreateSeasonRewardForm />
        </section>
      </div>
    </>
  );
}
