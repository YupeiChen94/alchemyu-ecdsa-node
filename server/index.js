const express = require("express");
const cors = require("cors");
const crypto = require("./crypto");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "FEB2CB0643A133E7D00854B311F0B27A9A4567D4": 100, // yupei
  "93BEDAF421F4E7611F50D3E99DD3B3F68809A277": 50, // tommy
  "9565185604F0803D8E818F1AE03E99B03B2D900B": 75, // eric
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { amount, recipientAddress } = message;

  const pubKey = crypto.signatureToPubKey(message, signature);
  const sender = crypto.pubKeyToAddress(pubKey);

  setInitialBalance(sender);
  setInitialBalance(recipientAddress);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipientAddress] += amount;
    res.send({ senderBalanceReturn: balances[sender], recipientBalanceReturn: balances[recipientAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
