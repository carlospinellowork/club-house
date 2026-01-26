
import { cache } from "react";
import { createContext } from "./context";
import { appRouter } from "./routers/_app";
import { createCallerFactory } from "./trpc";

const createCaller = createCallerFactory(appRouter);

export const api = cache(async () => {
  const ctx = await createContext();
  return createCaller(ctx);
});
