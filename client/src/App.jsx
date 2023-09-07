import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [senderBalance, senderSetBalance] = useState(0);
  const [senderUser, senderSetUser] = useState("");
  const [recipientBalance, recipientSetBalance] = useState(0);
  const [recipientUser, recipientSetUser] = useState("");

  return (
    <div className="app">
      <Wallet
        senderBalance={senderBalance}
        senderSetBalance={senderSetBalance}
        senderUser={senderUser}
        senderSetUser={senderSetUser}
      />
      <Transfer
        recipientBalance={recipientBalance}
        recipientSetBalance={recipientSetBalance}
        recipientUser={recipientUser}
        recipientSetUser={recipientSetUser}
        senderSetBalance={senderSetBalance}
        senderUser={senderUser}
      />
    </div>
  );
}

export default App;
