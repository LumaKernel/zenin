import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { StoryContext } from "@storybook/react";
import { Todo } from "@domain/TodosApi";

interface MockApiData {
  todos?: ReadonlyArray<Todo>;
  error?: string;
  loading?: boolean;
}

const MockDataSetter = ({ mockData }: { mockData: MockApiData }) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // モックデータを設定
    if (mockData.error) {
      queryClient.setQueryData(["todos"], () => {
        throw new Error(mockData.error);
      });
    } else if (mockData.loading) {
      // ローディング状態はクエリを削除してpending状態にする
      queryClient.removeQueries({ queryKey: ["todos"] });
    } else {
      queryClient.setQueryData(["todos"], mockData.todos || []);
    }
  }, [mockData, queryClient]);

  return null;
};

export const withMockApi = (Story: any, context: StoryContext) => {
  const mockData = (context.parameters.mockApi || {}) as MockApiData;

  return (
    <>
      <MockDataSetter mockData={mockData} />
      <Story />
    </>
  );
};