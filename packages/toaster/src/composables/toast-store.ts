import {Ref, ref} from "vue";
import {Toast} from "../types/toast";
import shortUUID from "short-uuid";

const toasts:Ref<Toast[]> = ref([]);
const maxToasts = ref(9);
const toastDuration = ref(5000);

export function useToastStore() {
	function removeToast(toastId: string) {
		const idx = toasts.value.findIndex(toast => toast.id === toastId);
		if (idx !== -1) {
			toasts.value.splice(idx, 1);
		}
	}

	function queueDeleteToast(toastId: string, duration: number) {
		setTimeout(() => {
			removeToast(toastId);
		}, duration);
	}

	function toast(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) {
		const id = shortUUID.generate();

		toasts.value.unshift({
			id,
			type,
			timestamp: Date.now(),
			title,
			message,
		});

		queueDeleteToast(id, toastDuration.value);

		if (toasts.value.length > maxToasts.value) {
			toasts.value.pop();
		}
	}

	return {
		toasts,
		maxToasts,
		toastDuration,
		toast,
		removeToast
	}
}
