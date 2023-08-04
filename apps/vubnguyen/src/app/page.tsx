import { Suspense } from "react";
import { CreatePostForm, PostList } from "vubnguyenapp/posts";
import { SignIn, SignOut } from "vubnguyencomponents/auth";

import { auth } from "@vujita/auth";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to <span className="text-pink-400">vubnguyen.com</span>
        </h1>
        <AuthShowcase />

        <CreatePostForm />
        <Suspense fallback={<span>Loading...</span>}>
          <PostList />
        </Suspense>
      </div>
    </main>
  );
}

async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <SignIn provider="discord" className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
        Sign in with Discord
      </SignIn>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">{session && <span>Logged in as {session.user.name}</span>}</p>
      {session.user.image && <img src={session.user.image} alt={session.user.name ?? ""} className="h-32 w-32 rounded-full" />}

      <SignOut className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">Sign out</SignOut>
    </div>
  );
}
