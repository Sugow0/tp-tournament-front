import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { CreateObjectiveForm } from "~/components/objective/CreateObjectiveForm";
import { ObjectiveCard } from "~/components/objective/ObjectiveCard";
import { EmptyState } from "~/components/shared/EmptyState";
import { createObjective, listSeasonObjectives } from "~/services/objectives.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const objectives = await listSeasonObjectives(Number(params.seasonId));
  return { objectives };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "create") {
    return createObjective({
      seasonId: Number(params.seasonId),
      name: form.get("name") as string,
      description: form.get("description") as string,
      objectiveType: form.get("objectiveType") as string,
      targetValue: Number(form.get("targetValue")),
      xpReward: Number(form.get("xpReward")),
      resetType: form.get("resetType") as string,
    });
  }

  return null;
}

export default function ObjectivesBySeason() {
  const { objectives } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("objective.title")} actions={<CreateObjectiveForm />} />

      <div className="px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12">
        {objectives.length === 0 ? (
          <EmptyState
            title={t("objective.empty.title")}
            description={t("objective.empty.description")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {objectives.map((objective) => (
              <ObjectiveCard key={objective.id} objective={objective} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
