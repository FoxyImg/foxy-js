export default function colorToHex(...colors:number[]) {
	return '#' + colors.map((color) => Math.floor(color).toString(16).padStart(2, '0')).join('');
}