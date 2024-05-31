# 🏗 Donation Appreciation

<h4 align="center">
![logo](logo.png)
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

Donation Appreciation is a donation dApp that accepts shitcoins (all ERC20 tokens). A donation campaign is registered in the smart contract, and it determines a runtime and USDC target for the donation. When the donation hits the target (in USDC), UniSwap hooks are used to swap all tokens for USDC, before transferring the USDC to the donation recipient address. To check if the donation ERC20 holdings are greater than the donation target before swapping, we create an EigenLayer AVS to verify this.

⚙️ Built using EigenLayer, The Graph, Uniswap NextJS, Hardhat, and Wagmi.

- 🗳️ **Quickly create a donation campaign**: On our frontend it's easy to setup a new campaign, just define a a campaign name, set a target (in $USDC) and you're ready to go.
- 🪝 **New Uniswap hooks**: TODO
- 🪙 **Accept all ERC20**: Donations can accept any ERC20 tokens, which will be swapped to $USDC at the end of the campaign.
- 📈 **Multiple ways to hit target**: Reach your donation targets either by new donations or by increase in token price of current donations.
- 🔐 **Secured with Eigenlayer AVS**: We use a custom EigenLayer AVS to verify the target is reached before swapping all ERC20 tokens to $USDC.

## Hackathon tracks

###

### Eigenlayer - Best use of EigenLayer AVS

We created our own Eigenlayer AVS.

Also we fixed a bug in the Hello World repo, which caused issues when executing the make commands. After the hackathon we will submit a PR to the repo for this.

### Uniswap Foundation - Hook Features

### The Graph - Best New Subgraph

### Linea - Build any dapp on Linea

### Mantle - Best DeFi project

### Optimism - Prototype a Superchain Superpower

### Polygon - Launch a Creative MVP on Polygon Cardona

### Zircuit - Best Hackathon Project on Zircuit

## Next steps

- Use new AVS to filter on donation creators (only accept legitimate fundraisers)

## Links

- [Vercel deployment](https://donationappreciation.vercel.app/)
- [Presentation slides]()
- [Demo video]()
- [Github ](https://github.com/prahahackers24/scaffold)

### Verified Smart Contracts

#### Donation contract

- [Smart contract on Holesky](https://holesky.etherscan.io/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)
- [Smart contract on Mantle Testnet](https://sepolia.mantlescan.xyz/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)
- [Smart contract on Linea Testnet](https://sepolia.lineascan.build/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)
- [Smart contract on Optimism Sepolia](https://sepolia-optimism.etherscan.io/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)
- [Smart contract on Polygon Cardona](https://cardona-zkevm.polygonscan.com/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)
- [Smart contract on Zircuit](https://explorer.zircuit.com/address/0x3B89a9D1026E29c7959154E5c826159C720007cb)

#### Eigenlayer Smart Contracts

## Team

This project was build at EthPrague 2024 by:

- [AlexAstro](https://x.com/_alexastro/)
- [arjanjohan](https://x.com/arjanjohan/)
- [JacobJelen.eth](https://x.com/jacobjelen)
