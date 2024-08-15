#!/usr/bin/env node

import { existsSync } from "fs";
import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { configPrompts } from "./config/index.js";
import urls from "./consts/urls.js";
import SelectorTransformer from "./transformers/selector-transformer.js";
import {
  ConfigLoaderFailResult,
  type ConfigLoaderSuccessResult,
  createMatchPath,
  loadConfig,
} from "tsconfig-paths";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command();

program
  .name("react-form-builder")
  .description("CLI to create a react form builder component")
  .option("-y --yes", "Skip all prompts", false)
  .option("-o --overwrite", "overwrite existing files", true)
  .option("-c --cwd <cwd>", "path to the component", process.cwd())
  .action(async (opts) => {
    const configs = await prompts(configPrompts);

    const cwd = path.resolve(opts.cwd);

    if (!existsSync(cwd)) {
      console.error(`The directory ${cwd} does not exist`);
      process.exit(1);
    }

    const selectorComponent = new SelectorTransformer(
      await fetch(urls.selector).then((res) => res.text())
    );

    const tsconfig = loadConfig(cwd);

    if (tsconfig.resultType === "failed") {
      console.error(`Could not load tsconfig.json`);
      process.exit(1);
    }

    const componentsPath = await resolveImport(
      configs.components,
      tsconfig as ConfigLoaderSuccessResult
    );

    if (!componentsPath) {
      console.error(`Could not resolve import path ${configs.components}`);
      process.exit(1);
    }

    const formBuilderDirPath = path.join(componentsPath, "form-builder");

    if (!existsSync(formBuilderDirPath)) {
      await fs.mkdir(formBuilderDirPath);
    }

    await fs.writeFile(
      path.join(formBuilderDirPath, "selector.tsx"),
      selectorComponent
        .filterFields(configs.fields)
        .removeComments()
        .rscPrepend(configs.rsc)
        .replaceUtilsAlias(configs.utils)
        .replaceComponentsAlias(configs.components).file,
      { flag: "w+" }
    );
  });

async function resolveImport(
  importPath: string,
  config: ConfigLoaderSuccessResult
) {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(
    importPath,
    undefined,
    () => true,
    [".ts", ".tsx"]
  );
}

program.parse();
