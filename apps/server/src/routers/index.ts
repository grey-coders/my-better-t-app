import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { cvRouter } from "./cv";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  cv: cvRouter,
});
export type AppRouter = typeof appRouter;
