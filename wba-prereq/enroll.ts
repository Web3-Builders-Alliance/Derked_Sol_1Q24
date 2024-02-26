import * as dotenv from "dotenv";
import base58 from "bs58";
import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
} from "@project-serum/anchor";
import { WbaPrereq, IDL } from "./programs/wba_prereq";

dotenv.config();

const pk = process.env.WBA_PRIVATE_KEY || "";
const pkArray = base58.decode(pk);
const wbaWallet = Keypair.fromSecretKey(pkArray);

const connection = new Connection("https://api.devnet.solana.com");
const github = Buffer.from("Derked", "utf8");
const provider = new AnchorProvider(connection, new Wallet(wbaWallet), {
  commitment: "confirmed",
});
const program = new Program<WbaPrereq>(
  IDL,
  "HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1" as Address,
  provider
);
const enrollment_seeds = [
  Buffer.from("prereq"),
  wbaWallet.publicKey.toBuffer(),
];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: wbaWallet.publicKey,
        prereq: enrollment_key,
        systemProgram: SystemProgram.programId,
      })
      .signers([wbaWallet])
      .rpc();
    console.log(`Success! Check out your TX here:
    https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

//https://explorer.solana.com/tx/24QT2AxYMGxcW6c94TwKmoJ2yiE2DT4M9EQw5pFknPfqGVYm23in6P9v87mZjKov1KSoAe2551Tcyt4RE7YzRPhq?cluster=devnet
