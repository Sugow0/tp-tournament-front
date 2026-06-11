import { useTranslation } from "react-i18next";
import type { PlayerScore } from "~/types/score";

interface Props {
  rows: PlayerScore[];
}

export function RankingTable({ rows }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-arena-surface)]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)] font-heading text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <th className="px-4 py-3">{t("ranking.rank")}</th>
            <th className="px-4 py-3">{t("ranking.name")}</th>
            <th className="px-4 py-3 text-right">{t("ranking.score")}</th>
            <th className="px-4 py-3 text-right">{t("ranking.status")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const rankClass = isFirst
              ? "text-[var(--color-gold)]"
              : "text-[var(--color-text-bright)]";
            const rowClass = row.isDisqualified
              ? "text-[var(--color-text-muted)]"
              : "text-[var(--color-text-bright)]";

            return (
              <tr
                key={row.playerId}
                className={`border-b border-[var(--color-border)] font-ui last:border-b-0 ${rowClass}`}
              >
                <td className={`px-4 py-3 font-heading font-semibold ${rankClass}`}>{rank}</td>
                <td className="px-4 py-3">{row.playerName}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.finalScore}</td>
                <td className="px-4 py-3 text-right">
                  {row.isDisqualified ? (
                    <span className="font-ui text-xs uppercase tracking-wide text-[var(--color-battle)]">
                      {t("player.disqualified")}
                    </span>
                  ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
