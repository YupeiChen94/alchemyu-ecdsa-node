import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";
import {hexToBytes, toHex} from "ethereum-cryptography/utils";

/**
 * Local wallet.
 * Simulate a MetaMask-like wallet which stores private keys safely,
 * and gives access to public key/address.
 * Keys are stored in hexadecimal format.
 */

// List of account keys in hexadecimal format without the '0x'
const ACCOUNT_KEYS = new Map([
    [
        "yupei",
        {
            private:
                "ae8082382e083a8103c0f5891d64a842a77475703015c1a3fb71d46a99c5167a",
            public:
                "046f879f2fdcc67f9572dc043a3c45a81a291968b8bfe56b88cfd9f49c25783e05d0c6b9a0123c47fe5a9675923f63c05a4de68895208a762d9aee8ad5d2dbd122",
        },
    ],
    [
        "tommy",
        {
            private:
                "72da80f9cc857e29753df7b883af08a653aa3060ae31c12f8057610f3ed6a574",
            public:
                "04b5c81a6a0bcb4e8bb21a56d502cda6808757ec37ad558461ff09bc9f2fffecb11bf29c80435aa6e84967f62ad214ac3f5ff65da4a01e07776846b756dff82a33",
        },
    ],
    [
        "eric",
        {
            private:
                "9a97bd3ad40d069cdecc3ed784edbee7dfe0a112a04fcf67512dd7cc30f57b2a",
            public:
                "044a91038371c34feca726cd71788b34bdfaf42ea7eee3b1b3add462bb5c334318324cab56c97d7cbda925c84134d41c7daa980157140de5f95b72060e50696867",
        },
    ],
]);

// usernames derived from the list of accounts
const USERS = Array.from(ACCOUNT_KEYS.keys());

/**
 * Hash a message using KECCAK-256
 * @param {Object} message - The message, typically in format {amount: number, recipient: string}
 * @returns {Uint8Array} - The hash of the message
 */
const hashMessage = (message) => keccak256(Uint8Array.from(message));

/**
 * Get the user public key.
 * @param {string} user - The name of the user
 * @returns {Uint8Array} - The public key for a user
 */
const getPublicKey = (user) => {
    if (!user) return null;
    return hexToBytes(ACCOUNT_KEYS.get(user).public);
};

/**
 * Get the user private key.
 * @param {string} user - The name of the user
 * @returns {Uint8Array} - The private key for a user
 */
const getPrivateKey = (user) => {
    if (!user) return null;
    return hexToBytes(ACCOUNT_KEYS.get(user).private);
};

/**
 * Derive the address from the public key of a user.
 * @param {string} user - The name of the user
 * @returns {string|null} - The user address derived by the last 20 hex chars of the users hashed public key
 */
const getAddress = (user) => {
    if (!user) return null;
    const pubKey = getPublicKey(user);
    const hash = keccak256(pubKey.slice(1));
    return toHex(hash.slice(-20)).toUpperCase();
};

/**
 * Sign a message.
 * @param {string} username - name of the user account
 * @param {object} message - the message to sign
 * @returns {secp.Signature} - the signature
 */
const sign = async (username, message) => {
    const privateKey = getPrivateKey(username);
    const hash = hashMessage(message);
    return await secp.sign(hash, privateKey, { recovered: true});
};

const wallet = {
    USERS,
    sign,
    getAddress,
};
export default wallet;