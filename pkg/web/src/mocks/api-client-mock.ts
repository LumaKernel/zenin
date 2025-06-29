import { Effect } from "effect";
import { Todo, TodoId } from "@domain/TodosApi";

// モック用のAPIクライアント
export const createMockTodosApi = (mockData: {
  todos?: ReadonlyArray<Todo>;
  error?: string;
  loading?: boolean;
}) => ({
  getAllTodos: () => {
    if (mockData.error) {
      return Effect.fail(new Error(mockData.error));
    }
    if (mockData.loading) {
      // 永続的にpendingな状態を作成
      return Effect.suspend(() => Effect.never);
    }
    return Effect.succeed(mockData.todos || []);
  },

  getTodoById: (id: TodoId) => {
    if (mockData.error) {
      return Effect.fail(new Error(mockData.error));
    }
    if (mockData.loading) {
      return Effect.suspend(() => Effect.never);
    }
    const todo = (mockData.todos || []).find((t) => t.id === id);
    return todo ? Effect.succeed(todo) : Effect.fail(new Error("Todo not found"));
  },

  createTodo: (text: string) => {
    if (mockData.error) {
      return Effect.fail(new Error(mockData.error));
    }
    if (mockData.loading) {
      return Effect.suspend(() => Effect.never);
    }
    const newTodo: Todo = {
      id: Math.max(...(mockData.todos?.map(t => t.id) || [0])) + 1 as TodoId,
      text,
      done: false,
    };
    return Effect.succeed(newTodo);
  },

  completeTodo: (id: TodoId) => {
    if (mockData.error) {
      return Effect.fail(new Error(mockData.error));
    }
    if (mockData.loading) {
      return Effect.suspend(() => Effect.never);
    }
    const todo = (mockData.todos || []).find((t) => t.id === id);
    if (!todo) {
      return Effect.fail(new Error("Todo not found"));
    }
    return Effect.succeed({ ...todo, done: true });
  },

  removeTodo: (id: TodoId) => {
    if (mockData.error) {
      return Effect.fail(new Error(mockData.error));
    }
    if (mockData.loading) {
      return Effect.suspend(() => Effect.never);
    }
    return Effect.succeed(undefined);
  },
});