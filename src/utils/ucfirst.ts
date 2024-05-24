export const ucfirst = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const properCase = (sentence: string) => {
  return sentence
    .split(" ")
    .map((word) => ucfirst(word))
    .join(" ");
};
