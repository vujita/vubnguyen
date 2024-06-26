"use client";

import { useState } from "react";

import { type RouterOutputs } from "@vujita/api";
import { api } from "@vujita/vubnguyen/src/utils/api";

export function CreatePostForm() {
  const context = api.useContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutateAsync: createPost, error } = api.post.create.useMutation({
    async onSuccess() {
      setTitle("");
      setContent("");
      await context.post.all.invalidate();
    },
  });

  return (
    <form
      className="flex w-full max-w-2xl flex-col p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        await createPost({
          content,
          title,
        });
        setTitle("");
        setContent("");
        await context.post.all.invalidate();
      }}
    >
      <input
        className="mb-2 rounded bg-gray-100 p-2 dark:bg-white/10 dark:text-white"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        value={title}
      />
      {!!error?.data?.zodError?.fieldErrors.title && <span className="mb-2 text-red-500">{error.data.zodError.fieldErrors.title}</span>}
      <input
        className="mb-2 rounded bg-gray-100 p-2 dark:bg-white/10 dark:text-white"
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        value={content}
      />
      {!!error?.data?.zodError?.fieldErrors.content && <span className="mb-2 text-red-500">{error.data.zodError.fieldErrors.content}</span>}
      <button
        className="rounded bg-pink-400 p-2 font-bold"
        type="submit"
      >
        {"Create"}
      </button>
    </form>
  );
}

export function PostList() {
  const [posts] = api.post.all.useSuspenseQuery();

  return (
    <div className="w-full max-w-2xl">
      <CreatePostForm />
      {posts.length === 0 ? (
        <span>{"There are no posts!"}</span>
      ) : (
        <div className="flex h-[40vh] justify-center overflow-y-auto px-4 text-2xl">
          <div className="flex w-full flex-col gap-4">
            {posts.map((p) => {
              return (
                <PostCard
                  key={p.id}
                  post={p}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard(props: { post: RouterOutputs["post"]["all"][number] }) {
  const context = api.useContext();
  const deletePost = api.post.delete.useMutation();

  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-pink-400">{props.post.title}</h2>
        <p className="mt-2 text-sm">{props.post.content}</p>
      </div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={async () => {
            await deletePost.mutateAsync(props.post.id);
            await context.post.all.invalidate();
          }}
          type="button"
        >
          {"Delete"}
        </button>
      </div>
    </div>
  );
}
