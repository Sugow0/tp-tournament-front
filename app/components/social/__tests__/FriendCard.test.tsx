import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FriendCard } from "~/components/social/FriendCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { User } from "~/types/friend";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const friend: User = { id: 2, email: "lancelot@avalon.io" };

describe("FriendCard", () => {
  it("renders the friend email", () => {
    renderWithRouter(<FriendCard user={friend} />);
    expect(screen.getByText("lancelot@avalon.io")).toBeInTheDocument();
  });

  it("renders the avatar initial from the email", () => {
    renderWithRouter(<FriendCard user={friend} />);
    expect(screen.getByText("L")).toBeInTheDocument();
  });

  it("calls onChallenge when the challenge button is clicked", () => {
    const onChallenge = vi.fn();
    renderWithRouter(<FriendCard user={friend} onChallenge={onChallenge} />);
    fireEvent.click(screen.getByText("friends.challenge"));
    expect(onChallenge).toHaveBeenCalledWith(friend);
  });

  it("calls onRemove when the remove button is clicked", () => {
    const onRemove = vi.fn();
    renderWithRouter(<FriendCard user={friend} onRemove={onRemove} />);
    fireEvent.click(screen.getByText("friends.remove"));
    expect(onRemove).toHaveBeenCalledWith(friend);
  });

  it("calls onAdd when the add button is clicked", () => {
    const onAdd = vi.fn();
    renderWithRouter(<FriendCard user={friend} onAdd={onAdd} />);
    fireEvent.click(screen.getByText("friends.add"));
    expect(onAdd).toHaveBeenCalledWith(friend);
  });
});
