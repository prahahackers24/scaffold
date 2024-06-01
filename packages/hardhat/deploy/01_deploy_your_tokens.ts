import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployTokens: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const initialSupply = "1000000000000000000000000"; // Initial supply for each token

  const tokenDetails = [
    { name: "USDC", ticker: "USDC" },
    { name: "Optimism", ticker: "OP" },
    { name: "Mantle", ticker: "MNT" },
    { name: "Polygon", ticker: "MATIC" },
    { name: "TheGraph", ticker: "GRT" },
  ];

  for (const token of tokenDetails) {
  //   console.log('waiting 1 second')
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // 1000 milliseconds = 1 second
  //   console.log('waited 1 second')
    const deployment = await deploy(token.ticker, {
      contract: `contracts/tokens/${token.ticker}.sol:${token.ticker}`,
      from: deployer,
      args: [initialSupply],
      log: true,
      autoMine: true,
      gasPrice: `4500000000`,
   
    });

    const contractAddress = deployment.address;
    const network = hre.network.name;

    const tokenContract = await hre.ethers.getContract<Contract>(token.ticker, deployer);
    
    //approve our contract
    await tokenContract.approve("0x38D00054A36bc865077A129489074AF7e9899C3a", "99999999999999999999999999999");

    console.log(`Deployed ${token.ticker}  at ${contractAddress} on ${network}`);
    console.log(`yarn hardhat verify "${contractAddress}" --network ${network} "${initialSupply}"`);


    async function mintWithDelay(tokenContract: any, recipient: any, amount: any, ticker: any) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds = 1 second
      await tokenContract.mint(recipient, amount);
      console.log(`Minted ${amount} ${ticker} to ${recipient}`);
    }
    // await mintWithDelay(tokenContract, "0x15C289f9646474C6BF7fF0E3bf313FBcB8b33A4C", 990000000000, token.ticker);
    // console.log(`Minted ${150} ${token.ticker} to ${"0x15C289f9646474C6BF7fF0E3bf313FBcB8b33A4C"}`);
    // await mintWithDelay(tokenContract, "0x5Af844dc7E25d782Ee5A6a66BB7f8F737bBabbe6", 150, token.ticker);
    // console.log(`Minted ${150} ${token.ticker} to ${"0x5Af844dc7E25d782Ee5A6a66BB7f8F737bBabbe6"}`);
    // await mintWithDelay(tokenContract, "0x199d51a2Be04C65f325908911430E6FF79a15ce3", 150, token.ticker);
    // console.log(`Minted ${150} ${token.ticker} to ${"0x199d51a2Be04C65f325908911430E6FF79a15ce3"}`);
    // await mintWithDelay(tokenContract, "0xF41e35e1b3a9C2DA397FA8a13bd1EF7989AB9017", 150, token.ticker);
    // console.log(`Minted ${150} ${token.ticker} to ${"0xF41e35e1b3a9C2DA397FA8a13bd1EF7989AB9017"}`);
  }
};

export default deployTokens;

deployTokens.tags = ["tokens"];
