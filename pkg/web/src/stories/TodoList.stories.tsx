import type { Meta, StoryObj } from "@storybook/react";
import { TodoList } from "../components/todo-list";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const meta = {
  title: "Components/TodoList",
  component: TodoList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof TodoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};