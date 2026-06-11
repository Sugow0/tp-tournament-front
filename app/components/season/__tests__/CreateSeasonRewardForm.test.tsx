import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateSeasonRewardForm } from "~/components/season/CreateSeasonRewardForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CreateSeasonRewardForm", () => {
  it("contains a hidden intent field with value createReward", () => {
    renderWithRouter(<CreateSeasonRewardForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("createReward");
  });

  it("renders rankMin, rankMax, rewardType, rewardData and label inputs", () => {
    renderWithRouter(<CreateSeasonRewardForm />);
    expect(document.querySelector('input[name="rankMin"]')).not.toBeNull();
    expect(document.querySelector('input[name="rankMax"]')).not.toBeNull();
    expect(document.querySelector('input[name="rewardType"]')).not.toBeNull();
    expect(document.querySelector('input[name="rewardData"]')).not.toBeNull();
    expect(document.querySelector('input[name="label"]')).not.toBeNull();
  });

  it("disables submit while required fields are empty", () => {
    renderWithRouter(<CreateSeasonRewardForm />);
    expect(screen.getByRole("button", { name: "season.rewards.create" })).toBeDisabled();
  });

  it("keeps submit disabled when only some required fields are filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonRewardForm />);
    await user.type(document.querySelector('input[name="rankMin"]') as HTMLInputElement, "1");
    await user.type(document.querySelector('input[name="rewardType"]') as HTMLInputElement, "SKIN");
    expect(screen.getByRole("button", { name: "season.rewards.create" })).toBeDisabled();
  });

  it("enables submit once all required fields are filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonRewardForm />);

    await user.type(document.querySelector('input[name="rankMin"]') as HTMLInputElement, "1");
    await user.type(document.querySelector('input[name="rewardType"]') as HTMLInputElement, "SKIN");
    await user.type(
      document.querySelector('input[name="rewardData"]') as HTMLInputElement,
      "dragon"
    );
    await user.type(
      document.querySelector('input[name="label"]') as HTMLInputElement,
      "Récompense"
    );

    expect(screen.getByRole("button", { name: "season.rewards.create" })).toBeEnabled();
  });

  it("keeps submit disabled when a required field is only whitespace", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonRewardForm />);
    await user.type(document.querySelector('input[name="rankMin"]') as HTMLInputElement, "1");
    await user.type(document.querySelector('input[name="rewardType"]') as HTMLInputElement, "SKIN");
    await user.type(
      document.querySelector('input[name="rewardData"]') as HTMLInputElement,
      "dragon"
    );
    await user.type(document.querySelector('input[name="label"]') as HTMLInputElement, "   ");
    expect(screen.getByRole("button", { name: "season.rewards.create" })).toBeDisabled();
  });
});
