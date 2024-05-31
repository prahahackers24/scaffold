//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
// import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/interfaces/IERC20.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract DonationContract {
	uint campaignId;

	//mapping of campaignId to campaign Owner
	mapping(uint => address) public campaignOwner;

	//mapping of campaignId to campaignState
	mapping(uint => bool) public isCampaignLive;

	mapping(uint => string) public campaignName;

	//donate

	function donate(
		address[] memory _tokenAddresses,
		uint[] memory _tokenAmounts,
		uint _campaignId
	) public payable {
		require(isCampaignLive[_campaignId], "Campaign is not live");
		require(
			_tokenAddresses.length == _tokenAmounts.length,
			"Array length mismatch"
		);

		address donatee = campaignOwner[_campaignId];

		for (uint i = 0; i < _tokenAddresses.length; i++) {
			IERC20 token = IERC20(_tokenAddresses[i]);
			token.transferFrom(msg.sender, donatee, _tokenAmounts[i]);
		}
	}

	//create campagin

	function createCampaign(string memory _campaignName) public {
		campaignId++;
		campaignName[campaignId] = _campaignName;
		isCampaignLive[campaignId] = true;
		campaignOwner[campaignId] = msg.sender;
	}

	//close campaign

	function closeCampaign(uint _campaignId) public {
		require(
			campaignOwner[_campaignId] == msg.sender,
			"You are not the owner of this campaign"
		);
		isCampaignLive[_campaignId] = false;
	}
}
