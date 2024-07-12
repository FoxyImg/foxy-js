export type Toast = {
	id: string;
	type: 'success' | 'error' | 'info' | 'warning';
	title: string;
	timestamp: number;
	message: string;
}
