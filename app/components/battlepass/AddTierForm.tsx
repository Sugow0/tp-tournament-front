import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AddTierForm() {
  const { t } = useTranslation();

  return (
    <Form
      method="post"
      className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-card p-5"
    >
      <input type="hidden" name="intent" value="addTier" />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tier-tierNumber" className="font-ui text-[var(--color-text-muted)]">
          {t("battlepass.tier")}
        </Label>
        <Input
          id="tier-tierNumber"
          name="tierNumber"
          type="number"
          min={1}
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tier-xpRequired" className="font-ui text-[var(--color-text-muted)]">
          {t("battlepass.xp")}
        </Label>
        <Input
          id="tier-xpRequired"
          name="xpRequired"
          type="number"
          min={0}
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="tier-isPremium"
          type="checkbox"
          name="isPremium"
          className="accent-[var(--color-gold)]"
        />
        <Label htmlFor="tier-isPremium" className="font-ui text-[var(--color-text-muted)]">
          {t("battlepass.premium")}
        </Label>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tier-rewardType" className="font-ui text-[var(--color-text-muted)]">
          {t("battlepass.rewardType")}
        </Label>
        <Input
          id="tier-rewardType"
          name="rewardType"
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tier-rewardData" className="font-ui text-[var(--color-text-muted)]">
          {t("battlepass.rewardData")}
        </Label>
        <Input
          id="tier-rewardData"
          name="rewardData"
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <Button type="submit" className="self-start font-ui font-bold">
        {t("battlepass.addTier")}
      </Button>
    </Form>
  );
}
