"use client";

import dynamic from "next/dynamic";
import { withSuspense } from "src/utils/with-suspense";
import { Skeleton } from "vujita-ui/skeleton";

const PostList = dynamic(() => import("src/components/posts/posts"), {
  ssr: false,
});

const skeleton = (
  <Skeleton
    className="h-32"
    width="full"
  />
);

export const LazyPosts = withSuspense(PostList, skeleton);
