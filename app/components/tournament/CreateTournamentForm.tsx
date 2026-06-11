import { Swords } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function CreateTournamentForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  return (
    <Form method="post" className="flex flex-col gap-3 w-full sm:w-auto">
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="tournament-name"
          className="font-ui text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-widest"
        >
          {t("tournament.nameLabel")}
        </Label>
        <div className="relative">
          <Swords
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]/60 pointer-events-none"
          />
          <Input
            id="tournament-name"
            name="name"
            placeholder={t("tournament.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            className="pl-9 bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-gold)]/70 focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all h-10 rounded-xl font-ui"
          />
        </div>
      </div>
      <Button type="submit" disabled={name.trim() === ""} className="self-start">
        {t("tournament.create")}
      </Button>
    </Form>
  );
}
