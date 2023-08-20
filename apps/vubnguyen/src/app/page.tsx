import { Suspense } from "react";

import Signature from "../components/signature";
import { PostList } from "./posts";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">{"Hi, I'm"}</h1>
        <Signature />

        <Suspense fallback={<span>{"Loading..."}</span>}>
          <PostList />
        </Suspense>
      </div>
    </div>
  );
}
