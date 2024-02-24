import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../backend/src/routes";

export const trpc = createTRPCReact<AppRouter>();
