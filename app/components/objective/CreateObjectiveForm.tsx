import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const RESET_TYPES = ["DAILY", "WEEKLY", "SEASONAL"] as const;

const inputClass =
  "bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]";
const selectClass =
  "rounded-md bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-3 py-2 text-sm font-ui focus:ring-2 focus:ring-[var(--color-gold)]/20";

export function CreateObjectiveForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  return (
    <Form method="post" className="flex flex-col gap-3 w-full sm:max-w-sm">
      <input type="hidden" name="intent" value="create" />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-name" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.name")}
        </Label>
        <Input
          id="objective-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-description" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.description")}
        </Label>
        <textarea id="objective-description" name="description" rows={2} className={selectClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-objectiveType" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.type")}
        </Label>
        <Input
          id="objective-objectiveType"
          name="objectiveType"
          autoComplete="off"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-targetValue" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.target")}
        </Label>
        <Input
          id="objective-targetValue"
          name="targetValue"
          type="number"
          min={1}
          defaultValue={1}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-xpReward" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.xpReward")}
        </Label>
        <Input
          id="objective-xpReward"
          name="xpReward"
          type="number"
          min={0}
          defaultValue={0}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="objective-resetType" className="font-ui text-[var(--color-text-muted)]">
          {t("objective.reset.label")}
        </Label>
        <select
          id="objective-resetType"
          name="resetType"
          defaultValue="DAILY"
          className={selectClass}
        >
          {RESET_TYPES.map((resetType) => (
            <option key={resetType} value={resetType}>
              {t(`objective.reset.${resetType}`)}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={!name.trim()}
        className="self-start bg-[var(--color-royal)] hover:bg-[var(--color-royal)]/80 text-white font-ui font-bold"
      >
        {t("objective.new")}
      </Button>
    </Form>
  );
}
