import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { takeSnapshot, SnapshotRestorer } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import { ZxRosChainNFT, ZxRosChainMinter } from "../typechain-types";

describe("ZxRosChainMinter", function () {
  let minter: ZxRosChainMinter;
  let nft: ZxRosChainNFT;
  let snapshot: SnapshotRestorer;
  let deployer: SignerWithAddress;
  let owner: SignerWithAddress;
  let allowedUser: SignerWithAddress;
  let allowedUser2: SignerWithAddress;
  let notAllowedUser: SignerWithAddress;
  let merkleTree: MerkleTree;
  let allowedUsers: string[];
  let leafNodes: string[];

  const MAX_SUPPLY = 100;

  before(async () => {
    [deployer, owner, allowedUser, allowedUser2, notAllowedUser] = await ethers.getSigners();
    deployer;
    const Minter = await ethers.getContractFactory("ZxRosChainMinter");
    minter = await Minter.deploy();

    const NFT = await ethers.getContractFactory("ZxRosChainNFT");
    nft = await NFT.deploy("testURI/", MAX_SUPPLY, minter.address);

    await minter.transferOwnership(owner.address);

    allowedUsers = [allowedUser.address, allowedUser2.address];
    leafNodes = allowedUsers.map((address) => ethers.utils.keccak256(address));
    merkleTree = new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true });
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("setToken", function () {
    it("only owner should be allowed to set the token", async function () {
      await expect(minter.connect(allowedUser).setToken(nft.address)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });

    it("owner should be able to set the token", async function () {
      await minter.connect(owner).setToken(nft.address);
      expect(await minter.token()).to.equal(nft.address);
    });
  });

  // TODO
  // describe("setMerkelRoots")

  describe("mint", function () {
    let allowedUserProof: string[];

    before(async () => {
      await minter.connect(owner).setToken(nft.address);
      await minter.connect(owner).setMerkelRoots(merkleTree.getHexRoot());
      allowedUserProof = merkleTree.getHexProof(leafNodes[0]);
    });

    it("should revert with custom error if token is not set", async function () {
      await minter.connect(owner).setToken(ethers.constants.AddressZero);
      await expect(minter.connect(allowedUser).mint(allowedUserProof)).to.be.revertedWithCustomError(
        minter,
        "ZxRosChainMinter__mint_tokenNotSet",
      );
    });

    it("should allow allowed users to mint the current token for himself", async function () {
      const nextTokenId = await nft.nextId();
      await minter.connect(allowedUser).mint(allowedUserProof);
      expect(await nft.ownerOf(nextTokenId)).to.equal(allowedUser.address);
    });

    it("should be restricted to 1 token per user", async function () {
      await minter.connect(allowedUser).mint(allowedUserProof);

      await expect(minter.connect(allowedUser).mint(allowedUserProof)).to.be.revertedWithCustomError(
        minter,
        "ZxRosChainMinter__mint_userAlreadyMinted",
      );
    });

    it("only allowed user should be able to mint the current token", async function () {
      await expect(minter.connect(notAllowedUser).mint(allowedUserProof)).to.be.revertedWithCustomError(
        minter,
        "ZxRosChainMinter__mint_invalidMerkleProof",
      );
    });
  });
});
