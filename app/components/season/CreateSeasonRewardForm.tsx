import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const inputClass =
  "bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all h-10 rounded-sm font-ui";

const labelClass =
  "font-ui text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest";

export function CreateSeasonRewardForm() {
  const { t } = useTranslation();
  const [rankMin, setRankMin] = useState("");
  const [label, setLabel] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [rewardData, setRewardData] = useState("");

  const isValid =
    rankMin.trim() !== "" &&
    label.trim() !== "" &&
    rewardType.trim() !== "" &&
    rewardData.trim() !== "";

  return (
    <Form method="post" className="flex flex-col gap-3">
      <input type="hidden" name="intent" value="createReward" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reward-rankMin" className={labelClass}>
            {t("season.rank")} (min)
          </Label>
          <Input
            id="reward-rankMin"
            name="rankMin"
            type="number"
            min={1}
            value={rankMin}
            onChange={(e) => setRankMin(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reward-rankMax" className={labelClass}>
            {t("season.rank")} (max)
          </Label>
          <Input id="reward-rankMax" name="rankMax" type="number" min={1} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reward-type" className={labelClass}>
            {t("season.rewards.type")}
          </Label>
          <Input
            id="reward-type"
            name="rewardType"
            value={rewardType}
            onChange={(e) => setRewardType(e.target.value)}
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reward-data" className={labelClass}>
            {t("season.rewards.data")}
          </Label>
          <Input
            id="reward-data"
            name="rewardData"
            value={rewardData}
            onChange={(e) => setRewardData(e.target.value)}
            autoComplete="off"
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reward-label" className={labelClass}>
          {t("season.label")}
        </Label>
        <Input
          id="reward-label"
          name="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoComplete="off"
          className={inputClass}
        />
      </div>
      <Button type="submit" disabled={!isValid} className="self-start">
        {t("season.rewards.create")}
      </Button>
    </Form>
  );
}
