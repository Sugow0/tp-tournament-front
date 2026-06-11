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

export function CreateSeasonForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const toIso = (value: string) => (value ? new Date(value).toISOString() : "");

  return (
    <Form method="post" className="flex flex-col gap-3 w-full sm:w-auto">
      <input type="hidden" name="intent" value="create" />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="season-name" className={labelClass}>
          {t("season.name")}
        </Label>
        <Input
          id="season-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="season-start" className={labelClass}>
          {t("season.start")}
        </Label>
        <Input
          id="season-start"
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={inputClass}
        />
        <input type="hidden" name="startDate" value={toIso(start)} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="season-end" className={labelClass}>
          {t("season.end")}
        </Label>
        <Input
          id="season-end"
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={inputClass}
        />
        <input type="hidden" name="endDate" value={toIso(end)} />
      </div>
      <Button
        type="submit"
        disabled={name.trim() === "" || start === "" || end === ""}
        className="self-start"
      >
        {t("season.new")}
      </Button>
    </Form>
  );
}
