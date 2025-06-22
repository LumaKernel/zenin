import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAsyncQuery<T>(
  key: readonly string[],
  queryFn: () => Promise<T>
) {
  return useQuery({
    queryKey: key,
    queryFn,
  });
}

export function useAsyncMutation<Args, T>(
  mutationFn: (args: Args) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: readonly string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    onError: options?.onError,
  });
}