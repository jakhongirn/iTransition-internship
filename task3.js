"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
//1. Create key and hmac generator
var SecretKeyGenerator = /** @class */ (function () {
    function SecretKeyGenerator() {
    }
    SecretKeyGenerator.prototype.generateRandomKey = function () {
        return crypto.randomBytes(32);
    };
    return SecretKeyGenerator;
}());
var HMACGenerator = /** @class */ (function () {
    function HMACGenerator() {
    }
    HMACGenerator.prototype.generateHMAC = function (key, value) {
        return crypto.createHmac('sha3-256', key).update(value).digest('hex');
    };
    return HMACGenerator;
}());
