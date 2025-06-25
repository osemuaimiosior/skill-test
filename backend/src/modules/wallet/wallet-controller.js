require('dotenv').config();
const asyncHandler = require("express-async-handler");
const ethers = require('ethers');
const bip39 = require('bip39');
const contractABI = require("../../smartContract/contractABI.json");
const walletModel = require("../../config/model/walletModel");

const abi = contractABI;
const providerUrl = process.env.EVM_NODE_HTTPS_MAINNET;

const createWallet = asyncHandler(async (req, res) => { 
    const mnemonic = bip39.generateMnemonic();

    if(mnemonic) {
        const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic);

        const newWalletAccount = await walletModel.create({
            PrivateKey : walletMnemonic.privateKey,
            AccountAddress : walletMnemonic.address,
            Mnemonics : walletMnemonic.mnemonic.phrase
        });
        await newWalletAccount.save();

        res.json({
            "StatusCode": 200,
            "Message": "success",
            "Data": {
                "PrivateKey" : walletMnemonic.privateKey,
                //"PublicKey" : walletMnemonic.publicKey,
                "AccountAddress" : walletMnemonic.address,
                "Mnemonics" : walletMnemonic.mnemonic.phrase
            }
        });
    };
});

const integrateWallet = asyncHandler(async (req, res) => {
    const privateKey = req.body.PRIVATE_KEY;
    const cleanKey = privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey;
    //Check for how to get mnemonics
    
    if(cleanKey) {
            const pKey = cleanKey;
            const wallet = new ethers.Wallet(pKey);
            const address = wallet.address;
            //const publicKey = ethers.utils.computePublicKey(wallet.privateKey, true);
            const newWalletAccount = await walletModel.create({
                PrivateKey : privateKey,
                AccountAddress : address
            });

            await newWalletAccount.save();
            
            res.json({
                    "StatusCode": 200,
                    "Message": "success",
                    "Data": {
                        "PublicAddress" : address,
                        "PrivateKey" : privateKey
                    }
                });
        };
        }
);

const walletBalance = asyncHandler(async(req, res) => {
     const balance = await provider.getBalance(address);
     res.json({
                "StatusCode": 200,
                "Message": "success",
                "Data": {
                    "details" : ethers.formatEther(balance)
                }
        });
});

const pay = asyncHandler(async (req, res) =>{
    const privateKey = req.body.PRIVATE_KEY;
    const amountInEther = req.body.ETHER_AMOUNT; 
    const toAddress = process.env.COMPANY_WALLET_ADDR;

    const provider = new ethers.providers.JsonRpcProvider(providerUrl)
    const wallet = new ethers.Wallet(privateKey, provider)
    const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountInEther) // e.g., "0.01"
    });

    console.log("Transaction hash:", tx.hash);
    await tx.wait(); // Wait for confirmation
        res.json({
                "StatusCode": 200,
                "Message": "success",
                "Data": {
                    "details" : tx
                }
        });
});

module.exports = {
    createWallet,
    integrateWallet,
    walletBalance,
    pay
}