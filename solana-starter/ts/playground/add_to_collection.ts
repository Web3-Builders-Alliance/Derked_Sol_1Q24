import {
  updateV1,
  fetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

import wallet from "../wba-wallet.json";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import base58 from "bs58";

//add from wba wallet
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

//This is your NFT address you originally minted
const mint = publicKey("58m2J8qqYXpHrUahSKPEM8r7oPrjmsbVmKRLJoWsZfZw");

(async () => {
  const initialMetaData = await fetchMetadataFromSeeds(umi, { mint });
  const tx = await updateV1(umi, {
    mint,
    authority: signer,
    data: { ...initialMetaData, symbol: "WBARUGS" },
    collection: {
      __kind: "Set",
      fields: [
        {
          verified: false, //must be false because cannot verify in instruction
          key: publicKey("RUGSpK1XaLB4ior2ywcRKy6dfpzMSC383Zas1ns9sua"),
        },
      ],
    },
  }).sendAndConfirm(umi);
  const signature = base58.encode(tx.signature);
  console.log(
    `Succesfully added to collection, will need to verify! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
  try {
  } catch (e) {
    console.log("Oops.. Something went wrong", e);
  }
})();
