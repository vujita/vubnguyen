import { type Metadata } from "next";

import DragonSpiritLoader from "src/app/games/dragon-spirit/DragonSpiritLoader";

export const metadata: Metadata = {
  description:
    "Dragon Spirit — vertical-scrolling dragon shooter built with XState v5 and Phaser 3. 9 stages, multi-head power-ups, dual-plane shooting, and boss battles.",
  title: "Dragon Spirit — Vu Nguyen",
};

export default function DragonSpiritPage() {
  return <DragonSpiritLoader />;
}
