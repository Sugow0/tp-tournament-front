import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChallengeCard } from "~/components/social/ChallengeCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Challenge } from "~/types/challenge";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const currentUserId = 1;

const incomingPending: Challenge = {
  id: 10,
  challengerUserId: 2,
  challengerEmail: "rival@avalon.io",
  opponentUserId: 1,
  opponentEmail: "me@avalon.io",
  status: "PENDING",
  combatId: null,
  createdAt: "2026-01-01T00:00:00Z",
};

const outgoingPending: Challenge = {
  ...incomingPending,
  challengerUserId: 1,
  challengerEmail: "me@avalon.io",
  opponentUserId: 2,
  opponentEmail: "rival@avalon.io",
};

describe("ChallengeCard", () => {
  it("renders both emails of the matchup", () => {
    renderWithRouter(<ChallengeCard challenge={incomingPending} currentUserId={currentUserId} />);
    expect(screen.getByText("rival@avalon.io")).toBeInTheDocument();
    expect(screen.getByText("me@avalon.io")).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    renderWithRouter(<ChallengeCard challenge={incomingPending} currentUserId={currentUserId} />);
    expect(screen.getByText("challenges.status.PENDING")).toBeInTheDocument();
  });

  it("shows accept/decline buttons for an incoming PENDING challenge", () => {
    renderWithRouter(<ChallengeCard challenge={incomingPending} currentUserId={currentUserId} />);
    expect(screen.getByText("challenges.accept")).toBeInTheDocument();
    expect(screen.getByText("challenges.decline")).toBeInTheDocument();
  });

  it("does not show accept/decline buttons for an outgoing PENDING challenge", () => {
    renderWithRouter(<ChallengeCard challenge={outgoingPending} currentUserId={currentUserId} />);
    expect(screen.queryByText("challenges.accept")).not.toBeInTheDocument();
    expect(screen.queryByText("challenges.decline")).not.toBeInTheDocument();
  });

  it("does not show accept/decline buttons when the challenge is not PENDING", () => {
    renderWithRouter(
      <ChallengeCard
        challenge={{ ...incomingPending, status: "ACCEPTED", combatId: 5 }}
        currentUserId={currentUserId}
      />
    );
    expect(screen.queryByText("challenges.accept")).not.toBeInTheDocument();
    expect(screen.queryByText("challenges.decline")).not.toBeInTheDocument();
  });

  it("calls onAccept with the challenge when accept is clicked", () => {
    const onAccept = vi.fn();
    renderWithRouter(
      <ChallengeCard
        challenge={incomingPending}
        currentUserId={currentUserId}
        onAccept={onAccept}
      />
    );
    fireEvent.click(screen.getByText("challenges.accept"));
    expect(onAccept).toHaveBeenCalledWith(incomingPending);
  });

  it("calls onDecline with the challenge when decline is clicked", () => {
    const onDecline = vi.fn();
    renderWithRouter(
      <ChallengeCard
        challenge={incomingPending}
        currentUserId={currentUserId}
        onDecline={onDecline}
      />
    );
    fireEvent.click(screen.getByText("challenges.decline"));
    expect(onDecline).toHaveBeenCalledWith(incomingPending);
  });
});
