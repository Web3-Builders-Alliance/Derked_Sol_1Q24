import * as dotenv from "dotenv";
import base58 from "bs58";
dotenv.config();

const pk = process.env.DEV_WALLET_PRIVATE_KEY || "";
const pkArray: Uint8Array = new Uint8Array(
  pk.split(",").map((byte) => parseInt(byte, 10))
);
console.log("pk 58:", base58.encode(pkArray));
