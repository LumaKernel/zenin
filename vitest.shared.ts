import * as path from "node:path";
import { ViteUserConfig } from "vitest/config";

const alias = (name: string) => {
  const target = process.env.TEST_DIST !== undefined ? "dist/dist/esm" : "src";
  return {
    [`${name}/test`]: path.join(__dirname, "pkg", name, "test"),
    [name]: path.join(__dirname, "pkg", name, target),
  };
};

// This is a workaround, see https://github.com/vitest-dev/vitest/issues/4744
const config: ViteUserConfig = {
  esbuild: {
    target: "es2020",
  },
  optimizeDeps: {
    exclude: ["bun:sqlite"],
  },
  test: {
    workspace: ["pkg/*"],
    setupFiles: [path.join(__dirname, "setupTests.ts")],
    fakeTimers: {
      toFake: undefined,
    },
    sequence: {
      concurrent: true,
    },
    include: ["test/**/*.test.ts"],
    alias: {
      ...alias("cli"),
      ...alias("domain"),
      ...alias("server"),
      "@template/domain": path.join(__dirname, "pkg", "domain", "src"),
      "@template/cli": path.join(__dirname, "pkg", "cli", "src"),
      "@template/server": path.join(__dirname, "pkg", "server", "src"),
    },
  },
};

export default config;
