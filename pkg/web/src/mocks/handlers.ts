import { http, HttpResponse } from "msw";
import { Todo, TodoId } from "@domain/TodosApi";

// モックデータ
const mockTodos: ReadonlyArray<Todo> = [
  {
    id: 1 as TodoId,
    text: "Effect.tsを学習する",
    done: false,
  },
  {
    id: 2 as TodoId,
    text: "Storybookのモック対応を完了する",
    done: false,
  },
  {
    id: 3 as TodoId,
    text: "React QueryとEffect.tsの統合を理解する",
    done: true,
  },
];

let todos = [...mockTodos];
let nextId = 4;

export const handlers = [
  // GET /todos - 全てのTodoを取得
  http.get("*/todos", () => {
    return HttpResponse.json(todos);
  }),

  // GET /todos/:id - 特定のTodoを取得
  http.get("*/todos/:id", ({ params }) => {
    const id = parseInt(params.id as string) as TodoId;
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(todo);
  }),

  // POST /todos - 新しいTodoを作成
  http.post("*/todos", async ({ request }) => {
    const body = (await request.json()) as { text: string };

    const newTodo: Todo = {
      id: nextId++ as TodoId,
      text: body.text,
      done: false,
    };

    todos = [...todos, newTodo];

    return HttpResponse.json(newTodo, { status: 201 });
  }),

  // PATCH /todos/:id - Todoを完了状態にする
  http.patch("*/todos/:id", ({ params }) => {
    const id = parseInt(params.id as string) as TodoId;
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedTodo = { ...todos[todoIndex], done: true };
    todos = [
      ...todos.slice(0, todoIndex),
      updatedTodo,
      ...todos.slice(todoIndex + 1),
    ];

    return HttpResponse.json(updatedTodo);
  }),

  // DELETE /todos/:id - Todoを削除
  http.delete("*/todos/:id", ({ params }) => {
    const id = parseInt(params.id as string) as TodoId;
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    todos = [...todos.slice(0, todoIndex), ...todos.slice(todoIndex + 1)];

    return new HttpResponse(null, { status: 204 });
  }),
];
