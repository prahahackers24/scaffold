// scripts/initializePool.js
const { ethers } = require("hardhat");

async function main() {
  // Contract address
  const contractAddress = "0xc021A7Deb4a939fd7E661a0669faB5ac7Ba2D5d6";

  // Attach to the deployed contract
  const PoolManager = await ethers.getContractFactory("PoolManager");
  const poolManager = PoolManager.attach(contractAddress);

  // Define PoolKey
  // const poolKey = {
  //   currency0: "0xbe2a7F5acecDc293Bf34445A0021f229DD2Edd49", // replace with actual token address
  //   currency1: "0xc268035619873d85461525F5fDb792dd95982161", // replace with actual token address
  //   fee: 3000, // example fee
  //   tickSpacing: 60, // example tick spacing
  //   hooks: "0x0000000000000000000000000000000000000000" // replace with actual hooks address if any, else keep zero address
  // };

  // // Define sqrtPriceX96 (example value)
  // const sqrtPriceX96 = ethers.BigNumber.from("79228162514264337593543950336"); // replace with actual sqrtPriceX96 value

  // // Define hookData (example empty data)
  // const hookData = "0x";

  // // Call initialize function
  // const tx = await poolManager.initialize(poolKey, sqrtPriceX96, hookData);
  // console.log("Transaction hash:", tx.hash);

  // // Wait for the transaction to be confirmed
  // const receipt = await tx.wait();
  // console.log("Transaction confirmed in block:", receipt.blockNumber);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
