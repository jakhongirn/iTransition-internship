import * as crypto from 'crypto';

export default class HMACGenerator {
    generateHMAC(key: Buffer, value: string): string {
        return crypto.createHmac("sha3-256", key).update(value).digest("hex");
    }
}

