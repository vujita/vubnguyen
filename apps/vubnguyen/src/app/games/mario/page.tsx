import { type Metadata } from "next";

import MarioLoader from "src/app/games/mario/MarioLoader";

export const metadata: Metadata = {
  description: "Super Mario clone — built with XState v5 child actors and Phaser 3.",
  title: "Mario Clone — Vu Nguyen",
};

export default function MarioPage() {
  return <MarioLoader />;
}
