import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";


const deployTokens: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const initialSupply = "1000000000000000000000"; // Initial supply for each token

  const tokenDetails = [
    { name: "USDC", ticker: "USDC" },
    { name: "DogeCoin", ticker: "DOGE" },
    { name: "Pepe", ticker: "PEPE" },
    { name: "HarryPotterObamaSonic10Inu", ticker: "BITCOIN" },
    { name: "Optimism", ticker: "OP" },
    { name: "Mantle", ticker: "MNT" },
    { name: "Polygon", ticker: "MATIC" },
    { name: "The Graph", ticker: "GRT" },
    { name: "EigenLayer", ticker: "EIGEN" },
    { name: "Uniswap", ticker: "UNI" },
    { name: "Zircuit", ticker: "ZRC" },
  ];

  for (const token of tokenDetails) {
    const deployment = await deploy("MyToken", {
      from: deployer,
      args: [token.name, token.ticker, initialSupply],
      log: true,
      autoMine: true,
    });

    const contractAddress = deployment.address;
    const network = hre.network.name;

    const tokenContract = await hre.ethers.getContract<Contract>("MyToken", deployer);
    await tokenContract.approve("0x4a2B33A77de8F69b8Cf913aafc6357f4Ce176105",99999999999999999999999999999);


    console.log(`Deployed ${token.name} (${token.ticker}) at ${contractAddress} on ${network}`);
    console.log(`yarn hardhat verify "${contractAddress}" --network ${network} "${token.name}" "${token.ticker}" "${initialSupply}"`);

  }
};

export default deployTokens;

deployTokens.tags = ["tokens"];
