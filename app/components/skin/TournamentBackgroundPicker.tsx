import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import type { Skin, TournamentBackground } from "~/types/skin";

interface Props {
  skins: Skin[];
  background: TournamentBackground;
}

export function TournamentBackgroundPicker({ skins, background }: Props) {
  const { t } = useTranslation();
  const backgroundSkins = skins.filter((skin) => skin.category === "BACKGROUND");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)]">
        {t("skin.background.title")}
      </h2>
      <p className="font-ui text-sm text-[var(--color-text-muted)]">
        {t("skin.background.current")}:{" "}
        <span className="text-[var(--color-gold)] font-semibold">{background.skinName ?? "—"}</span>
      </p>
      <Form method="post" className="flex flex-col gap-3 w-full sm:max-w-sm">
        <input type="hidden" name="intent" value="setBackground" />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="background-skin" className="font-ui text-[var(--color-text-muted)]">
            {t("skin.background.choose")}
          </Label>
          <select
            id="background-skin"
            name="skinId"
            defaultValue={background.skinId ?? ""}
            className="rounded-md bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-3 py-2 text-sm font-ui focus:ring-2 focus:ring-[var(--color-gold)]/20"
          >
            {backgroundSkins.map((skin) => (
              <option key={skin.id} value={skin.id}>
                {skin.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={backgroundSkins.length === 0}
          className="self-start bg-[var(--color-royal)] hover:bg-[var(--color-royal)]/80 text-white font-ui font-bold"
        >
          {t("save")}
        </Button>
      </Form>
    </div>
  );
}
