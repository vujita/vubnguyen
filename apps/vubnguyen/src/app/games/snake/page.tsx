import { type Metadata } from "next";
import SnakeGameLoader from "src/app/games/snake/SnakeGameLoader";

export const metadata: Metadata = {
  description: "Classic Snake — built with XState v5 and Phaser 3.",
  title: "Snake — Vu Nguyen",
};

export default function SnakePage() {
  return <SnakeGameLoader />;
}
