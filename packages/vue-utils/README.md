![Foxy Image Logo](https://aspekt-media.b-cdn.net/logo.png)

# @foxyimg/vue-utils

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/vue-utils)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/vue-utils)

<!-- /automd -->

A utility functions and composables for use with Vue.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @foxyimg/vue-utils

# npm
npm install @foxyimg/vue-utils

# yarn
yarn add @foxyimg/vue-utils

# pnpm
pnpm install @foxyimg/vue-utils

# bun
bun install @foxyimg/vue-utils
```

<!-- /automd -->

Usage:

```js
import { useWritableWrappedRef, useClampedRef } from "@foxyimg/vue-utils";
const someRef = useWritableWrappedRef(25, 0, 100);  // current value: 25
someRef.value = 102;  // current value: 1

const someOtherRef = ref(12);
const clampedRef = useClampedRef(someOtherRef, 0, 15);  // clampedRef's current value: 12
someOtherRef.value = 23;  // clampedRef's current value: 15
```

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.

<!-- /automd -->
