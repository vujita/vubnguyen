import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@vujita/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@vujita/api";
