import * as dotenv from "dotenv";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

dotenv.config();

const pk = process.env.DEV_WALLET_PRIVATE_KEY || "";
const pkArray: Uint8Array = new Uint8Array(
  pk.split(",").map((byte) => parseInt(byte, 10))
);

const keypair = Keypair.fromSecretKey(pkArray);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

(async () => {
  try {
    // We're going to claim 2 devnet SOL tokens
    const txhash = await connection.requestAirdrop(
      keypair.publicKey,
      2 * LAMPORTS_PER_SOL
    );

    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
