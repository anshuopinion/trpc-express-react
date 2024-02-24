import * as trpcExpress from "@trpc/server/adapters/express";
import { TRPCError, initTRPC } from "@trpc/server";
import jwt from "jsonwebtoken";
import prisma from "./db.config";

const decodeAndVerifyJwtToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  return decoded;
};

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  async function getTokenFromHeader() {
    if (req.headers.authorization) {
      const decodedToken = await decodeAndVerifyJwtToken(
        req.headers.authorization?.split(" ")[1]
      );
      return decodedToken as { userId: string; email: string };
    }
    return null;
  }
  const token = await getTokenFromHeader();

  if (!token) {
    return {
      user: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: token?.userId,
    },
    select: {
      email: true,
      avatar: true,
      first_name: true,
      id: true,
      is_email_verified: true,
      last_name: true,
    },
  });

  return {
    user,
  };
}; // no context
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

export const privateProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to access this resource",
    });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});

export { createContext, trpcExpress };
