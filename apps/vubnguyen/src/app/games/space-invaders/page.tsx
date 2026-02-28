import { type Metadata } from "next";
import SpaceInvadersLoader from "src/app/games/space-invaders/SpaceInvadersLoader";

export const metadata: Metadata = {
  description: "Classic Space Invaders — built with XState v5 and Phaser 3.",
  title: "Space Invaders — Vu Nguyen",
};

export default function SpaceInvadersPage() {
  return <SpaceInvadersLoader />;
}
