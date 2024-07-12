<template>
  <span v-if="duration !== ''" ref="labelRef" v-tooltip="longDateTimeFormat(date)">
    {{ prefix }}{{ duration }}
  </span>
</template>
<script setup lang="ts">
import { durationFormat, longDateTimeFormat } from "@foxyimg/utils";
import {onUnmounted, ref, watch} from "vue";
import {useElementVisibility} from "@vueuse/core";

const props = withDefaults(defineProps<{
  date: string|Date,
  suffix?: string,
  prefix?: string,
  force?: boolean,
  lowerCase?: boolean,
}>(), {
  suffix: " ago",
  prefix: "",
  force: false,
  lowerCase: false,
});

const labelRef = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(labelRef);
const duration = ref<string>(durationFormat(props.date!, props.suffix, props.force, props.lowerCase));
let timeoutHandle: any = null;
let loaded = false;

onUnmounted(() => {
  clearTimeout(timeoutHandle);
});

watch(isVisible, currValue => {
  if (currValue) {
    if (!loaded) {
      loaded = true;
      updateDuration();
    }
  } else {
    if (loaded) {
      loaded = false;
      clearTimeout(timeoutHandle);
    }
  }
});

watch(
  () => props.date,
  () => {
    duration.value = durationFormat(props.date!, props.suffix, props.force);

    if (loaded) {
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(updateDuration, 1000 * 60);
    }
  }
);

function updateDuration() {
  const time = durationFormat(props.date!, props.suffix, props.force, props.lowerCase);

  if (time !== duration.value) {
    duration.value = time;
  }

  clearTimeout(timeoutHandle);
  timeoutHandle = setTimeout(updateDuration, 1000 * 60);
}
</script>
