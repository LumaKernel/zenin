import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThemeToggle } from "../components/theme-toggle";

const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
    mockApi: {
      todos: [], // API不要のコンポーネント
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};
