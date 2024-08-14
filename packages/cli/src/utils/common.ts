import chalk from "chalk";

export const highlight = (text: string) => chalk.cyan(text);

export const rscPrepend = (state: boolean) => (state ? "use client\n\n" : "");
