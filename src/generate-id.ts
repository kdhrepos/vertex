import * as crypto from "crypto";

export function generateId(input) {
	const hmac = crypto.createHmac("sha256", input);
	hmac.update(input);

	return hmac.digest("hex");
}