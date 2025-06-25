const asyncHandler = require("express-async-handler");
const contractABI = require("../../smartContract/contractABI.json");

const abi = contractABI;

const issueCertificate = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const dashboard = await fetchDashboardData(id);
    res.json(dashboard);
});

const verifyCertificate = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const dashboard = await fetchDashboardData(id);
    res.json(dashboard);
});

const revokeCertificate = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const dashboard = await fetchDashboardData(id);
    res.json(dashboard);
});

CERTIFICATE_VERIFY_ADDRESS
module.exports = {
    issueCertificate,
    verifyCertificate,
    revokeCertificate
};
