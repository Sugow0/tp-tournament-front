import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { AppShell } from "~/components/layout/AppShell";
import { PageHeader } from "~/components/layout/PageHeader";
import { CosmeticSnapshotCard } from "~/components/replay/CosmeticSnapshotCard";
import { ReplayTimeline } from "~/components/replay/ReplayTimeline";
import { EmptyState } from "~/components/shared/EmptyState";
import { getCosmeticSnapshot, listReplayEvents } from "~/services/replays.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const duelId = Number(params.duelId);
  const [events, snapshot] = await Promise.all([
    listReplayEvents(duelId),
    getCosmeticSnapshot(duelId),
  ]);
  return { events, snapshot };
}

export default function DuelReplay() {
  const { events, snapshot } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <AppShell>
      <PageHeader title={t("replay.title")} />

      <div className="py-8 md:py-12 flex flex-col gap-6">
        <CosmeticSnapshotCard snapshot={snapshot} />

        {events.length > 0 ? (
          <ReplayTimeline events={events} />
        ) : (
          <EmptyState title={t("replay.empty.title")} description={t("replay.empty.description")} />
        )}
      </div>
    </AppShell>
  );
}
