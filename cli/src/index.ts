#!/usr/bin/env node

import { existsSync } from "fs";
import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { configPrompts } from "./config/index.js";
import files from "./consts/urls.js";
import SelectorTransformer from "./transformers/selector-transformer.js";
import {
  type ConfigLoaderSuccessResult,
  createMatchPath,
  loadConfig,
} from "tsconfig-paths";
import FileTransformer from "./transformers/file-transformer.js";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

const program = new Command();

program
  .name("react-form-generator")
  .description("CLI to create a react form builder component")
  .option("-c --cwd <cwd>", "path to the component", process.cwd())
  .action(async (opts) => {
    const configs = await prompts(configPrompts);

    const cwd = path.resolve(opts.cwd);

    if (!existsSync(cwd)) {
      console.error(`The directory ${cwd} does not exist`);
      process.exit(1);
    }

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

    Object.keys(files).forEach(async (fileKey) => {
      const fileUrl = files[fileKey as keyof typeof files].url;
      const fileName = files[fileKey as keyof typeof files].file;
      const fileContent = await fetch(fileUrl).then((res) => res.text());
      if (fileKey === "selector") {
        const selectorComponent = new SelectorTransformer(fileContent);
        await fs.writeFile(
          path.join(formBuilderDirPath, files[fileKey].file),
          selectorComponent
            .filterFields(configs.fields)
            .removeComments()
            .rscPrepare(configs.rsc)
            .replaceUtilsAlias(configs.utils)
            .replaceComponentsAlias(configs.components).file,
          { flag: "w+" }
        );
      } else {
        const component = new FileTransformer(fileContent);
        await fs.writeFile(
          path.join(formBuilderDirPath, fileName),
          component
            .rscPrepare(configs.rsc)
            .replaceUtilsAlias(configs.utils)
            .replaceComponentsAlias(configs.components).file,
          { flag: "w+" }
        );
      }
    });
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
