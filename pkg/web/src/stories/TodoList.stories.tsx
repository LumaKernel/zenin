import type { Meta, StoryObj } from "@storybook/nextjs";
import { TodoList } from "../components/todo-list";
import { Todo, TodoId } from "@domain/TodosApi";

const defaultTodos: ReadonlyArray<Todo> = [
  { id: 1 as TodoId, text: "買い物に行く", done: false },
  { id: 2 as TodoId, text: "洗濯をする", done: true },
  { id: 3 as TodoId, text: "メールを返信する", done: false },
];

const manyTodos: ReadonlyArray<Todo> = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1) as TodoId,
  text: `Todo項目 ${(i + 1) satisfies number}`,
  done: i % 3 === 0,
}));

const meta = {
  title: "Components/TodoList",
  component: TodoList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルト状態（少数のTodo）
export const Default: Story = {
  parameters: {
    mockApi: {
      todos: defaultTodos,
    },
  },
};

// 空の状態
export const Empty: Story = {
  parameters: {
    mockApi: {
      todos: [],
    },
  },
};

// ローディング状態
export const Loading: Story = {
  parameters: {
    mockApi: {
      loading: true,
    },
  },
};

// エラー状態
export const Error: Story = {
  parameters: {
    mockApi: {
      error: "Internal Server Error",
    },
  },
};

// 大量のTodoがある状態
export const ManyTodos: Story = {
  parameters: {
    mockApi: {
      todos: manyTodos,
    },
  },
};
