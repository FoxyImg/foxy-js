import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    // ignore paths
  ],
  rules: {
    // rule overrides
	  "unicorn/no-null": "off",
	  "unicorn/prefer-add-event-listener": "off",
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
