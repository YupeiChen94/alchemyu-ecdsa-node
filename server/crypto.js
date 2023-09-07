const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

/**
 * Hash a message using KECCAK-256
 * @param {Object} message - The message, typically in format {amount: number, recipient: string}
 * @returns {Uint8Array} - The hash of the message
 */
const hashMessage = (message) => keccak256(Uint8Array.from(message));

/**
 * Convert a public key to an address
 * @param {Uint8Array} pubKey - The public key
 * @returns {string} The user address derived by the last 20 hex chars of the users hashed public key
 */
const pubKeyToAddress = (pubKey) => {
    const hash = keccak256(pubKey.slice(1));
    return toHex(hash.slice(-20)).toUpperCase();
};

/**
 * Get the public key from the signature.
 * @param {object} message - the message
 * @param {secp.Signature} signature - the signature
 * @return {Uint8Array} - the public key
 */
const signatureToPubKey = (message, signature) => {
    const hash = hashMessage(message);
    const sign = Uint8Array.from(Object.values(signature[0]));
    const recoveryBit = signature[1];
    return secp.recoverPublicKey(hash, sign, recoveryBit);
};

module.exports = {
    hashMessage,
    pubKeyToAddress,
    signatureToPubKey,
};