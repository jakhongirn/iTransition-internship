import * as crypto from 'crypto';

//1. Create key and hmac generator

class SecretKeyGenerator {
    generateRandomKey(){
        return crypto.randomBytes(32);
    }
}

class HMACGenerator {
    generateHMAC(key: Buffer, value: string) {
        return crypto.createHmac('sha3-256', key).update(value).digest('hex');
    }
}
