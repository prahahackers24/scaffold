// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, Ownable, ERC20Permit {
	constructor(
		string memory tokenName,
		string memory ticker,
		uint256 initialSupply
	) ERC20(tokenName, ticker) ERC20Permit("MyToken") {
		_mint(msg.sender, initialSupply);
	}

	function mint(address to, uint256 amount) public onlyOwner {
		_mint(to, amount);
	}
}
