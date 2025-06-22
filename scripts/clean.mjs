import * as Glob from "glob";
import * as Fs from "node:fs";

const dirs = [".", ...Glob.sync("pkg/*/")];
dirs.forEach((pkg) => {
  const files = [".tsbuildinfo", "build", "dist", "coverage"];

  files.forEach((file) => {
    Fs.rmSync(`${pkg}/${file}`, { recursive: true, force: true }, () => {});
  });
});
