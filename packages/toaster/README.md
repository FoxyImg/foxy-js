![Foxy Image Logo](https://aspekt-media.b-cdn.net/logo.png)

# @foxyimg/toaster

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/toaster)
[![npm downloads](https://img.shields.io/npm/dm/packageName?color=yellow)](https://npmjs.com/package/@foxyimg/toaster)

<!-- /automd -->

Vue component for displaying toasts.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install @foxyimg/toaster

# npm
npm install @foxyimg/toaster

# yarn
yarn add @foxyimg/toaster

# pnpm
pnpm install @foxyimg/toaster

# bun
bun install @foxyimg/toaster
```

<!-- /automd -->

In `tailwind.config.js` add the following to the `content` array:

```js
export default {
	content: [
		"./node_modules/@foxyimg/toaster/dist/components/**/*.{vue,js,ts,jsx,tsx}",
	],
}
```


In `app.vue`:
```vue
<script setup lang="ts">
  import {Toaster} from "@foxyimg/toaster";
</script>
<template>
  <div>
    <!-- Your main components -->
    <Toaster />
  </div>
</template>
```

To show a toast:

```vue
<script setup lang="ts">
  import {useToastStore} from "@foxyimg/toaster";
  const { toast } = useToastStore();

  function showToast() {
    toast('info', 'Hello World', 'This is a toast');
  }
</script>
<template>
  <button type="button" @click="showToast">Show Toast</button>
</template>
```

If using with Nuxt, make sure to wrap the `<Toaster />` component in a `<ClientOnly>` component.

## License

Published under the [MIT](https://github.com/unjs/packageName/blob/main/LICENSE) license.
