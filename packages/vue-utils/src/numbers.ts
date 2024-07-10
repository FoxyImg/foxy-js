import {
	clamp,
	rollover,
	wrap,
} from "@foxyimg/utils";

import {computed, WritableComputedRef, Ref, ComputedRef, ref} from "vue";

export function useWritableClampedRef(initialValue: number|null, min: number|Ref<number>, max: number|Ref<number>):WritableComputedRef<number|null> {
	const minIsNumber = typeof min === 'number';
	const maxIsNumber = typeof max === 'number';

	const currentValue = ref(initialValue === null ? null : clamp(initialValue, minIsNumber ? min : min.value, maxIsNumber ? max : max.value));

	return computed({
		get: () => currentValue.value,
		set: (value:number|null) => {
			if (value === null) {
				currentValue.value = null;
			} else {
				currentValue.value = clamp(value, minIsNumber ? min : min.value, maxIsNumber ? max : max.value);
			}
		}
	});
}

export function useClampedRef(initialValue: Ref<number|null>, min: number|Ref<number>, max: number|Ref<number>):ComputedRef<number|null> {
	const minIsNumber = typeof min === 'number';
	const maxIsNumber = typeof max === 'number';

	return computed(() => initialValue.value ? clamp(initialValue.value, minIsNumber ? min : min.value, maxIsNumber ? max : max.value) : null);
}


export function useWritableRolloverRef(initialValue: number|null, min: number|Ref<number>, max: number|Ref<number>):WritableComputedRef<number|null> {
	const minIsNumber = typeof min === 'number';
	const maxIsNumber = typeof max === 'number';

	const currentValue = ref(initialValue === null ? null : rollover(initialValue, minIsNumber ? min : min.value, maxIsNumber ? max : max.value));

	return computed({
		get: () => currentValue.value,
		set: (value:number|null) => {
			if (value === null) {
				currentValue.value = null;
			} else {
				currentValue.value = rollover(value, minIsNumber ? min : min.value, maxIsNumber ? max : max.value);
			}
		}
	});
}

export function useRolloverRef(initialValue: Ref<number|null>, min: number|Ref<number>, max: number|Ref<number>):ComputedRef<number|null> {
	const minIsNumber = typeof min === 'number';
	const maxIsNumber = typeof max === 'number';

	return computed(() => initialValue.value ? rollover(initialValue.value, minIsNumber ? min : min.value, maxIsNumber ? max : max.value) : null);
}


export function useWritableWrappedRef(initialValue: number|null, max: number|Ref<number>):WritableComputedRef<number|null> {
	const maxIsNumber = typeof max === 'number';
	const currentValue = ref(initialValue === null ? null : wrap(initialValue, maxIsNumber ? max : max.value));

	return computed({
		get: () => currentValue.value,
		set: (value:number|null) => {
			if (value === null) {
				currentValue.value = null;
			} else {
				currentValue.value = wrap(value, maxIsNumber ? max : max.value);
			}
		}
	});
}

export function useWrappedRef(initialValue: Ref<number|null>, max: number|Ref<number>):ComputedRef<number|null> {
	const maxIsNumber = typeof max === 'number';

	return computed(() => initialValue.value ? wrap(initialValue.value, maxIsNumber ? max : max.value) : null);
}

