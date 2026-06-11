import { Swords } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect, useLoaderData } from "react-router";
import { NewCombatForm } from "~/components/combat/NewCombatForm";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { listClasses } from "~/services/classes.service";
import { listCombats, startCombat } from "~/services/combats.service";

export async function loader() {
  const [combats, classes] = await Promise.all([listCombats(), listClasses()]);
  return { combats, classes };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "create") {
    const created = await startCombat({
      champion1: {
        name: form.get("champion1Name") as string,
        classId: Number(form.get("champion1ClassId")),
        level: Number(form.get("champion1Level")),
      },
      champion2: {
        name: form.get("champion2Name") as string,
        classId: Number(form.get("champion2ClassId")),
        level: Number(form.get("champion2Level")),
      },
    });
    return redirect(`/combats/${created.id}`);
  }

  return null;
}

export default function CombatsIndex() {
  const { combats, classes } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("combat.title")} />

      <div className="flex flex-col gap-10 px-4 py-8 sm:px-8 md:py-12 lg:px-14 xl:px-20">
        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-[var(--color-text-bright)]">
            {t("combat.new")}
          </h2>
          <NewCombatForm classes={classes} />
        </section>

        <section>
          <h2 className="mb-4 font-heading text-lg font-semibold text-[var(--color-text-bright)]">
            {t("combat.title")}
          </h2>
          {combats.length === 0 ? (
            <EmptyState
              title={t("combat.empty.title")}
              description={t("combat.empty.description")}
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {combats.map((combat) => (
                <Link
                  key={combat.id}
                  to={`/combats/${combat.id}`}
                  className="cr-card flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] p-4 transition-colors hover:border-[var(--color-gold)]/60"
                >
                  <div className="flex items-center gap-2 font-heading text-sm text-[var(--color-text-bright)]">
                    <Swords size={14} className="text-[var(--color-battle)]" aria-hidden="true" />
                    {combat.champion1.name}
                    <span className="text-[var(--color-text-muted)]">{t("combat.vs")}</span>
                    {combat.champion2.name}
                  </div>
                  <span className="font-ui text-[0.65rem] uppercase tracking-wide text-[var(--color-text-muted)]">
                    {t("combat.turn")} {combat.turn}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
