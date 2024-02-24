import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { appRouter } from "./routes";
import cors from "cors";
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);
app.listen(4000, () => {
  console.log("Server started on http://localhost:4000/trpc");
});
