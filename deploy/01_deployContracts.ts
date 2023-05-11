import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as dotenv from "dotenv";

import { ZxRosChainNFT, ZxRosChainMinter } from "../typechain-types";

dotenv.config();

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, ethers, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const deployerSigner = await ethers.getSigner(deployer);

  const requiredEnvs = ["BASE_URI"];
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`${env} is not set`);
    }
  }

  const minter = await deploy("ZxRosChainMinter", {
    from: deployer,
    log: true,
  });

  const zxRosaChainNFT = await deploy("ZxRosChainNFT", {
    from: deployer,
    args: [process.env.BASE_URI],
    log: true,
  });

  const minterContract = (await ethers.getContractAt(
    "ZxRosChainMinter",
    minter.address,
    deployerSigner,
  )) as ZxRosChainMinter;

  console.log(`Setting 0xRosChainNFT in minter...`);
  await (await minterContract.setToken(zxRosaChainNFT.address)).wait();
  console.log(`Done...`);
};

export default func;

func.tags = ["0xRosChain"];
