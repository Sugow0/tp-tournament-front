import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { TournamentBackgroundPicker } from "~/components/skin/TournamentBackgroundPicker";
import {
  getTournamentBackground,
  listSkins,
  setTournamentBackground,
} from "~/services/skins.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const skins = await listSkins();
  const background = await getTournamentBackground(Number(params.id));
  return { skins, background };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const tournamentId = Number(params.id);

  switch (intent) {
    case "setBackground": {
      const skinId = Number(form.get("skinId"));
      return setTournamentBackground(tournamentId, { skinId });
    }
    default:
      return null;
  }
}

export default function TournamentCosmetics() {
  const { skins, background } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-6">
      <TournamentBackgroundPicker skins={skins} background={background} />
    </div>
  );
}
