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
    <Form method="post" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tournament-name">{t("tournament.nameLabel")}</Label>
        <Input
          id="tournament-name"
          name="name"
          placeholder={t("tournament.namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="submit" disabled={name.trim() === ""}>
          {t("tournament.create")}
        </Button>
      </div>
    </Form>
  );
}
