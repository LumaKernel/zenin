import { Effect, Data } from "effect";
import { TodoId, Todo } from "@domain/TodosApi";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5929";

class ApiError extends Data.TaggedError("ApiError")<{
  readonly message: string;
  readonly status?: number;
}> {}

const apiCall = <T>(endpoint: string, options: RequestInit = {}) =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(
        `${baseUrl satisfies string}${endpoint satisfies string}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        },
      );

      if (!response.ok) {
        throw new Error(
          `API call failed: ${response.statusText satisfies string}`,
        );
      }

      if (endpoint.includes("DELETE")) {
        return undefined as T;
      }

      return response.json() as T;
    },
    catch: (error) =>
      new ApiError({
        message: error instanceof Error ? error.message : "Unknown error",
      }),
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
