![Foxy Image Logo](.logo.png)

# @foxyimg/url-builder

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://npmjs.com/package/packageName)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://npmjs.com/package/packageName)

<!-- /automd -->

A typescript/javascript package for building Foxy Image image URLs.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @foxyimg/url-builder

# npm
npm install @foxyimg/url-builder

# yarn
yarn add @foxyimg/url-builder

# pnpm
pnpm install @foxyimg/url-builder

# bun
bun install @foxyimg/url-builder
```

<!-- /automd -->

Import:

<!-- automd:jsimport cjs cdn name="pkg" -->

**ESM** (Node.js, Bun)

```js
import {foxy} from "pkg";
```

**CommonJS** (Legacy Node.js)

```js
const {foxy} = require("pkg");
```

<!-- /automd -->

Usage:

```js
const {buildUrl} = foxy("https://foxy.example.com", "gweb2", "rapscallion", true);
const url = buildUrl("/path/to/image.jpg", {
	sizing: {
		width: 640,
		height: 640,
		crop: ['crop']
	}
});
```

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.
Made by [community](https://github.com/unjs/packageName/graphs/contributors) 💛
<br><br>
<a href="https://github.com/unjs/packageName/graphs/contributors">
<img src="https://contrib.rocks/image?repo=unjs/packageName" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
