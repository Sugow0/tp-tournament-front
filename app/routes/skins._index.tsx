import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router";
import { Form, useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { CreateSkinForm } from "~/components/skin/CreateSkinForm";
import { SkinCard } from "~/components/skin/SkinCard";
import { Button } from "~/components/ui/button";
import { createSkin, deactivateSkin, listSkins } from "~/services/skins.service";
import type { SkinCategory } from "~/types/skin";

export async function loader() {
  const skins = await listSkins();
  return { skins };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;

  switch (intent) {
    case "create": {
      const category = form.get("category") as SkinCategory;
      const name = form.get("name") as string;
      const assetKey = form.get("assetKey") as string;
      const isPremium = form.get("isPremium") != null;
      return createSkin({ category, name, assetKey, isPremium });
    }
    case "deactivate": {
      const skinId = Number(form.get("skinId"));
      return deactivateSkin(skinId);
    }
    default:
      return null;
  }
}

export default function SkinsIndex() {
  const { skins } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t("skin.title")} actions={<CreateSkinForm />} />

      <div className="py-8 md:py-12">
        {skins.length === 0 ? (
          <EmptyState title={t("skin.empty.title")} description={t("skin.empty.description")} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            {skins.map((skin) => (
              <SkinCard key={skin.id} skin={skin}>
                <Form method="post">
                  <input type="hidden" name="intent" value="deactivate" />
                  <input type="hidden" name="skinId" value={skin.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    className="font-ui text-[var(--color-battle)] border-[var(--color-border)]"
                  >
                    {t("skin.deactivate")}
                  </Button>
                </Form>
              </SkinCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
