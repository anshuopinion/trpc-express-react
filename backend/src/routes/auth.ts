import { privateProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

import prisma from "../db.config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmailHandler } from "../mailgun";
import { TRPCError } from "@trpc/server";
const generateAccessToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "30s",
  });
};

const generateRefreshToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
const hashData = async (token: string) => {
  return await bcrypt.hash(token, 10);
};

const updateRefreshToken = async (userId: string, refreshToken: string) => {
  const hashedRefreshToken = await hashData(refreshToken);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refresh_token: hashedRefreshToken,
    },
  });
};

const getTokens = async (userId: string, email: string) => {
  const [access_token, refresh_token] = await Promise.all([
    generateAccessToken(userId, email),
    generateRefreshToken(userId, email),
  ]);
  return {
    access_token,
    refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + 900,
  };
};

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string({
          required_error: "Email is required",
        }),
        password: z.string({
          required_error: "Password is required",
        }),
        first_name: z.string({
          required_error: "First name is required",
        }),
        last_name: z.string({
          required_error: "Last name is required",
        }),
      })
    )
    .mutation(async (opts) => {
      const { email, first_name, last_name, password } = opts.input;

      const existingUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (existingUser)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          first_name,
          last_name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
        },
      });
      return user;
    }),

  signin: publicProcedure
    .input(
      z.object({
        email: z.string({
          required_error: "Email is required",
        }),
        password: z.string({
          required_error: "Password is required",
        }),
      })
    )
    .mutation(async (opts) => {
      const { email, password } = opts.input;

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Access Denied",
        });

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Password is incorrect",
        });

      const tokens = await getTokens(user.id, user.email);
      await updateRefreshToken(user.id, tokens.refresh_token);

      return {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        id: user.id,
        ...tokens,
      };
    }),
  logout: publicProcedure.mutation(async (opts) => {
    const user = opts.ctx.user;
    if (!user)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Access Denied",
      });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refresh_token: null,
      },
    });
    return { message: "Logged out" };
  }),

  me: privateProcedure.query(async (opts) => {
    const user = opts.ctx.user;
    return user;
  }),
  refreshToken: publicProcedure
    .input(
      z.object({
        userId: z.string({
          required_error: "User ID is required",
        }),
        refreshToken: z.string({
          required_error: "Refresh token is required",
        }),
      })
    )
    .mutation(async (opts) => {
      const { userId, refreshToken } = opts.input;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Access Denied",
        });
      const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.refresh_token || ""
      );
      if (!refreshTokenMatches)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Access Denied",
        });
      const tokens = await getTokens(user.id, user.email);
      await updateRefreshToken(user.id, tokens.refresh_token);
      return {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        id: user.id,
        ...tokens,
      };
    }),
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string({
          required_error: "Email is required",
        }),
      })
    )
    .mutation(async (opts) => {
      const { email } = opts.input;
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const token = jwt.sign(
        { userId: user.id },
        process.env.RESET_TOKEN_SECRET!,
        {
          expiresIn: "1d",
        }
      );

      const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendEmailHandler([email], "Reset Password", link);
      return { message: "Email Sent" };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string({
          required_error: "Token is required",
        }),
        password: z.string({
          required_error: "Password is required",
        }),
      })
    )
    .mutation(async (opts) => {
      const { token, password } = opts.input;
      const { userId } = jwt.verify(token, process.env.RESET_TOKEN_SECRET!, {
        maxAge: "15m",
      }) as {
        userId: string;
      };

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return { message: "Password changed" };
    }),
});
