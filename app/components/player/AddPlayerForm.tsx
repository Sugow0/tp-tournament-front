import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function AddPlayerForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  return (
    <Form method="post" className="flex flex-col gap-3">
      <input type="hidden" name="intent" value="addPlayer" />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="player-name" className="font-ui text-[var(--color-text)]">
          {t("player.nameLabel")}
        </Label>
        <Input
          id="player-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <Button type="submit" disabled={!name.trim()} className="self-start">
        {t("player.add")}
      </Button>
    </Form>
  );
}
