import { router } from "../trpc";
import { authRouter } from "./auth";

const appRouter = router({
  auth: authRouter,
});

export { appRouter };
export type AppRouter = typeof appRouter;
