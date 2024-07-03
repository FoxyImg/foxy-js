import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';

export default function signHMAC256(key: string, message: string) {
	return Array.from(hmac.create(sha256, key).update(message).digest())
		.map(b => ('0' + b.toString(16)).slice(-2)).join('');
}
