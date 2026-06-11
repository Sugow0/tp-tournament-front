import { describe, expect, it } from "vitest";
import i18n from "~/lib/i18n";

describe("i18n", () => {
  it("initializes with French as the active language", () => {
    expect(i18n.language).toBe("fr");
  });

  it("resolves a key from the common namespace", () => {
    expect(i18n.t("errors.loginFailed")).toBe(
      "La connexion a échoué. Vérifiez vos identifiants."
    );
  });

  it("resolves a key from the errors namespace", () => {
    expect(i18n.t("tournament.createFailed", { ns: "errors" })).toBe(
      "La création du tournoi a échoué."
    );
  });
});
