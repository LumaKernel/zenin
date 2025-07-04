import { HttpApiBuilder, HttpMiddleware } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Layer } from "effect";
import { createServer } from "node:http";
import { ApiLive } from "./Api.js";
import { TodosRepository } from "./TodosRepository.js";

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(ApiLive),
  Layer.provide(TodosRepository.Live),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 5929 })),
);

Layer.launch(HttpLive).pipe(NodeRuntime.runMain);
