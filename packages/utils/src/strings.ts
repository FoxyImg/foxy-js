export function ucFirst(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export function properCase(sentence: string) {
  return sentence
    .split(" ")
    .map((word) => ucFirst(word))
    .join(" ");
};

export function deslugify(slug: string) {
  return properCase(slug.replace(/[_-]+/g, ' '));
}
