// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use OpenZeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import { PoolKey } from "../libs/v4-core/src/types/PoolKey.sol";
import { IHooks } from "../libs/v4-core/src/interfaces/IHooks.sol";
import { Currency, CurrencyLibrary } from "../libs/v4-core/src/types/Currency.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract DonationContract {
	uint nextCampaignId = 0;

	struct Campaign {
		address campaignOwner;
		bool isLive;
		string campaignName;
		uint goalAmount;
		address goalToken;
		mapping(address => uint) tokenAmounts; // mapping to keep track of donated tokens & amounts
		address[] tokenAddresses; // to keep track of donated token addresses
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

	address public batchSwapContract;

	constructor(address _batchSwapContract) {
		batchSwapContract = _batchSwapContract;
	}

	// donate
	function donate(
		address[] memory _tokenAddresses,
		uint[] memory _tokenAmounts,
		uint _campaignId
	) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(campaign.isLive, "Campaign is not live");
		require(
			_tokenAddresses.length == _tokenAmounts.length,
			"Array length mismatch"
		);
		require(_tokenAddresses.length > 0, "No tokens to donate");

		for (uint i = 0; i < _tokenAddresses.length; i++) {
			IERC20 token = IERC20(_tokenAddresses[i]);
			token.transferFrom(msg.sender, address(this), _tokenAmounts[i]);
			campaign.tokenAmounts[_tokenAddresses[i]] += _tokenAmounts[i];

			// Add token address to the array if it's the first time this token is donated
			if (campaign.tokenAmounts[_tokenAddresses[i]] == _tokenAmounts[i]) {
				campaign.tokenAddresses.push(_tokenAddresses[i]);
			}
		}

		emit DonationReceived(
			_campaignId,
			msg.sender,
			_tokenAddresses,
			_tokenAmounts
		);
	}

	// create campaign
	function createCampaign(
		string memory _campaignName,
		address goalToken,
		uint goalAmount
	) public {
		Campaign storage newCampaign = campaigns[nextCampaignId];
		newCampaign.campaignOwner = msg.sender;
		newCampaign.isLive = true;
		newCampaign.campaignName = _campaignName;
		newCampaign.goalAmount = goalAmount;
		newCampaign.goalToken = goalToken;

		emit CampaignCreated(nextCampaignId, msg.sender, _campaignName);
		nextCampaignId++;
	}

	// close campaign
	function closeCampaign(uint _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(
			campaign.campaignOwner == msg.sender,
			"You are not the owner of this campaign"
		);
		campaign.isLive = false;

		// Collect token addresses and amounts
		address[] memory tokenAddresses = campaign.tokenAddresses;
		uint[] memory tokenAmounts = new uint[](tokenAddresses.length);
		int256[] memory amountsSpecified = new int256[](tokenAddresses.length);
		bool[] memory zeroForOnes = new bool[](tokenAddresses.length);
		bytes[] memory hookData = new bytes[](tokenAddresses.length);
		PoolKey[] memory keys = new PoolKey[](tokenAddresses.length);

		for (uint i = 0; i < tokenAddresses.length; i++) {
			tokenAmounts[i] = campaign.tokenAmounts[tokenAddresses[i]];
			amountsSpecified[i] = int256(tokenAmounts[i]);
			zeroForOnes[i] = true; // assuming we are swapping all tokens to goalToken
			hookData[i] = ""; // assuming no specific hookData is needed
			// Assuming keys are known and set correctly according to the token addresses involved
			keys[i] = PoolKey({
				currency0: Currency.wrap(tokenAddresses[i]),
				currency1: Currency.wrap(campaign.goalToken),
				fee: 3000, // TODO what value?
				hooks: IHooks(address(0)),
				tickSpacing: 10 // TODO what value?
			});
		}

		// Approve the batch swap contract to transfer tokens on behalf of this contract
		for (uint i = 0; i < tokenAddresses.length; i++) {
			IERC20(tokenAddresses[i]).approve(
				batchSwapContract,
				tokenAmounts[i]
			);
		}

		// Call the batchSwap function on the BatchSwap contract
		(bool success, ) = batchSwapContract.call(
			abi.encodeWithSignature(
				"batchSwap((address,address,uint24)[],int256[],bool[],bytes[])",
				keys,
				amountsSpecified,
				zeroForOnes,
				hookData
			)
		);
		require(success, "Batch swap failed");

		emit CampaignClosed(_campaignId);
	}
}
