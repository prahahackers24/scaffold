import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployTokens: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const initialSupply = "1000000000000000000000000"; // Initial supply for each token

  const tokenDetails = [
    { name: "USDC", ticker: "USDC" },
    // { name: "DogeCoin", ticker: "DOGE" },
    // { name: "Pepe", ticker: "PEPE" },
    // { name: "HarryPotterObamaSonic10Inu", ticker: "BITCOIN" },
    { name: "Optimism", ticker: "OP" },
    { name: "Mantle", ticker: "MNT" },
    { name: "Polygon", ticker: "MATIC" },
    { name: "TheGraph", ticker: "GRT" },
    { name: "EigenLayer", ticker: "EIGEN" },
    { name: "Uniswap", ticker: "UNI" },
    { name: "Zircuit", ticker: "ZRC" },
  ];

  let approvalTexts = []

  for (const token of tokenDetails) {
    const deployment = await deploy(token.ticker, {
      contract: `contracts/tokens/${token.ticker}.sol:${token.ticker}`,
      from: deployer,
      args: [initialSupply],
      log: true,
      autoMine: true,
    });

    const contractAddress = deployment.address;
    const network = hre.network.name;

    const tokenContract = await hre.ethers.getContract<Contract>(token.ticker, deployer);
    await tokenContract.approve("0x24cE7Bdf867de81e6A910982d658e423ad3DA3C9", "99999999999999999999999999999");
    // TODO: create uniswap pool

    console.log(`Deployed ${token.ticker}  at ${contractAddress} on ${network}`);
    console.log(`yarn hardhat verify "${contractAddress}" --network ${network} "${initialSupply}"`);
  }
};

export default deployTokens;

deployTokens.tags = ["tokens"];
