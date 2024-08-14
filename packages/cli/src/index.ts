#!/usr/bin/env node

import { existsSync } from "fs";
import { Command } from "commander";
import prompts from "prompts";
import path from "path";
import fs from "fs/promises";
import { configPrompts } from "./config/config.js";
import urls from "./utils/urls.js";
import SelectorTransformer from "./transformers/selector-transformer.js";

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

    await fs.writeFile(
      path.join(cwd, "selector.tsx"),
      selectorComponent
        .filterFields(configs.fields)
        .removeComments()
        .rscPrepend(configs.rsc)
        .replaceUtilsAlias(configs.utils)
        .replaceComponentsAlias(configs.components)
        .file,
      { flag: "w+" }
    );
  });

program.parse();
