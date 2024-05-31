// SPDX-License-Identifier: MIT
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
	uint nextCampaignId;

	struct Campaign {
		address campaignOwner;
		bool isCampaignLive;
		string campaignName;
		mapping(address => uint) tokenAmounts; // mapping to keep track of donated tokens & amounts
	}

	mapping(uint => Campaign) public campaigns;

	event CampaignCreated(
		uint campaignId,
		address campaignOwner,
		string campaignName
	);
	event CampaignClosed(uint campaignId);
	event DonationReceived(
		uint campaignId,
		address donor,
		address[] tokenAddresses,
		uint[] tokenAmounts
	);

	//donate
	function donate(
		address[] memory _tokenAddresses,
		uint[] memory _tokenAmounts,
		uint _campaignId
	) public payable {
		Campaign storage campaign = campaigns[_campaignId];
		require(campaign.isCampaignLive, "Campaign is not live");
		require(
			_tokenAddresses.length == _tokenAmounts.length,
			"Array length mismatch"
		);

		for (uint i = 0; i < _tokenAddresses.length; i++) {
			IERC20 token = IERC20(_tokenAddresses[i]);
			token.transferFrom(
				msg.sender,
				address(this), // Tokens are transferred to this contract address
				_tokenAmounts[i]
			);
			campaign.tokenAmounts[_tokenAddresses[i]] += _tokenAmounts[i];
		}

		emit DonationReceived(
			_campaignId,
			msg.sender,
			_tokenAddresses,
			_tokenAmounts
		);
	}

	//create campaign
	function createCampaign(string memory _campaignName) public {
		Campaign storage newCampaign = campaigns[nextCampaignId];
		newCampaign.campaignOwner = msg.sender;
		newCampaign.isCampaignLive = true;
		newCampaign.campaignName = _campaignName;

		emit CampaignCreated(nextCampaignId, msg.sender, _campaignName);
		nextCampaignId++;
	}

	//close campaign
	function closeCampaign(uint _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(
			campaign.campaignOwner == msg.sender,
			"You are not the owner of this campaign"
		);
		campaign.isCampaignLive = false;

		emit CampaignClosed(_campaignId);
	}
}
