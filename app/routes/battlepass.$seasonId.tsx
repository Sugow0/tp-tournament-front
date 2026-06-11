import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { AddTierForm } from "~/components/battlepass/AddTierForm";
import { BattlepassTierRow } from "~/components/battlepass/BattlepassTierRow";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { ApiError } from "~/lib/http";
import { addTier, getBattlepassBySeason, listTiers } from "~/services/battlepass.service";
import type { Battlepass, BattlepassTier } from "~/types/battlepass";

export async function loader({ params }: LoaderFunctionArgs) {
  const seasonId = Number(params.seasonId);
  try {
    const battlepass: Battlepass = await getBattlepassBySeason(seasonId);
    const tiers: BattlepassTier[] = await listTiers(battlepass.id);
    return { battlepass, tiers };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      return { battlepass: null, tiers: [] as BattlepassTier[] };
    }
    throw e;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "addTier") {
    const battlepass = await getBattlepassBySeason(Number(params.seasonId));
    return addTier(battlepass.id, {
      tierNumber: Number(form.get("tierNumber")),
      xpRequired: Number(form.get("xpRequired")),
      isPremium: form.get("isPremium") != null,
      rewardType: form.get("rewardType") as string,
      rewardData: form.get("rewardData") as string,
    });
  }

  return null;
}

export default function BattlepassSeason() {
  const { battlepass, tiers } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("battlepass.title")} />

      <div className="px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12">
        {!battlepass ? (
          <EmptyState
            title={t("battlepass.empty.title")}
            description={t("battlepass.empty.description")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-2">
              {tiers.map((tier) => (
                <BattlepassTierRow key={tier.id} tier={tier} />
              ))}
            </div>
            <div>
              <AddTierForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
