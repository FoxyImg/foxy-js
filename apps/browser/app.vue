<script setup lang="ts">
import {Toaster} from "@foxyimg/toaster";
</script>
<template>
  <div>
	  <NuxtLayout>
		  <NuxtPage />
	  </NuxtLayout>
	  <ClientOnly>
		  <Toaster />
	  </ClientOnly>
  </div>

	<div id="modals"></div>
</template>
