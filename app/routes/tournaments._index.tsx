import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useActionData, useLoaderData } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { CreateTournamentForm } from "~/components/tournament/CreateTournamentForm";
import { TournamentCard } from "~/components/tournament/TournamentCard";
import { ApiError } from "~/lib/http";
import { createTournament, listTournaments } from "~/services/tournaments.service";

export async function loader() {
  const tournaments = await listTournaments();
  return { tournaments };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const name = form.get("name") as string;
  try {
    const tournament = await createTournament({ name });
    return redirect(`/tournaments/${tournament.id}`);
  } catch (e) {
    if (e instanceof ApiError) return { error: "errors.createFailed" };
    throw e;
  }
}

export default function TournamentsIndex() {
  const { tournaments } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation();

  return (
    <AppShell>
      <PageHeader title={t("tournament.title")} actions={<CreateTournamentForm />} />
      <div className="p-4 md:p-6">
        {actionData && "error" in actionData && (
          <p className="text-[var(--color-battle)] text-sm mb-4">{t(actionData.error)}</p>
        )}
        {tournaments.length === 0 ? (
          <EmptyState
            title={t("tournament.empty.title")}
            description={t("tournament.empty.description")}
          />
        ) : (
          <div className="grid gap-3">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
