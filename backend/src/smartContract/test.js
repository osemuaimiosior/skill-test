const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("certificateVerify", function () {
  let CertificateVerify, contract, admin, user1;

  beforeEach(async () => {
    [admin, user1] = await ethers.getSigners();

    const ContractFactory = await ethers.getContractFactory("certificateVerify");
    contract = await ContractFactory.connect(admin).deploy();
    await contract.deployed();
  });

  it("should allow admin to create a course", async () => {
    await contract.createCourse("course1", 3, "ipfs://courseHash");

    const course = await contract.courses("course1");
    expect(course.exists).to.be.true;
    expect(course.taskCount).to.equal(3);
  });

  it("should allow a user to complete tasks and update count", async () => {
    await contract.createCourse("course1", 3, "ipfs://courseHash");

    await contract.courseComplete("course1", "task1", user1.address);
    await contract.courseComplete("course1", "task2", user1.address);

    const isTask1Completed = await contract.completedTasks(user1.address, "course1", "task1");
    expect(isTask1Completed).to.be.true;

    const count = await contract.completedTaskCount(user1.address, "course1");
    expect(count).to.equal(2);
  });

  it("should not allow the same task to be completed twice", async () => {
    await contract.createCourse("course1", 3, "ipfs://courseHash");

    await contract.courseComplete("course1", "task1", user1.address);

    await expect(
      contract.courseComplete("course1", "task1", user1.address)
    ).to.be.revertedWith("Task already completed.");
  });

  it("should not issue a certificate if user hasn't completed required tasks", async () => {
    await contract.createCourse("course1", 3, "ipfs://courseHash");

    await contract.courseComplete("course1", "task1", user1.address);
    await contract.courseComplete("course1", "task2", user1.address);

    await expect(
      contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1")
    ).to.be.revertedWith("User has not completed required tasks.");
  });

  it("should issue a certificate after user completes all tasks", async () => {
    await contract.createCourse("course1", 3, "ipfs://courseHash");

    await contract.courseComplete("course1", "task1", user1.address);
    await contract.courseComplete("course1", "task2", user1.address);
    await contract.courseComplete("course1", "task3", user1.address);

    await contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1");

    const cert = await contract.certificates("cert1");
    expect(cert.exists).to.be.true;
    expect(cert.recipient).to.equal(user1.address);
    expect(cert.certificateHash).to.equal("ipfs://certHash");
  });

  it("should not issue duplicate certificate with the same ID", async () => {
    await contract.createCourse("course1", 1, "ipfs://courseHash");
    await contract.courseComplete("course1", "task1", user1.address);
    await contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1");

    await expect(
      contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1")
    ).to.be.revertedWith("Certificate ID already exists.");
  });

  it("should allow admin to revoke a certificate", async () => {
    await contract.createCourse("course1", 1, "ipfs://courseHash");
    await contract.courseComplete("course1", "task1", user1.address);
    await contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1");

    await contract.revokeCertificate("cert1");

    const cert = await contract.certificates("cert1");
    expect(cert.exists).to.be.false;
  });

  it("should return certificate data via verifyCertificate", async () => {
    await contract.createCourse("course1", 1, "ipfs://courseHash");
    await contract.courseComplete("course1", "task1", user1.address);
    await contract.issueCertificate("cert1", user1.address, "ipfs://certHash", "course1");

    const [recipient, certHash, issuedAt, valid] = await contract.verifyCertificate("cert1");

    expect(recipient).to.equal(user1.address);
    expect(certHash).to.equal("ipfs://certHash");
    expect(valid).to.be.true;
    expect(issuedAt).to.be.a("bigint"); // block.timestamp
  });
});
