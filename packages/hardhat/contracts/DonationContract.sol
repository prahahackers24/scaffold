// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use OpenZeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import { PoolKey } from "../libs/v4-core/src/types/PoolKey.sol";
import { IHooks } from "../libs/v4-core/src/interfaces/IHooks.sol";
import { Currency, CurrencyLibrary } from "../libs/v4-core/src/types/Currency.sol";
import { IPoolManager } from "../libs/v4-core/src/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "../libs/v4-core/src/test/PoolSwapTest.sol";
import { PoolBatchSwapTest } from "./PoolBatchSwapTest.sol";

import { TickMath } from "../libs/v4-core/src/libraries/TickMath.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author arjanjohan
 */
contract DonationContract {
	uint nextCampaignId = 0;

	// Add both the original router and new batchSwapRouter for testing purposes
	PoolSwapTest swapRouter;
	PoolBatchSwapTest batchSwapRouter;

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

	constructor(address _batchSwapContract, address _swapRouter) {
		batchSwapRouter = PoolBatchSwapTest(_swapRouter);

		swapRouter = PoolSwapTest(_swapRouter);
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

	// close campaign
	function closeCampaign(uint _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(
			campaign.campaignOwner == msg.sender,
			"You are not the owner of this campaign"
		);
		campaign.isLive = false;

		address[] memory tokenAddresses = campaign.tokenAddresses;

		//
		for (uint i = 0; i < tokenAddresses.length; i++) {
			if (campaign.tokenAddresses[i] == campaign.goalToken) {
				// skip goal token
				continue;
			}
			Currency inputCurrency = Currency.wrap(tokenAddresses[i]);
			Currency outputCurrency = Currency.wrap(campaign.goalToken);
			bool zeroForOne = true;
			if (inputCurrency >= outputCurrency) {
				zeroForOne = false;
			}

			PoolKey memory key = PoolKey({
				currency0: zeroForOne ? inputCurrency : outputCurrency,
				currency1: zeroForOne ? outputCurrency : inputCurrency,
				fee: 3000,
				hooks: IHooks(address(0)),
				tickSpacing: 10
			});
			uint tokenAmount = campaign.tokenAmounts[tokenAddresses[i]];
			if (key.currency0 >= key.currency1) {}

			swap(key, int256(tokenAmount), zeroForOne);
		}

		emit CampaignClosed(_campaignId);
	}

	// UNISWAP FUNCTIONS

	// slippage tolerance to allow for unlimited price impact
	uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
	uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

	/// @notice Swap tokens
	/// @param key the pool where the swap is happening
	/// @param amountSpecified the amount of tokens to swap. Negative is an exact-input swap
	/// @param zeroForOne whether the swap is token0 -> token1 or token1 -> token0
	function swap(
		PoolKey memory key,
		int256 amountSpecified,
		bool zeroForOne
	) internal {
		IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
			zeroForOne: zeroForOne,
			amountSpecified: -amountSpecified,
			sqrtPriceLimitX96: zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT // unlimited impact
		});

		// in v4, users have the option to receieve native ERC20s or wrapped ERC6909 tokens
		// here, we'll take the ERC20s
		PoolSwapTest.TestSettings memory testSettings = PoolSwapTest
			.TestSettings({ takeClaims: false, settleUsingBurn: false });

		bytes memory hookData = new bytes(0);
		swapRouter.swap(key, params, testSettings, hookData);
	}

	/// @notice Swap tokens
	/// @param keys The pools where the swaps are happening
	/// @param amountsSpecified The amounts of tokens to swap. Negative is an exact-input swap
	/// @param zeroForOnes Whether the swaps are token0 -> token1 or token1 -> token0
	function batchSwap(
		PoolKey[] memory keys,
		int256[] memory amountsSpecified,
		bool[] memory zeroForOnes
	) internal {
		require(
			keys.length == amountsSpecified.length,
			"Array lengths must match"
		);

		IPoolManager.SwapParams[] memory params = new IPoolManager.SwapParams[](
			keys.length
		);

		for (uint256 i = 0; i < keys.length; i++) {
			params[i] = IPoolManager.SwapParams({
				zeroForOne: zeroForOnes[i],
				amountSpecified: amountsSpecified[i],
				sqrtPriceLimitX96: zeroForOnes[i]
					? MIN_PRICE_LIMIT
					: MAX_PRICE_LIMIT
			});
		}

		PoolBatchSwapTest.TestSettings memory testSettings = PoolBatchSwapTest
			.TestSettings({ takeClaims: false, settleUsingBurn: false });

		bytes memory hookData = new bytes(0);

		// do we need to give router permission?
		batchSwapRouter.swap(keys, params, testSettings, hookData);
	}

	// testing

	function makeSwap(
		PoolKey memory key,
		int256 amountSpecified,
		bool zeroForOne
	) public {
		swap(key, amountSpecified, zeroForOne);
	}

	function makeBatchSwap(
		PoolKey[] memory keys,
		int256[] memory amountsSpecified,
		bool[] memory zeroForOnes
	) public {
		batchSwap(keys, amountsSpecified, zeroForOnes);
	}
}
