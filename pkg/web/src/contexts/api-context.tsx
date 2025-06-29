import { createContext, useContext, ReactNode } from "react";
import { todosApi } from "../lib/api-client";
import { createMockTodosApi } from "../mocks/api-client-mock";
import { Todo } from "@domain/TodosApi";

interface ApiContextType {
  todosApi: typeof todosApi;
}

interface MockApiData {
  todos?: ReadonlyArray<Todo>;
  error?: string;
  loading?: boolean;
}

const ApiContext = createContext<ApiContextType>({ todosApi });

export const useApi = () => useContext(ApiContext);

interface ApiProviderProps {
  children: ReactNode;
  mockData?: MockApiData;
}

export const ApiProvider = ({ children, mockData }: ApiProviderProps) => {
  const api = mockData ? createMockTodosApi(mockData) : todosApi;
  
  return (
    <ApiContext.Provider value={{ todosApi: api }}>
      {children}
    </ApiContext.Provider>
  );
};