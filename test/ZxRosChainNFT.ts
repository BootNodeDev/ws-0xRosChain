import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { takeSnapshot, SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZxRosChainNFT } from "../typechain-types";

describe("ZxRosChainNFT", function () {
  let nft: ZxRosChainNFT;
  let snapshot: SnapshotRestorer;
  let owner: SignerWithAddress;
  let someUser: SignerWithAddress;
  let minter: SignerWithAddress;

  let MAX_SUPPLY = 100;

  before(async () => {
    [owner, someUser, minter] = await ethers.getSigners();
    owner;
    const NFT = await ethers.getContractFactory("ZxRosChainNFT");
    nft = await NFT.deploy("testURI/", MAX_SUPPLY, minter.address);
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await nft.name()).to.equal("0xRosChainNFT");
      expect(await nft.symbol()).to.equal("0xRSC");
    });
  });

  describe("tokenURI", function () {
    it("Should get the right token URI", async function () {
      await nft.connect(minter).mint(someUser.address);
      expect(await nft.tokenURI(0)).to.equal("testURI/0");
    });
  });

  describe("mint", function () {
    it("only minter should be allowed to mint new a NFT", async function () {
      await expect(nft.mint(someUser.address)).to.be.revertedWithCustomError(
        nft,
        "ZxRosChainMinter__onlyMinter",
      );
    });

    it("should be caped to MAX_SUPPLY NFTs", async function () {
      for (let index = 0; index < MAX_SUPPLY; index++) {
        await nft.connect(minter).mint(someUser.address);
      }
      await expect(nft.mint(someUser.address)).to.be.reverted;
    });
  });
});
