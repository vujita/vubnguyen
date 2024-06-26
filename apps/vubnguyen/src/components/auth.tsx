import { type ComponentProps } from "react";

import { type OAuthProviders } from "@vujita/auth";

export function SignIn({ provider, ...props }: { provider: OAuthProviders } & ComponentProps<"button">) {
  return (
    <form
      action={`/api/auth/signin/${provider}`}
      method="post"
    >
      <button
        {...props}
        type="submit"
      />
    </form>
  );
}

export function SignOut(props: ComponentProps<"button">) {
  return (
    <form
      action="/api/auth/signout"
      method="post"
    >
      <button
        {...props}
        type="submit"
      />
    </form>
  );
}
