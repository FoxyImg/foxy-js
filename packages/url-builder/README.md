![Foxy Image Logo](https://aspekt-media.b-cdn.net/logo.png)

# @foxyimg/url-builder

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/url-builder)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/url-builder)

<!-- /automd -->

A typescript/javascript SDK for building [Foxy Image](https://github.com/FoxyImg/Foxy) image URLs.

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

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.
