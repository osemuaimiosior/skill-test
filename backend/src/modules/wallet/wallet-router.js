const express = require("express");
const router = express.Router();
const walletController = require("./wallet-controller");

router.post("/create-wallet", walletController.createWallet);
router.post("/import-wallet", walletController.integrateWallet);
router.post("/wallet-balance", walletController.walletBalance);
router.post("/pay", walletController.pay);

module.exports = { walletRoutes: router };
