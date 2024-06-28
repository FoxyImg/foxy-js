import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
  ],
  rules: {
    // rule overrides
	  "unicorn/no-null": "off",
	  "unicorn/no-useless-fallback-in-spread": "off",
	  "unicorn/empty-brace-spaces": "off",
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
