//dev wallet verifies
import wallet from "../dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import base58 from "bs58";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  collectionToggle,
  findMetadataPda,
  updateAsCollectionDelegateV2,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";

const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

const nftToVerify = publicKey("58m2J8qqYXpHrUahSKPEM8r7oPrjmsbVmKRLJoWsZfZw");
const collectionMint = publicKey("RUGSpK1XaLB4ior2ywcRKy6dfpzMSC383Zas1ns9sua");

(async () => {
  try {
    const tx = await verifyCollectionV1(umi, {
      metadata: findMetadataPda(umi, { mint: nftToVerify }),
      collectionMint,
      authority: signer,
    }).sendAndConfirm(umi);
    const signature = base58.encode(tx.signature);
    console.log(
      `Succesfully verified! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.log("Oops.. Something went wrong", e);
  }
})();
