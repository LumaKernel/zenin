import { Decorator } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";

export const withQueryClient: Decorator = (Story): ReactElement => {
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
      <Story />
    </QueryClientProvider>
  );
};
