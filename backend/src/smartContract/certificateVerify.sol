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

    struct Course {
        string courseID; 
        uint256 taskCount;
        string courseHash; // IPFS hash or document hash
        uint256 createdAt;
        bool exists; 
    }

    // Track individual task completion
    mapping(address => mapping(string => mapping(string => bool))) public completedTasks;

    // Track count of tasks completed per course
    mapping(address => mapping(string => uint256)) public completedTaskCount;


    // Maps a unique certificate ID to a Certificate struct
    mapping(string => Certificate) public certificates;

    // Maps a unique Course ID to a Course struct
    mapping(string => Course) public courses;

    event CertificateIssued(string certId, address recipient, string certHash, uint256 timestamp);
    event CourseCreated(string courseId, uint256 taskCount, string courseHash, uint256 timestamp);
    event CertificateRevoked(string certId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /// @notice Create a new course
    function createCourse(string memory _courseId, uint256 _taskCount, string memory _courseHash) public onlyAdmin {
        require(!courses[_courseId].exists, "Course ID already exists.");

        courses[_courseId] = Course({
            courseID: _courseId,
            taskCount: _taskCount,
            courseHash: _courseHash,
            createdAt: block.timestamp,
            exists: true
        });

        emit CourseCreated(_courseId, _taskCount, _courseHash, block.timestamp);
    }

    /// @notice Issues a new certificate
    function issueCertificate(
            string memory certId,
            address recipient,
            string memory certHash,
            string memory courseId
            ) public onlyAdmin {
                require(!certificates[certId].exists, "Certificate ID already exists.");
                require(courses[courseId].exists, "Course does not exist.");

                uint256 requiredTasks = courses[courseId].taskCount;
                uint256 completed = completedTaskCount[recipient][courseId];

                require(completed >= requiredTasks, "User has not completed required tasks.");

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

    function courseComplete(string memory courseId, string memory taskId, address userAddress) public returns (string memory) {
        require(courses[courseId].exists, "Course does not exist.");
        require(!completedTasks[userAddress][courseId][taskId], "Task already completed.");

        // Mark task as complete
        completedTasks[userAddress][courseId][taskId] = true;

        // Increment completed task count
        completedTaskCount[userAddress][courseId] += 1;

        return "Task completed";
    }
}