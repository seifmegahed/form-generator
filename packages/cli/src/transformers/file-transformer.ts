import { componentsPathRegex, utilsPathRegex } from "../utils/matchers.js";

class FileTransformer {
  file: string;

  constructor(file: string) {
    this.file = file;
  }

  replaceUtilsAlias(alias: string) {
    this.file = this.file.replace(utilsPathRegex, alias);
    return this;
  }
  replaceComponentsAlias(alias: string) {
    this.file = this.file.replace(componentsPathRegex, alias);
    return this;
  }
  rscPrepend(state: boolean) {
    if (!state) return this;
    this.file = '"use client"\n\n' + this.file;
    return this;
  }
}

export default FileTransformer;
