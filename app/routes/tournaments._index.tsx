import { AnimatePresence, motion } from "framer-motion";
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

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: -20,
    transition: { duration: 0.2 },
  },
};

export default function TournamentsIndex() {
  const { tournaments } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { t } = useTranslation();

  return (
    <AppShell>
      <PageHeader title={t("tournament.title")} actions={<CreateTournamentForm />} />

      <div className="py-8 md:py-12">
        <AnimatePresence>
          {actionData && "error" in actionData && (
            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[var(--color-battle)] text-sm mb-6 font-ui"
            >
              {t(actionData.error)}
            </motion.p>
          )}
        </AnimatePresence>

        {tournaments.length === 0 ? (
          <EmptyState
            title={t("tournament.empty.title")}
            description={t("tournament.empty.description")}
          />
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
          >
            <AnimatePresence>
              {tournaments.map((tournament) => (
                <motion.div key={tournament.id} variants={cardVariants} exit="exit" layout>
                  <TournamentCard tournament={tournament} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
