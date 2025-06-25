import { Effect, Data } from "effect";
import { TodoId, Todo } from "@domain/TodosApi";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5929";

class ApiError extends Data.TaggedError("ApiError")<{
  readonly message: string;
  readonly status?: number;
}> {}

const apiCall = <T>(
  endpoint: string,
  options: RequestInit = {},
): Effect.Effect<T, ApiError> =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () =>
        fetch(`${baseUrl satisfies string}${endpoint satisfies string}`, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        }),
      catch: (error) =>
        new ApiError({
          message: error instanceof Error ? error.message : "Network error",
        }),
    });

    if (!response.ok) {
      return yield* Effect.fail(
        new ApiError({
          message: `API call failed: ${response.statusText satisfies string}`,
          status: response.status,
        }),
      );
    }

    if (options.method === "DELETE") {
      return undefined as T;
    }

    const result = yield* Effect.tryPromise({
      try: () => response.json() as Promise<T>,
      catch: () =>
        new ApiError({
          message: "Failed to parse JSON response",
        }),
    });

    return result;
  });

export const todosApi = {
  getAllTodos: () => apiCall<ReadonlyArray<Todo>>("/todos"),

  getTodoById: (id: TodoId) => apiCall<Todo>(`/todos/${id satisfies number}`),

  createTodo: (text: string) =>
    apiCall<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  completeTodo: (id: TodoId) =>
    apiCall<Todo>(`/todos/${id satisfies number}`, {
      method: "PATCH",
    }),

  removeTodo: (id: TodoId) =>
    apiCall<undefined>(`/todos/${id satisfies number}`, {
      method: "DELETE",
    }),
};
