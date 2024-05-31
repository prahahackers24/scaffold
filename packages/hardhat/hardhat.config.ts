import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const infuraApiKey = process.env.INFURA_API_KEY;
// If not set, it uses the hardhat account 0 private key.
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses ours Etherscan default API key.
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
        runs: 200,
      },
    },
  },
  defaultNetwork: "holesky",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    holesky: {
      url: `https://eth-holesky.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    polygonZkEvmTestnet: {
      url: `https://rpc.cardona.zkevm-rpc.com`,
      accounts: [deployerPrivateKey],
    },

    mantleTest: {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: [deployerPrivateKey],
    },

    linea: {
      url: `https://linea-sepolia.infura.io/v3/${infuraApiKey}`,
      accounts: [deployerPrivateKey],
    },

    zircuit: {
      url: `https://zircuit1.p2pify.com`,
      accounts: [deployerPrivateKey],
    },
  },

  etherscan: {
    apiKey: {
      // Add your custom network names here
      mainnet: etherscanApiKey,
      sepolia: etherscanApiKey,
      holesky: etherscanApiKey,
      optimismSepolia: etherscanApiKey,
      polygonZkEvmTestnet: etherscanApiKey,
      mantleTest: process.env.MANTLESCAN_API_KEY || "",
      linea: etherscanApiKey,
      zircuit: etherscanApiKey,
    },
    customChains: [
      {
        network: "holesky",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io",
        },
      },
      {
        network: "mantleTest",
        chainId: 5003, // Update with the correct chain ID
        urls: {
          apiURL: "https://api-sepolia.mantlescan.xyz/api",
          browserURL: "https://sepolia.mantlescan.xyz/",
        },
      },
      {
        network: "optimismSepolia",
        chainId: 11155420, // Example Chain ID, verify and update
        urls: {
          apiURL: "https://api-optimistic.etherscan.io/api",
          browserURL: "https://optimistic.etherscan.io",
        },
      },
      {
        network: "polygonZkEvmTestnet",
        chainId: 1442, // Example Chain ID, verify and update
        urls: {
          apiURL: "https://api-testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com",
        },
      },
      {
        network: "linea",
        chainId: 59141, // Example Chain ID, verify and update
        urls: {
          apiURL: "https://api.linea.build/api",
          browserURL: "https://linea.build",
        },
      },
      {
        network: "zircuit",
        chainId: 48899, // Example Chain ID, verify and update
        urls: {
          apiURL: "https://api.zircuit.io/api",
          browserURL: "https://zircuit.io",
        },
      },
    ],
  },
  // configuration for etherscan-verify from hardhat-deploy plugin
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
