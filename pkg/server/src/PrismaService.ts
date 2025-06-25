import { PrismaClient } from "../../../generated/prisma/index.js";
import { Effect, Layer } from "effect";

export interface IPrismaService {
  readonly prisma: PrismaClient;
}

export class PrismaService extends Effect.Tag("api/PrismaService")<
  PrismaService,
  IPrismaService
>() {
  static readonly Live = Layer.scoped(
    PrismaService,
    Effect.gen(function* () {
      const client = new PrismaClient({
        log: ["query", "info", "warn", "error"],
      });

      yield* Effect.addFinalizer(() =>
        Effect.promise(() => client.$disconnect()),
      );

      return { prisma: client };
    }),
  );
}
