const parentRepoUrl =
  "https://raw.githubusercontent.com/seifmegahed/form-generator/main/apps/example/src/form-generator/";

const fileNames = {
  selector: "field-selector.tsx",
  wrapper: "field-wrapper.tsx",
  generator: "generator.tsx",
  index: "index.ts",
  types: "types.ts",
  utils: "utils.ts",
  datePicker: "date-picker.tsx",
  comboSelect: "combo-select.tsx",
};

const files = {
  selector: {
    url: parentRepoUrl + fileNames.selector,
    file: fileNames.selector,
  },
  wrapper: { url: parentRepoUrl + fileNames.wrapper, file: fileNames.wrapper },
  generator: {
    url: parentRepoUrl + fileNames.generator,
    file: fileNames.generator,
  },
  index: { url: parentRepoUrl + fileNames.index, file: fileNames.index },
  types: { url: parentRepoUrl + fileNames.types, file: fileNames.types },
  utils: { url: parentRepoUrl + fileNames.utils, file: fileNames.utils },
  datePicker: {
    url: parentRepoUrl + fileNames.datePicker,
    file: fileNames.datePicker,
  },
  comboSelect: {
    url: parentRepoUrl + fileNames.comboSelect,
    file: fileNames.comboSelect,
  },
} as const;

export default files;
