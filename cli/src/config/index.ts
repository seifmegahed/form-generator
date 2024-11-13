import { PromptObject } from "prompts";
import { highlight } from "../utils/common.js";
import { FieldOptions } from "../transformers/selector-transformer.js";

const DEFAULT_COMPONENTS = "@/components";
const DEFAULT_UTILS = "@/lib/utils";

export const configPrompts: PromptObject[] = [
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
      "Select the fields you want to include in the component \n (Use space to select/unselect multiple)",
    instructions: false,
    min: 1,

    choices: [
      { title: "Text", value: FieldOptions.Text, selected: true },
      { title: "Select", value: FieldOptions.Select, selected: true },
      {
        title: "Combo Select",
        value: FieldOptions.ComboSelect,
        selected: true,
      },
      { title: "Textarea", value: FieldOptions.Textarea, selected: true },
      { title: "Checkbox", value: FieldOptions.Checkbox, selected: true },
      { title: "Date Picker", value: FieldOptions.DatePicker, selected: true },
    ],
  },
];
