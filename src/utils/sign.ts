import { sha256 } from 'js-sha256';

export default function signHMAC256(key: string, message: string) {
	const hash = sha256.hmac.create(key);
	hash.update(message);
	return hash.hex();
}