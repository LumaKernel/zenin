/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, require-yield */
import { describe, expect, it } from "@effect/vitest";
import { Effect, ParseResult, Schema } from "effect";
import {
  Todo,
  TodoId,
  TodoIdFromString,
  TodoNotFound,
} from "../src/TodosApi.js";

describe("TodosApi", () => {
  describe("TodoId", () => {
    it.effect("数値からTodoIdを作成できること", () =>
      Effect.gen(function* () {
        // Arrange & Act
        const id = TodoId.make(42);

        // Assert
        expect(id).toBe(42);
        expect(Schema.is(TodoId)(id)).toBe(true);
      }),
    );

    it.effect("負の数値でもTodoIdを作成できること", () =>
      Effect.gen(function* () {
        // Arrange & Act
        const id = TodoId.make(-1);

        // Assert
        expect(id).toBe(-1);
        expect(Schema.is(TodoId)(id)).toBe(true);
      }),
    );
  });

  describe("TodoIdFromString", () => {
    it.effect("有効な数値文字列からTodoIdを作成できること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = "123";

        // Act
        const result = yield* Schema.decode(TodoIdFromString)(input);

        // Assert
        expect(result).toBe(123);
        expect(Schema.is(TodoId)(result)).toBe(true);
      }),
    );

    it.effect("0の文字列からTodoIdを作成できること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = "0";

        // Act
        const result = yield* Schema.decode(TodoIdFromString)(input);

        // Assert
        expect(result).toBe(0);
      }),
    );

    it.effect("負の数値文字列からTodoIdを作成できること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = "-456";

        // Act
        const result = yield* Schema.decode(TodoIdFromString)(input);

        // Assert
        expect(result).toBe(-456);
      }),
    );

    it.effect("無効な文字列の場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = "invalid";

        // Act & Assert
        const result = yield* Effect.exit(
          Schema.decode(TodoIdFromString)(input),
        );
        expect(result._tag).toBe("Failure");

        if (result._tag === "Failure") {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(ParseResult.ParseError);
          }
        }
      }),
    );

    it.effect("空文字列の場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = "";

        // Act & Assert
        const result = yield* Effect.exit(
          Schema.decode(TodoIdFromString)(input),
        );
        expect(result._tag).toBe("Failure");
      }),
    );

    it.effect(
      "数値以外の文字が含まれた文字列の場合、パースエラーになること",
      () =>
        Effect.gen(function* () {
          // Arrange
          const input = "123abc";

          // Act & Assert
          const result = yield* Effect.exit(
            Schema.decode(TodoIdFromString)(input),
          );
          expect(result._tag).toBe("Failure");
        }),
    );
  });

  describe("Todo", () => {
    it.effect("有効なプロパティでTodoを作成できること", () =>
      Effect.gen(function* () {
        // Arrange
        const todoData = {
          id: TodoId.make(1),
          text: "テストタスク",
          done: false,
        };

        // Act
        const todo = new Todo(todoData);

        // Assert
        expect(todo.id).toBe(1);
        expect(todo.text).toBe("テストタスク");
        expect(todo.done).toBe(false);
      }),
    );

    it.effect("Todoのスキーマバリデーションが正常に動作すること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 42,
          text: "バリデーションテスト",
          done: true,
        };

        // Act
        const todo = yield* Schema.decode(Todo)(input);

        // Assert
        expect(todo).toBeInstanceOf(Todo);
        expect(todo.id).toBe(42);
        expect(todo.text).toBe("バリデーションテスト");
        expect(todo.done).toBe(true);
      }),
    );

    it.effect("空文字列のtextの場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 1,
          text: "",
          done: false,
        };

        // Act & Assert
        const result = yield* Effect.exit(Schema.decode(Todo)(input as any));
        expect(result._tag).toBe("Failure");

        if (result._tag === "Failure") {
          expect(result.cause._tag).toBe("Fail");
          if (result.cause._tag === "Fail") {
            expect(result.cause.error).toBeInstanceOf(ParseResult.ParseError);
          }
        }
      }),
    );

    it.effect("スペースのみのtextの場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 1,
          text: "   ",
          done: false,
        };

        // Act & Assert
        const result = yield* Effect.exit(Schema.decode(Todo)(input as any));
        expect(result._tag).toBe("Failure");
      }),
    );

    it.effect(
      "NonEmptyTrimmedStringは既にトリムされた文字列のみ受け付けること",
      () =>
        Effect.gen(function* () {
          // Arrange - 既にトリムされた文字列を使用
          const input = {
            id: 1,
            text: "タスクテキスト",
            done: false,
          };

          // Act
          const todo = yield* Schema.decode(Todo)(input);

          // Assert
          expect(todo.text).toBe("タスクテキスト");
        }),
    );

    it.effect("前後に空白がある文字列の場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 1,
          text: "  タスクテキスト  ",
          done: false,
        };

        // Act & Assert
        const result = yield* Effect.exit(Schema.decode(Todo)(input as any));
        expect(result._tag).toBe("Failure");
      }),
    );

    it.effect("必須プロパティが不足している場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 1,
          // text プロパティが不足
          done: false,
        };

        // Act & Assert
        const result = yield* Effect.exit(Schema.decode(Todo)(input as any));
        expect(result._tag).toBe("Failure");
      }),
    );

    it.effect("doneがbooleanでない場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          id: 1,
          text: "テスト",
          done: "false", // 文字列の場合
        };

        // Act & Assert
        const result = yield* Effect.exit(Schema.decode(Todo)(input as any));
        expect(result._tag).toBe("Failure");
      }),
    );
  });

  describe("TodoNotFound", () => {
    it.effect("TodoNotFoundエラーを作成できること", () =>
      Effect.gen(function* () {
        // Arrange & Act
        const error = new TodoNotFound({ id: 999 });

        // Assert
        expect(error._tag).toBe("TodoNotFound");
        expect(error.id).toBe(999);
        expect(error).toBeInstanceOf(Error);
      }),
    );

    it.effect("TodoNotFoundのスキーマバリデーションが正常に動作すること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          _tag: "TodoNotFound",
          id: 404,
        };

        // Act
        const error = yield* Schema.decode(TodoNotFound)(input as any);

        // Assert
        expect(error).toBeInstanceOf(TodoNotFound);
        expect(error._tag).toBe("TodoNotFound");
        expect(error.id).toBe(404);
      }),
    );

    it.effect("idが不足している場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          _tag: "TodoNotFound",
          // id プロパティが不足
        };

        // Act & Assert
        const result = yield* Effect.exit(
          Schema.decode(TodoNotFound)(input as any),
        );
        expect(result._tag).toBe("Failure");
      }),
    );

    it.effect("_tagが正しくない場合、パースエラーになること", () =>
      Effect.gen(function* () {
        // Arrange
        const input = {
          _tag: "WrongTag",
          id: 123,
        };

        // Act & Assert
        const result = yield* Effect.exit(
          Schema.decode(TodoNotFound)(input as any),
        );
        expect(result._tag).toBe("Failure");
      }),
    );
  });
});
