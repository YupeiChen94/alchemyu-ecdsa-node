const { secp256k1 } = require("@noble/curves/secp256k1");
BigInt.prototype.toJSON = function() { return this.toString() };

const priv = secp256k1.utils.randomPrivateKey();
const pub = secp256k1.getPublicKey(priv);
console.log(`pub: ${pub}`);
const msg = new Uint8Array(32).fill(1);
const sig = secp256k1.sign(msg, priv);
console.log(`Signature: ${JSON.stringify(sig)}`);
const isValid = secp256k1.verify(sig, msg, pub) === true;
console.log(`isValid: ${isValid}`);
const recoverPub = sig.recoverPublicKey(msg);
console.log(`recoverPub: ${recoverPub}`);
const isRecoverValid = sig.recoverPublicKey(msg) === pub;
console.log(`isRecoverValid: ${isRecoverValid}`);