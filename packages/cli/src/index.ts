#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import prompts, { PromptObject } from "prompts";
import { getPackageInfo } from "./utils/get-package-info.js";

const program = new Command();

const highlight = (text: string) => chalk.cyan(text);

const DEFAULT_COMPONENTS = "@/components";
const DEFAULT_UTILS = "@/utils";

const configPrompts: PromptObject[] = [
  {
    type: "text",
    name: "components",
    message: `Configure the import alias for ${highlight("components")}:`,
    initial: DEFAULT_COMPONENTS,
  },
  {
    type: "text",
    name: "utils",
    message: `Configure the import alias for ${highlight("utils")}:`,
    initial: DEFAULT_UTILS,
  },
  {
    type: "toggle",
    name: "rsc",
    message: `Are you using ${highlight("React Server Components")}?`,
    initial: true,
    active: "yes",
    inactive: "no",
  },
  {
    type: "multiselect",
    name: "fields",
    message:
      "Select the fields you want to include in the component \n (Use space to select multiple)",

    instructions: false,
    min: 1,

    choices: [
      { title: "Text", value: "text", selected: true },
      { title: "Number", value: "number" },
      { title: "Select", value: "select" },
      { title: "Checkbox", value: "checkbox" },
      { title: "Date Picker", value: "datepicker" },
    ],
  },
];

program
  .version(getPackageInfo().version ?? "0.0.1")
  .name("react-form-builder")
  .description("CLI to create a react form builder component")
  .option("-y --yes", "Skip all prompts", false)
  .option("-o --overwrite", "overwrite existing files", true)
  .option("-c --cwd <cwd>", "path to the component", process.cwd())
  .action(async (opts) => {
    if (opts.yes) {
      console.log("Skipping all prompts");
      return;
    }
    const configs = await prompts(configPrompts);
    console.log(configs, opts);
  });

program.parse();
