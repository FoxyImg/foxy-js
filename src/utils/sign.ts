export default async function signHMAC256(key: string, message: string) {
	// Convert the message and secretKey to Uint8Array
	const encoder = new TextEncoder();
	const messageUint8Array = encoder.encode(message);
	const keyUint8Array = encoder.encode(key);

	// Import the secretKey as a CryptoKey
	const cryptoKey = await window.crypto.subtle.importKey(
		"raw",
		keyUint8Array,
		{ name: "HMAC", hash: 'SHA-256' },
		false,
		["sign"]
	);

	// Sign the message with HMAC and the CryptoKey
	const signature = await window.crypto.subtle.sign(
		"HMAC",
		cryptoKey,
		messageUint8Array
	);

	// Convert the signature ArrayBuffer to a hex string
	const hashArray = Array.from(new Uint8Array(signature));
	return hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}