import server from "./server";
import localWallet from "./LocalWallet";

function Wallet({ senderBalance, senderSetBalance, senderUser, senderSetUser,  }) {

  /**
   * On user selection, update the user account balance.
   * @param {object} evt - the DOM event containing the selected username.
   */
  async function onSelectUser(evt) {
    const selectedUser = evt.target.value;
    senderSetUser(selectedUser);

    if (selectedUser) {
      const address = localWallet.getAddress(selectedUser);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      senderSetBalance(balance);
    } else {
      senderSetBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <select onChange={onSelectUser} value={senderUser}>
          <option value="">--- Please choose a user wallet ---</option>
          {localWallet.USERS.map((u, i) => (
              <option key={i} value={u}>
                {u}
              </option>
          ))}
        </select>
      </label>

      <div className="balance">Address: {localWallet.getAddress(senderUser)}</div>
      <div className="balance">Balance: {senderBalance}</div>
    </div>
  );
}

export default Wallet;
