import FileTransformer from "./file-transformer.js";
import { commentPrefix, commentsRegex, splitString } from "../utils/matchers.js";

export enum FieldOptions {
  Text = "text",
  Select = "select",
  Textarea = "textarea",
  Checkbox = "checkbox",
  DatePicker = "date-picker",
  ComboSelect = "combo-select",
}

class SelectorTransformer extends FileTransformer {
  filterFields(fields: FieldOptions[]) {
    const fieldsToRemove = Object.values(FieldOptions).filter((field) => {
      return !fields.includes(field as FieldOptions);
    });
    if (!fieldsToRemove.length) return this;
    this.file = this.file
      .split(splitString)
      .filter(
        (block) =>
          !fieldsToRemove.some((field) =>
            block.startsWith(commentPrefix + field)
          )
      )
      .join("") as string;
    return this;
  }
  removeComments() {
    this.file = this.file.replace(commentsRegex, "");
    return this;
  }
}

export default SelectorTransformer;
