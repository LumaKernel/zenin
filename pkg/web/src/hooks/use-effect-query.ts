import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Effect, Runtime } from "effect";
import { consumerPromise } from "../lib/utils";

const runtime = Runtime.defaultRuntime;

export function useEffectQuery<E, A>(
  key: ReadonlyArray<string>,
  effect: Effect.Effect<A, E>,
) {
  return useQuery({
    queryKey: key,
    queryFn: () => Runtime.runPromise(runtime)(effect),
  });
}

export function useEffectMutation<Args, E, A>(
  effectFn: (args: Args) => Effect.Effect<A, E>,
  options?: {
    onSuccess?: (data: A) => void;
    onError?: (error: E) => void;
    invalidateQueries?: ReadonlyArray<ReadonlyArray<string>>;
  },
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: Args) => Runtime.runPromise(runtime)(effectFn(args)),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          consumerPromise(queryClient.invalidateQueries({ queryKey }));
        });
      }
    },
    onError: options?.onError,
  });
}
