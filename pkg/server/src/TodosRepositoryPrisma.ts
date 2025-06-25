import { Todo, TodoId, TodoNotFound } from "@template/domain/TodosApi";
import { Effect, Layer, Option } from "effect";
import { PrismaService } from "./PrismaService.js";

export type TodosRepositoryPrismaShape = {
  readonly getAll: Effect.Effect<ReadonlyArray<Todo>>;
  readonly getById: (id: TodoId) => Effect.Effect<Todo, TodoNotFound>;
  readonly create: (text: string) => Effect.Effect<Todo>;
  readonly complete: (id: TodoId) => Effect.Effect<Todo, TodoNotFound>;
  readonly remove: (id: TodoId) => Effect.Effect<void, TodoNotFound>;
};

export class TodosRepositoryPrisma extends Effect.Tag(
  "api/TodosRepositoryPrisma",
)<TodosRepositoryPrisma, TodosRepositoryPrismaShape>() {
  static readonly Default = Layer.effect(
    TodosRepositoryPrisma,
    Effect.gen(function* () {
      const { prisma } = yield* PrismaService;

      const getAll = Effect.promise(() =>
        prisma.todo.findMany({
          orderBy: { id: "asc" },
        }),
      ).pipe(
        Effect.map((todos) =>
          todos.map(
            (todo) =>
              new Todo({
                id: TodoId.make(todo.id),
                text: todo.text,
                done: todo.done,
              }),
          ),
        ),
      );

      function getById(id: TodoId): Effect.Effect<Todo, TodoNotFound> {
        return Effect.promise(() =>
          prisma.todo.findUnique({
            where: { id },
          }),
        ).pipe(
          Effect.map(Option.fromNullable),
          Effect.flatMap(
            Option.match({
              onNone: () => Effect.fail(new TodoNotFound({ id })),
              onSome: (todo) =>
                Effect.succeed(
                  new Todo({
                    id: TodoId.make(todo.id),
                    text: todo.text,
                    done: todo.done,
                  }),
                ),
            }),
          ),
        );
      }

      function create(text: string): Effect.Effect<Todo> {
        return Effect.promise(() =>
          prisma.todo.create({
            data: { text, done: false },
          }),
        ).pipe(
          Effect.map(
            (todo) =>
              new Todo({
                id: TodoId.make(todo.id),
                text: todo.text,
                done: todo.done,
              }),
          ),
        );
      }

      function complete(id: TodoId): Effect.Effect<Todo, TodoNotFound> {
        return Effect.promise(() =>
          prisma.todo.update({
            where: { id },
            data: { done: true },
          }),
        ).pipe(
          Effect.map(
            (todo) =>
              new Todo({
                id: TodoId.make(todo.id),
                text: todo.text,
                done: todo.done,
              }),
          ),
          Effect.catchAll(() => Effect.fail(new TodoNotFound({ id }))),
        );
      }

      function remove(id: TodoId): Effect.Effect<void, TodoNotFound> {
        return Effect.promise(() =>
          prisma.todo.delete({
            where: { id },
          }),
        ).pipe(
          Effect.map(() => undefined),
          Effect.catchAll(() => Effect.fail(new TodoNotFound({ id }))),
        );
      }

      return {
        getAll,
        getById,
        create,
        complete,
        remove,
      } as const;
    }),
  ).pipe(Layer.provide(PrismaService.Live));
}
