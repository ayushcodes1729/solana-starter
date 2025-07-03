import wallet from "../turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("9oSjfH5g8BjTDcFnTKRsPFwYxsGumGcRt7gQqdaNFdAJ")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "Luffy Token",
            symbol: "LUFFY",
            uri: "https://res.cloudinary.com/dg57in75j/image/upload/c_crop,w_500,h_450,g_auto/v1751438546/tai-anh-luffy-cute-35_akr8cx.jpg",
            sellerFeeBasisPoints: 10, 
            creators: [{
                address: signer.publicKey,
                verified: true,
                share: 100
            }],
            collection: null,
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(`Transaction signature: ${bs58.encode(result.signature)}`);
        console.log("Metadata account created successfully!");
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
