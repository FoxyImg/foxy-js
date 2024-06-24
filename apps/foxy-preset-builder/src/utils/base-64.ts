/**
 * Based on code from hexagon@56k.guru https://github.com/Hexagon/base64/blob/main/src/base64.js
 */

export default function base64(str: string, urlMode:boolean = false) {

	// Regular base64 characters
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	// Base64url characters
	const charsUrl = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

	/**
	 * Convenience function for creating a base64 encoded string from an ArrayBuffer instance
	 */
	const fromArrayBuffer = (arrBuf: ArrayBuffer, urlMode:boolean):string => {
		const bytes = new Uint8Array(arrBuf);
		let
			i,
			result = "";

		const
			len = bytes.length,
			target = urlMode ? charsUrl : chars;

		for (i = 0; i < len; i += 3) {
			result += target[bytes[i] >> 2];
			result += target[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			result += target[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			result += target[bytes[i + 2] & 63];
		}

		const remainder = len % 3;
		if (remainder === 2) {
			result = result.substring(0, result.length - 1) + (urlMode ? "" : "=");
		} else if (remainder === 1) {
			result = result.substring(0, result.length - 2) + (urlMode ? "" : "==");
		}

		return result;
	};

	/**
	 * Convenience function for converting a javascript string to base64
	 */
	const fromString = (str:string, urlMode:boolean):string => {
		return fromArrayBuffer(new TextEncoder().encode(str), urlMode);
	};

	return fromString(str, urlMode);
}
