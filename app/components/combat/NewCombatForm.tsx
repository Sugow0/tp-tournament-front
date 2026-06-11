import { Swords } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { ChampionClass } from "~/types/combat";

interface Props {
  classes: ChampionClass[];
}

interface ColumnProps {
  slot: 1 | 2;
  title: string;
  classes: ChampionClass[];
}

function ChampionColumn({ slot, title, classes }: ColumnProps) {
  const { t } = useTranslation();
  const prefix = `champion${slot}`;

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-arena-surface)] p-4">
      <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
        {title}
      </legend>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-name`} className="font-ui text-[var(--color-text-muted)]">
          {t("combat.name")}
        </Label>
        <Input
          id={`${prefix}-name`}
          name={`${prefix}Name`}
          autoComplete="off"
          required
          className="border-[var(--color-border)] bg-[var(--color-arena-bg)] text-[var(--color-text-bright)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-class`} className="font-ui text-[var(--color-text-muted)]">
          {t("combat.class")}
        </Label>
        <select
          id={`${prefix}-class`}
          name={`${prefix}ClassId`}
          defaultValue={classes[0]?.id}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-arena-bg)] px-3 py-2 font-ui text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${prefix}-level`} className="font-ui text-[var(--color-text-muted)]">
          {t("combat.level")}
        </Label>
        <Input
          id={`${prefix}-level`}
          name={`${prefix}Level`}
          type="number"
          min={1}
          defaultValue={1}
          className="border-[var(--color-border)] bg-[var(--color-arena-bg)] text-[var(--color-text-bright)]"
        />
      </div>
    </fieldset>
  );
}

export function NewCombatForm({ classes }: Props) {
  const { t } = useTranslation();

  return (
    <Form method="post" className="flex flex-col gap-4">
      <input type="hidden" name="intent" value="create" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChampionColumn slot={1} title={t("combat.champion1")} classes={classes} />
        <ChampionColumn slot={2} title={t("combat.champion2")} classes={classes} />
      </div>
      <Button
        type="submit"
        className="self-start bg-[var(--color-royal)] font-ui font-bold text-white hover:bg-[var(--color-royal)]/80"
      >
        <Swords size={16} aria-hidden="true" />
        {t("combat.new")}
      </Button>
    </Form>
  );
}
