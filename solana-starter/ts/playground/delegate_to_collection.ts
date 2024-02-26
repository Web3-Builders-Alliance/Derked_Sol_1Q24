import {
  TokenStandard,
  delegateCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import base58 from "bs58";

//delegate from wba wallet
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

//This is your NFT address you originally minted
const mint = publicKey("58m2J8qqYXpHrUahSKPEM8r7oPrjmsbVmKRLJoWsZfZw");
const collectionDelegate = publicKey(
  "3bbXAfSVjreAwWWhRMciGz7GH48xrsxBvPNKhSzGN8A7"
);

(async () => {
  try {
    const tx = await delegateCollectionV1(umi, {
      mint,
      authority: signer,
      delegate: collectionDelegate,
      tokenStandard: TokenStandard.NonFungible,
    }).sendAndConfirm(umi);
    const signature = base58.encode(tx.signature);
    console.log(
      `Succesfully added delegate! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (e) {
    console.log("Oops.. Something went wrong", e);
  }
})();
