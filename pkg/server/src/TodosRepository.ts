import { Todo, TodoId, TodoNotFound } from "@template/domain/TodosApi";
import { Effect, Layer } from "effect";
import { TodosRepositoryPrisma } from "./TodosRepositoryPrisma.js";

export type TodosRepositoryShape = {
  readonly getAll: Effect.Effect<ReadonlyArray<Todo>>;
  readonly getById: (id: TodoId) => Effect.Effect<Todo, TodoNotFound>;
  readonly create: (text: string) => Effect.Effect<Todo>;
  readonly complete: (id: TodoId) => Effect.Effect<Todo, TodoNotFound>;
  readonly remove: (id: TodoId) => Effect.Effect<void, TodoNotFound>;
};

export class TodosRepository extends Effect.Tag("api/TodosRepository")<
  TodosRepository,
  TodosRepositoryShape
>() {
  static readonly Live = Layer.effect(
    TodosRepository,
    Effect.map(TodosRepositoryPrisma, (prismaRepo) => ({
      getAll: prismaRepo.getAll,
      getById: prismaRepo.getById,
      create: prismaRepo.create,
      complete: prismaRepo.complete,
      remove: prismaRepo.remove,
    })),
  ).pipe(Layer.provide(TodosRepositoryPrisma.Default));
}
