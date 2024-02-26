import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();

console.log(
  `You've generated a new Solana wallet with pubkey: ${kp.publicKey}`
);

//console.log(`Private Key: ${kp.secretKey}`);
