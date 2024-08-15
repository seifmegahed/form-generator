import {
  componentsPathRegex,
  useClientRegex,
  utilsPathRegex,
} from "../utils/matchers.js";

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
  rscPrepare(state: boolean) {
    if (state) return this;
    this.file = this.file.replace(useClientRegex, "");
    return this;
  }
}

export default FileTransformer;
