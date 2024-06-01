import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys contracts named "PoolBatchSwapTest" and "BatchSwap" using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployPoolBatchSwapTestAndBatchSwap: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const network = hre.network.name; // Dynamically get the network name

  let pool_manager = ""

  if (network ==  "sepolia") {
    pool_manager = "0xc021A7Deb4a939fd7E661a0669faB5ac7Ba2D5d6"

  }


  // Deploy PoolBatchSwapTest contract
  console.log('waiting 1 second')
  await new Promise((resolve) => setTimeout(resolve, 25000)); // 1000 milliseconds = 1 second
  console.log('waited 1 second')
  const poolBatchSwapTestDeployment = await deploy("PoolBatchSwapTest", {
    from: deployer,
    args: [pool_manager], // Constructor arguments if any
    log: true,
    autoMine: true,
    
  });

  // Get the deployed PoolBatchSwapTest contract address
  const poolBatchSwapTestAddress = poolBatchSwapTestDeployment.address;

  // Deploy BatchSwap contract with the PoolBatchSwapTest contract address
  console.log('waiting 1 second')
  await new Promise((resolve) => setTimeout(resolve, 25000)); // 1000 milliseconds = 1 second
  console.log('waited 1 second')
  const batchSwapDeployment = await deploy("BatchSwap", {
    from: deployer,
    args: [poolBatchSwapTestAddress], // Pass the PoolBatchSwapTest address as a constructor argument
    log: true,
    autoMine: true,

  });

  const batchSwapAddress = batchSwapDeployment.address;
  const network = hre.network.name; // Dynamically get the network name

  console.log(`PoolBatchSwapTest deployed at: ${poolBatchSwapTestAddress}`);
  console.log(`To verify contracts, run:`);
  console.log(`yarn hardhat verify "${poolBatchSwapTestAddress}" --network ${network} "${pool_manager}"`);
};

export default deployPoolBatchSwapTestAndBatchSwap;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags PoolBatchSwapTest,BatchSwap
deployPoolBatchSwapTestAndBatchSwap.tags = ["swap"];
