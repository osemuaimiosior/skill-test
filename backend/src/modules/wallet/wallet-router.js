const express = require("express");
const router = express.Router();
const walletController = require("./wallet-controller");

router.post("/create-wallet", walletController.createWallet);
router.post("/import-wallet", walletController.integrateWallet);

module.exports = { walletRoutes: router };
