export function wrap(val:number, max:number):number {
	return val >= 0 ? val % max : (val % max + max) % max;
}

export function rollover(val:number, min:number, max:number):number {
	return min + wrap(val - min, max - min);
}

export function clamp(val:number, min:number, max:number):number {
	return Math.min(Math.max(val, min), max);
}

export function lerp(a:number, b:number, t:number):number {
	return a * (1 - t) + b * t;
}
