import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const imageFile = await readFile("/home/ayush/Desktop/Projects/Q3_25_Builder_Ayush/solana-starter/ts/walterWhite.png")
        //2. Convert image to generic file.
        const imageGeneric = createGenericFile(imageFile, "walterWhite.png", { contentType: "image/png"});
        //3. Upload image

        // const image = ???

        const [myUri] = await umi.uploader.upload([imageGeneric],)
        console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
