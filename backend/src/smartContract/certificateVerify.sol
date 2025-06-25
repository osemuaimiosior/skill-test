// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract certificateVerify {
    address public admin;

    struct Certificate {
        address recipient;
        string certificateHash; // IPFS hash or document hash
        uint256 issuedAt;
        bool exists;
    }

    // Maps a unique certificate ID to a Certificate struct
    mapping(string => Certificate) public certificates;

    event CertificateIssued(string certId, address recipient, string certHash, uint256 timestamp);
    event CertificateRevoked(string certId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Issues a new certificate
    function issueCertificate(string memory certId, address recipient, string memory certHash) public onlyAdmin {
        require(!certificates[certId].exists, "Certificate ID already exists.");

        certificates[certId] = Certificate({
            recipient: recipient,
            certificateHash: certHash,
            issuedAt: block.timestamp,
            exists: true
        });

        emit CertificateIssued(certId, recipient, certHash, block.timestamp);
    }

    /// @notice Verifies a certificate
    function verifyCertificate(string memory certId) public view returns (
        address recipient,
        string memory certHash,
        uint256 issuedAt,
        bool valid
    ) {
        Certificate memory cert = certificates[certId];
        return (cert.recipient, cert.certificateHash, cert.issuedAt, cert.exists);
    }

    /// @notice Admin can revoke a certificate
    function revokeCertificate(string memory certId) public onlyAdmin {
        require(certificates[certId].exists, "Certificate does not exist.");
        certificates[certId].exists = false;

        emit CertificateRevoked(certId);
    }
}
