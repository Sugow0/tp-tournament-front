import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { SkinCategory } from "~/types/skin";

const CATEGORIES: SkinCategory[] = ["PLAYER", "BACKGROUND"];

export function CreateSkinForm() {
  const { t } = useTranslation();
  const [name, setName] = useState("");

  return (
    <Form method="post" className="flex flex-col gap-3 w-full sm:max-w-sm">
      <input type="hidden" name="intent" value="create" />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="skin-category" className="font-ui text-[var(--color-text-muted)]">
          {t("skin.category")}
        </Label>
        <select
          id="skin-category"
          name="category"
          defaultValue="PLAYER"
          className="rounded-md bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-3 py-2 text-sm font-ui focus:ring-2 focus:ring-[var(--color-gold)]/20"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {t(`skin.categories.${category}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="skin-name" className="font-ui text-[var(--color-text-muted)]">
          {t("skin.name")}
        </Label>
        <Input
          id="skin-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="skin-assetKey" className="font-ui text-[var(--color-text-muted)]">
          {t("skin.assetKey")}
        </Label>
        <Input
          id="skin-assetKey"
          name="assetKey"
          autoComplete="off"
          className="bg-[var(--color-arena-surface)] border-[var(--color-border)] text-[var(--color-text-bright)] focus:ring-[var(--color-gold)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="skin-isPremium"
          type="checkbox"
          name="isPremium"
          className="accent-[var(--color-gold)]"
        />
        <Label htmlFor="skin-isPremium" className="font-ui text-[var(--color-text-muted)]">
          {t("skin.premium")}
        </Label>
      </div>
      <Button
        type="submit"
        disabled={!name.trim()}
        className="self-start bg-[var(--color-royal)] hover:bg-[var(--color-royal)]/80 text-white font-ui font-bold"
      >
        {t("skin.create")}
      </Button>
    </Form>
  );
}
