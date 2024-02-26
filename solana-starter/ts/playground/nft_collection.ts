import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../dev-wallet.json";
import rugsWallet from "../rugs-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const rugsKeypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(rugsWallet)
);
const collectionMint = createSignerFromKeypair(umi, rugsKeypair);

(async () => {
  let tx = createNft(umi, {
    mint: collectionMint,
    name: "WBA Rugs",
    symbol: "WBARUGS",
    uri: "https://arweave.net/4PZ0wXR2iO0CYBr-vKrXtPyHRifqTux8jgUQePr8XZ4",
    sellerFeeBasisPoints: percentAmount(5),
    isCollection: true,
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  console.log("Mint Address: ", collectionMint.publicKey);
})();
