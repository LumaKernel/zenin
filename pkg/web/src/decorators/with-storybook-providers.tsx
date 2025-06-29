import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import type { StoryContext } from "@storybook/react";
import { Todo } from "@domain/TodosApi";
import { ApiProvider } from "../contexts/api-context";

interface MockApiData {
  todos?: ReadonlyArray<Todo>;
  error?: string;
  loading?: boolean;
}

export const withStorybookProviders = (Story: any, context: StoryContext): ReactElement => {
  const mockData = (context.parameters.mockApi || {}) as MockApiData;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Storybookでは無限にキャッシュしてよい
        staleTime: Infinity,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider mockData={mockData}>
        <Story />
      </ApiProvider>
    </QueryClientProvider>
  );
};