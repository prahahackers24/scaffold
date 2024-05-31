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

  await deploy("DonationContract", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // TODO: Create some campaigns after deploying
  // Get the deployed contract to interact with it after deploying.
  const donationContract = await hre.ethers.getContract<Contract>("DonationContract", deployer);
  
  const contractAddress = await donationContract.getAddress();
  const network = hre.network.name; // Dynamically get the network name

  console.log(`yarn hardhat verify "${contractAddress}" --network ${network}`);

  // await donationContract.createCampaign("Test", "0x5711a5D8e1dB96C9db0AAF3c3CEfB4403B5D230D", 100);
  await donationContract.donate(["0x865981CAd2E01237A47f765f46e3E19F3a1cdfCC"],[1],0);
};

export default deployDonationContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags DonationContract
deployDonationContract.tags = ["DonationContract"];
