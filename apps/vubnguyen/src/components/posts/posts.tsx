"use client";

import { type FC } from "react";
import { CreatePostForm } from "src/components/posts/create-post-form";
import { PostCard } from "src/components/posts/post-card";

import { api } from "@vujita/vubnguyen/src/utils/api";

const PostList: FC = () => {
  const { data: posts = [] } = api.post.all.useQuery();

  return (
    <div className="animate-in w-full max-w-2xl ease-in-out">
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
};

export default PostList;
