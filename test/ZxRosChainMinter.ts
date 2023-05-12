import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { takeSnapshot, SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZxRosChainNFT, ZxRosChainMinter } from "../typechain-types";

describe("ZxRosChainMinter", function () {
  let minter: ZxRosChainMinter;
  let nft: ZxRosChainNFT;
  let snapshot: SnapshotRestorer;
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let someUser: SignerWithAddress;
  let MAX_SUPPLY = 100;

  before(async () => {
    [deployer, owner, someUser] = await ethers.getSigners();
    deployer;
    const Minter = await ethers.getContractFactory("ZxRosChainMinter");
    minter = await Minter.deploy();

    const NFT = await ethers.getContractFactory("ZxRosChainNFT");
    nft = await NFT.deploy("testURI/", MAX_SUPPLY, minter.address);

    await minter.transferOwnership(owner.address);
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("setToken", function () {
    it("only owner should be allowed to set the token", async function () {
      await expect(minter.connect(someUser).setToken(nft.address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("owner should be able to set the token", async function () {
      await minter.connect(owner).setToken(nft.address);
      expect(await minter.token()).to.equal(nft.address);
    });
  });

  describe("mint", function () {
    before(async () => {
      await minter.connect(owner).setToken(nft.address);
    });

    it("should revert with custom error if token is not set", async function () {
      await minter.connect(owner).setToken(ethers.constants.AddressZero);
      await expect(minter.connect(someUser).mint()).to.be.revertedWithCustomError(
        minter,
        "ZxRosChainMinter__mint_tokenNotSet",
      );
    });

    it("should allow users be able to mint the current token for himself", async function () {
      const nextTokenId = await nft.nextId();
      await minter.connect(someUser).mint();
      expect(await nft.ownerOf(nextTokenId)).to.equal(someUser.address);
    });

    it("should be restricted to 1 token per user");

    // Dejar este para el final, si hacemos tiempo lo vemos!
    // Hint: https://media.consensys.net/ever-wonder-how-merkle-trees-work-c2f8b7100ed3
    it("only allowed user should be able to mint the current token");
  });
});
