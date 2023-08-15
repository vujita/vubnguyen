import { Suspense } from "react";

import { PostList } from "./posts";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col items-center">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">{"Welcome to"}</h1>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-pink-400">{"vubnguyen.com"}</span>
        </h1>

        <Suspense fallback={<span>{"Loading..."}</span>}>
          <PostList />
        </Suspense>
      </div>
    </div>
  );
}
