import { useState } from "react";
import server from "./server";
import wallet from "./LocalWallet";
import localWallet from "./LocalWallet.jsx";

BigInt.prototype.toJSON = function() { return this.toString() };

function Transfer({ recipientBalance, recipientSetBalance, recipientUser, recipientSetUser, senderSetBalance, senderUser }) {
  const [sendAmount, setSendAmount] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  /**
   * On user selection, update the user account balance.
   * @param {object} evt - the DOM event containing the selected username.
   */
  async function onSelectUser(evt) {
    const selectedUser = evt.target.value;
    recipientSetUser(selectedUser);

    if (selectedUser) {
      const address = localWallet.getAddress(selectedUser);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      recipientSetBalance(balance);
    } else {
      recipientSetBalance(0);
    }
  }

  /**
   * On transfer button click, sign and send transaction to server
   * @param {object} evt - the DOM event containing the selected username.
   */
  async function transfer(evt) {
    evt.preventDefault();

    // build the transaction payload composed of
    // the message itself (amount to transfer and recipient) and
    // the signature of the transaction built from the user private key
    // and the message, inside the wallet.
    const recipientAddress = localWallet.getAddress(recipientUser);
    const message = {
      amount: parseInt(sendAmount),
      recipientAddress,
    };
    const signature = await wallet.sign(senderUser, message);
    const transaction = {
      message,
      signature,
    };

    try {
      const {
        data: { senderBalanceReturn, recipientBalanceReturn },
      } = await server.post(`send`, transaction);
      senderSetBalance(senderBalanceReturn);
      recipientSetBalance(recipientBalanceReturn);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient Wallet Address
        <select onChange={onSelectUser} value={recipientUser}>
          <option value="">--- Please choose a user wallet ---</option>
          {localWallet.USERS.map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
          ))}
        </select>
      </label>

      <div className="balance">Address: {localWallet.getAddress(recipientUser)}</div>
      <div className="balance">Balance: {recipientBalance}</div>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
