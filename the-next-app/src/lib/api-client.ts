import { TodoId, Todo } from "@domain/TodosApi";

// const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
const baseUrl = "http://localhost:3005";

const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

export const todosApi = {
  getAllTodos: async (): Promise<readonly Todo[]> => {
    return apiCall<readonly Todo[]>("/todos");
  },

  getTodoById: async (id: TodoId): Promise<Todo> => {
    return apiCall<Todo>(`/todos/${id}`);
  },

  createTodo: async (text: string): Promise<Todo> => {
    return apiCall<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  completeTodo: async (id: TodoId): Promise<Todo> => {
    return apiCall<Todo>(`/todos/${id}`, {
      method: "PATCH",
    });
  },

  removeTodo: async (id: TodoId): Promise<void> => {
    return apiCall<void>(`/todos/${id}`, {
      method: "DELETE",
    });
  },
};