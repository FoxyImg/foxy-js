<script setup lang="ts">
import { FoxyImage } from "@foxy/vue";
import { FoxyDynamicImage } from "@foxy/vue";
</script>

<template>
  <FoxyImage
	  src="konrad-ziemlewski-5mfZce5zuHs-unsplash.jpg"
	  :params="{
			sizing: {
				width: 640,
				height: 640,
				crop: ['crop']
			}
	}" />
  <FoxyDynamicImage
	  host="http://localhost:8080"
	  source-id="gweb2"
	  secret="rapscallion"
	  image-key="konrad-ziemlewski-5mfZce5zuHs-unsplash.jpg"
	  :params="{
			sizing: {
				width: 640,
				height: 640,
				crop: ['crop']
			}
	}" />
</template>
