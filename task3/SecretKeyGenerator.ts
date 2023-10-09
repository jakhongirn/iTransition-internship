import * as crypto from 'crypto';

export default class SecretKeyGenerator {
    generateRandomKey(): Buffer {
        return crypto.randomBytes(32);
    }
}