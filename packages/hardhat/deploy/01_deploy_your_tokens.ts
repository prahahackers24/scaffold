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
    await tokenContract.approve("0x6D141F14b8be1C7B4aB2924CFba1819baDCd58c2", "99999999999999999999999999999");

    // //approve  swap router
    // await tokenContract.approve("0x841b5a0b3dbc473c8a057e2391014aa4c4751351", "99999999999999999999999999999");

    // //approve pool contract
    // await tokenContract.approve("0x39bf2eff94201cfaa471932655404f63315147a4", "99999999999999999999999999999");

    //approve swap router
    await tokenContract.approve("0xc021A7Deb4a939fd7E661a0669faB5ac7Ba2D5d6", "99999999999999999999999999999");
    // TODO: create uniswap pool

    console.log(`Deployed ${token.ticker}  at ${contractAddress} on ${network}`);
    console.log(`yarn hardhat verify "${contractAddress}" --network ${network} "${initialSupply}"`);


    async function mintWithDelay(tokenContract: any, recipient: any, amount: any, ticker: any) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds = 1 second
      await tokenContract.mint(recipient, amount);
      console.log(`Minted ${amount} ${ticker} to ${recipient}`);
    }
    // await mintWithDelay(tokenContract, "0x898c6F7bD2cDaEfcA404699825efFc841d7eA299", 150, token.ticker);
    // console.log(`Minted ${150} ${token.ticker} to ${"0x898c6F7bD2cDaEfcA404699825efFc841d7eA299"}`);
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
