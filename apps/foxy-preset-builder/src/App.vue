<script setup lang="ts">
import FoxyPreviewer from './components/FoxyPreviewer.vue'
</script>

<template>
	<FoxyPreviewer />
</template>

<style>
.button {
	@apply text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800;
}

.button.small {
	@apply px-3 py-1.5 me-0 mb-0 text-xxs;
}

.v-popper--theme-tooltip .v-popper__inner {
	@apply px-3 py-2 text-xs;
}
</style>