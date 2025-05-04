import { useState, type FC } from "react";
import { api } from "src/utils/api";

export const CreatePostForm: FC = () => {
  const context = api.useContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutateAsync: createPost, error } = api.post.create.useMutation({
    onSuccess() {
      setTitle("");
      setContent("");
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
};
