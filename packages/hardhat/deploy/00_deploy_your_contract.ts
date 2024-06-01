import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "DonationContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDonationContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const network = hre.network.name; // Dynamically get the network name

  let swapRouter = "";
  let batchSwapRouter = "";

  if (network ==  "sepolia") {
    swapRouter = "0x841B5A0b3DBc473c8A057E2391014aa4C4751351"
    batchSwapRouter = "0x3f1e9D9cfdB1b44feD1769C02C6AE5Bb97aF7E34"

  }

  await deploy("DonationContract", {
    from: deployer,
    // Contract constructor arguments
    args: [swapRouter, batchSwapRouter], // TODO this is incorrect
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // TODO: Create some campaigns after deploying
  // Get the deployed contract to interact with it after deploying.
  const donationContract = await hre.ethers.getContract<Contract>("DonationContract", deployer);
  
  const contractAddress = await donationContract.getAddress();

  console.log(`yarn hardhat verify "${contractAddress}" --network ${network} "${swapRouter}" "${batchSwapRouter}"`);

  await donationContract.makeSwap(["0xc268035619873d85461525F5fDb792dd95982161", "0xc268035619873d85461525F5fDb792dd95982161", 500, 10, "0x0000000000000000000000000000000000000000"], 1, true);
  // await donationContract.createCampaign("Test", "0x5711a5D8e1dB96C9db0AAF3c3CEfB4403B5D230D", 100);
  // await donationContract.donate(["0x06cA44b817F9172e1BaB3a8e8a36020AeC6D7e8d"],[1],0);
    // await donationContract.closeCampaign(1);

};

export default deployDonationContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags DonationContract
deployDonationContract.tags = ["contract"];
