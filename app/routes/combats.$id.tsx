import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { CombatArena } from "~/components/combat/CombatArena";
import { PageHeader } from "~/components/layout/PageHeader";
import { getClassSkills, listClasses } from "~/services/classes.service";
import { forfeit, getCombat, submitAction } from "~/services/combats.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = Number(params.id);
  const combat = await getCombat(id);
  const [class1Skills, class2Skills, classes] = await Promise.all([
    getClassSkills(combat.champion1.classId),
    getClassSkills(combat.champion2.classId),
    listClasses(),
  ]);
  return { combat, class1Skills, class2Skills, classes };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const id = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  switch (intent) {
    case "submit": {
      const slot = Number(form.get("slot")) as 1 | 2;
      const skillId = Number(form.get("skillId"));
      return submitAction(id, { slot, skillId });
    }
    case "forfeit": {
      const slot = Number(form.get("slot")) as 1 | 2;
      return forfeit(id, { slot });
    }
    default:
      return null;
  }
}

export default function CombatDetail() {
  const { combat, class1Skills, class2Skills, classes } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={`${combat.champion1.name} ${t("combat.vs")} ${combat.champion2.name}`} />

      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 md:py-12 lg:px-14 xl:px-20">
        <Link
          to="/combats"
          className="inline-flex items-center gap-1.5 font-ui text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t("combat.title")}
        </Link>

        <CombatArena
          combat={combat}
          class1Skills={class1Skills}
          class2Skills={class2Skills}
          classes={classes}
        />
      </div>
    </>
  );
}
