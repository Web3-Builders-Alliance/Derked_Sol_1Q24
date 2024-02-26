import wallet from "../dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

//image upload
// (async () => {
//   try {
//     const image = await readFile("./collection_rug.png");
//     const rugFile = createGenericFile(image, "./collection_rug.png");
//     const rugUri = await umi.uploader.upload([rugFile]);
//     console.log("image uri: ", rugUri);
//   } catch (error) {
//     console.log("Oops.. Something went wrong", error);
//   }
// })();
//'https://arweave.net/csbuBXY0Vq9dDOkDZQBshFZikZEjY66NkZ_KP1dWPrE'

//metadata upload
(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image =
      "https://arweave.net/csbuBXY0Vq9dDOkDZQBshFZikZEjY66NkZ_KP1dWPrE";
    const metadata = {
      name: "WBA Rugs",
      symbol: "WBARUGS",
      description: "A collection of the world's finest rugs.",
      image: image,
      attributes: [{ trait_type: "Rugs", value: "World's Finest" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      collection: {
        name: "WBA Rugs",
      },
      creators: [
        {
          address: keypair.publicKey.toString(),
          share: 100,
        },
      ],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your json URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
//https://arweave.net/4PZ0wXR2iO0CYBr-vKrXtPyHRifqTux8jgUQePr8XZ4
