import { redirect } from "react-router";

export function loader() {
  return redirect("/tournaments");
}

export default function Home() {
  return null;
}
