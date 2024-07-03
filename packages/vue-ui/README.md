![Foxy Image Logo](https://aspekt-media.b-cdn.net/logo.png)

# @foxyimg/vue-ui

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/vue-ui)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/vue-ui)

<!-- /automd -->

The Vue components and utils used by the various [Foxy](https://github.com/FoxyImg/Foxy) Vue based apps.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @foxyimg/vue-ui

# npm
npm install @foxyimg/vue-ui

# yarn
yarn add @foxyimg/vue-ui

# pnpm
pnpm install @foxyimg/vue-ui

# bun
bun install @foxyimg/vue-ui
```

<!-- /automd -->

Usage in Vue:

```js
import { FoxyVueUIPlugin } from "@foxyimg/vue-ui";

import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
	.use(FoxyVueUIPlugin)
	.mount('#app')
```


## License

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.
