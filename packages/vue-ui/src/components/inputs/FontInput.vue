<script setup lang="ts">
import { computed } from 'vue';
import { hideAllPoppers } from "floating-vue";
import FontIcon from "../icons/FontIcon.vue";
import DeleteSourceIcon from "../icons/DeleteSourceIcon.vue";

const props = withDefaults(defineProps<{
	title: string,
	modelValue: string|null,
	default: string|null,
	fontPresets: string[],
}>(), {
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string|null): void;
	(e: 'addFontPreset', value: string): void;
	(e: 'removeFontPreset', value: string): void;
}>();

const currentValue = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

function addFont() {
	if (currentValue.value === null || currentValue.value.trim().length === 0) {
		return;
	}

	if (props.fontPresets.includes(currentValue.value)) {
		return;
	}

	emit('addFontPreset', currentValue.value);
}

function deleteFont(index:number) {
	emit('addFontPreset', props.fontPresets[index]);
}

function selectFont(index:number) {
	currentValue.value = props.fontPresets[index];
	hideAllPoppers();
}
</script>
<template>
	<div class="flex flex-col gap-1.5">
		<div class="flex flex-col items-start gap-1">
			<label class="text-xxs uppercase text-neutral-600" :class="{'font-bold text-neutral-700': currentValue !== props.default}">{{title}}</label>
			<div class="w-full relative flex items-center gap-1">
				<input type="text" v-model="currentValue" class="w-full border border-neutral-200 text-xs flex-1 rounded-md py-1.5 px-1" />
				<VDropdown>
					<div class="cursor-pointer flex items-center gap-1 aspect-square p-1">
						<FontIcon class="w-5 h-auto fill-black" />
					</div>
					<template #popper>
						<div class="flex flex-col">
							<div v-if="fontPresets.length === 0" class="w-[300px] h-[100px] flex items-center justify-center text-xs">
								No fonts.
							</div>
							<div v-else class="w-[300px] h-[200px] relative">
								<div class="absolute inset-0 overflow-y-auto">
									<div v-for="(font, index) in fontPresets" :key="index" class="cursor-pointer flex items-center hover:bg-neutral-100">
										<div class="flex-1 px-3 py-2.5 text-xs" @click="selectFont(index)">{{font}}</div>
										<div class="cursor-pointer w-[32px] aspect-square flex items-center justify-center" @click="deleteFont(index)">
											<DeleteSourceIcon name="delete-source" class="w-4 h-auto fill-red-600"></DeleteSourceIcon>
										</div>
									</div>
								</div>
							</div>
							<div class="flex items-center justify-center gap-3 text-xs px-3 py-1.5 border-t">
								<button class="px-2 py-1" type="button" @click="addFont">Add Font</button>
							</div>
						</div>
					</template>
				</VDropdown>
			</div>
		</div>
		<div class="flex justify-end text-xxxs uppercase">
			<a href="#" @click.prevent.stop="emit('update:modelValue', props.default)">Reset</a>
		</div>
	</div>
</template>
