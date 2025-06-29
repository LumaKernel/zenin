import { http, HttpResponse, delay } from "msw";
import { Todo, TodoId } from "@domain/TodosApi";

// 各ストーリー用の特別なハンドラー

// 空のTodoリストを返すハンドラー
export const emptyTodosHandlers = [
  http.get("*/todos", () => {
    return HttpResponse.json([]);
  }),
];

// ローディング状態をシミュレートするハンドラー
export const loadingTodosHandlers = [
  http.get("*/todos", async () => {
    await delay(5000); // 5秒待機
    return HttpResponse.json([]);
  }),
];

// エラー状態をシミュレートするハンドラー
export const errorTodosHandlers = [
  http.get("*/todos", () => {
    return new HttpResponse(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }),
];

// 大量のTodoを返すハンドラー
export const manyTodosHandlers = [
  http.get("*/todos", () => {
    const todos: ReadonlyArray<Todo> = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1) as TodoId,
      text: `Todo項目 ${(i + 1) satisfies number}`,
      done: i % 3 === 0, // 3つに1つは完了状態
    }));

    return HttpResponse.json(todos);
  }),
];
