export const commentsRegex = new RegExp(
  /\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\/|\/{2}.*\n/g
);

export const splitString = "//split";

export const commentPrefix = "//";

export const useClientRegex = new RegExp(/"use client";/g);
export const componentsPathRegex = new RegExp(/\@\/components/g);
export const utilsPathRegex = new RegExp(/\@\/lib\/utils/g);
