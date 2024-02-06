import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";
import fs from "fs";
import path from "path";

const rawEmail = fs.readFileSync(
  path.join(__dirname, "./eml/prueba.eml"),
  "utf-8"
);

const main = async () => {
  const dkimResult = await verifyDKIMSignature(Buffer.from(rawEmail));
  console.log(dkimResult);
};

main().catch(console.error);
