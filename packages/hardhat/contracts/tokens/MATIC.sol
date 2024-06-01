// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MATIC is ERC20, Ownable, ERC20Permit {
	constructor(
		uint256 initialSupply
	) ERC20("Polygon", "MATIC") ERC20Permit("Polygon") {
		_mint(msg.sender, initialSupply);
	}

	function mint(address to, uint256 amount) public onlyOwner {
		_mint(to, amount);
	}
}
