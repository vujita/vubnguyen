import { type FC } from "react";
import { api } from "src/utils/api";

import { type RouterOutputs } from "@vujita/api";

export const PostCard: FC<{ post: RouterOutputs["post"]["all"][number] }> = (props) => {
  const context = api.useContext();
  const deletePost = api.post.delete.useMutation();

  return (
    <div className="animate-in flex flex-row rounded-lg bg-white/10 p-4 transition-all ease-in hover:scale-105">
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
};
