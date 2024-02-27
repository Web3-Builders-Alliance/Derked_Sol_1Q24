import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { publicKey as publicKeySerializer } from "@metaplex-foundation/umi/serializers";

// Define our Mint address
const mint = publicKey("H4EnJuusXBdPXzk4BvtBrTtzZVUd3xHvzMk1mcgct6DS");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    const metadataSeeds = [
      Buffer.from("metadata"),
      publicKeySerializer().serialize(MPL_TOKEN_METADATA_PROGRAM_ID),
      publicKeySerializer().serialize(mint),
    ];
    const metadata = umi.eddsa.findPda(
      MPL_TOKEN_METADATA_PROGRAM_ID,
      metadataSeeds
    );

    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      metadata: publicKey(metadata),
      mint,
      mintAuthority: signer,
      updateAuthority: signer,
    };
    let data: DataV2Args = {
      name: "Derked",
      symbol: "DERK",
      uri: "",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };
    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      isMutable: true,
      collectionDetails: null,
    };
    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx
      .sendAndConfirm(umi)
      .then((r) => r.signature.toString());
    console.log(result);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
