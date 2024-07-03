import {clamp} from "./numbers";

export function hsvToRgb(currentHue:number, currentSaturation:number, currentBrightness:number, currentAlpha:number):string {
	const out = [0, 0, 0, 0];

	const set = (r:number, g:number, b:number) => {
		out[0] = Math.round(r * 255);
		out[1] = Math.round(g * 255);
		out[2] = Math.round(b * 255);
	}

	const h = currentHue % 360;
	const s = clamp(currentSaturation, 0, 1);
	const v = clamp(currentBrightness, 0, 1);
	out[3] = Math.round(clamp(currentAlpha, 0, 1) * 255);

	if (!s) {
		out[0] = out[1] = out[2] = Math.floor(v * 255);
	} else {
		const b = ((1 - s) * v);
		const vb = v - b;
		const hm = h % 60;
		switch((h/60)|0) {
			case 0: set(v, vb * h / 60 + b, b); break;
			case 1: set(vb * (60 - hm) / 60 + b, v, b); break;
			case 2: set(b, v, vb * hm / 60 + b); break;
			case 3: set(b, vb * (60 - hm) / 60 + b, v); break;
			case 4: set(vb * hm / 60 + b, b, v); break;
			case 5: set(v, b, vb * (60 - hm) / 60 + b); break;
		}
	}

	return `#${out[0].toString(16).padStart(2, '0')}${out[1].toString(16).padStart(2, '0')}${out[2].toString(16).padStart(2, '0')}${out[3].toString(16).padStart(2, '0')}`;
}

export function hexToRgb(hex:string): { r: number, g: number, b: number, a: number } {
	const colorString = hex.replaceAll('#', '');

	if (colorString.length !== 6 && colorString.length !== 8) {
		return { r: 0, g: 0, b: 0, a: 255 };
	}

	const r = Number.parseInt(colorString.slice(0, 2), 16);
	const g = Number.parseInt(colorString.slice(2, 4), 16);
	const b = Number.parseInt(colorString.slice(4, 6), 16);
	const a = colorString.length === 8 ? Number.parseInt(colorString.slice(6, 8), 16) : 255;

	console.log(r, g, b, a);

	return {
		r, g, b, a
	}
}

export function rgbToHsv(rgba:string):{hue: number, saturation: number, brightness: number, alpha: number} {
	const colorString = rgba.replaceAll('#', '');

	const r = Number.parseInt(colorString.slice(0, 2), 16);
	const g = Number.parseInt(colorString.slice(2, 4), 16);
	const b = Number.parseInt(colorString.slice(4, 6), 16);
	const a = colorString.length === 8 ? Number.parseInt(colorString.slice(6, 8), 16) : 255;

	const min = Math.min(r, g, b),
		max = Math.max(r, g, b),
		delta = max - min;

	let h = 0, s = 0, v = 0;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta/max * 100);
	}

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	v = ((max / 255) * 1000) / 10;

	return {
		hue: h,
		saturation: s,
		brightness: v,
		alpha: a / 255,
	};
}
