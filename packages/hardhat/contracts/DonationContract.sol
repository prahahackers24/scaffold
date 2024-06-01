// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import { PoolKey } from "../libs/v4-core/src/types/PoolKey.sol";
import { IHooks } from "../libs/v4-core/src/interfaces/IHooks.sol";
import { Currency, CurrencyLibrary } from "../libs/v4-core/src/types/Currency.sol";
import { IPoolManager } from "../libs/v4-core/src/interfaces/IPoolManager.sol";
import { PoolSwapTest } from "../libs/v4-core/src/test/PoolSwapTest.sol";
import { PoolBatchSwapTest } from "./PoolBatchSwapTest.sol";
import { TickMath } from "../libs/v4-core/src/libraries/TickMath.sol";

/**
 * A smart contract that allows creating and managing donation campaigns.
 * It also allows the owner to swap donated tokens to the goal token and withdraw the Ether in the contract.
 * @author arjanjohan
 */
contract DonationContract {
	uint public nextCampaignId = 0;

	PoolSwapTest public swapRouter;
	PoolBatchSwapTest public batchSwapRouter;

	struct Campaign {
		address campaignOwner;
		bool isLive;
		string campaignName;
		uint goalAmount;
		address goalToken;
		mapping(address => uint) tokenAmounts;
		address[] tokenAddresses;
	}

	mapping(uint => Campaign) public campaigns;

	event CampaignCreated(
		uint campaignId,
		address campaignOwner,
		string campaignName,
		uint goalAmount,
		address goalToken
	);
	event CampaignClosed(uint campaignId);
	event DonationReceived(
		uint campaignId,
		address donor,
		address[] tokenAddresses,
		uint[] tokenAmounts
	);

	uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
	uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

	/**
	 * @dev Constructor initializes the contract with the provided batchSwapContract and swapRouter addresses.
	 * @param _batchSwapContract The address of the batch swap contract.
	 * @param _swapRouter The address of the swap router.
	 */
	constructor(address _batchSwapContract, address _swapRouter) {
		batchSwapRouter = PoolBatchSwapTest(_batchSwapContract);
		swapRouter = PoolSwapTest(_swapRouter);
	}

	/**
	 * @dev Create a new donation campaign.
	 * @param _campaignName The name of the campaign.
	 * @param goalToken The address of the token in which the goal amount is set.
	 * @param goalAmount The target amount of the campaign in the goal token.
	 */
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

	/**
	 * @dev Donate to a specific campaign with multiple tokens.
	 * @param _tokenAddresses Array of token addresses to donate.
	 * @param _tokenAmounts Array of amounts corresponding to each token address.
	 * @param _campaignId The ID of the campaign to donate to.
	 */
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

	/**
	 * @dev Close a campaign and perform token swaps to convert all donated tokens to the goal token.
	 * @param _campaignId The ID of the campaign to close.
	 */
	function closeCampaign(uint _campaignId) public {
		Campaign storage campaign = campaigns[_campaignId];
		require(
			campaign.campaignOwner == msg.sender,
			"You are not the owner of this campaign"
		);
		campaign.isLive = false;

		address[] memory tokenAddresses = campaign.tokenAddresses;

		uint length = tokenAddresses.length;
		PoolKey[] memory keys = new PoolKey[](length);
		int256[] memory amountsSpecified = new int256[](length);
		bool[] memory zeroForOnes = new bool[](length);

		uint batchIndex = 0;

		for (uint i = 0; i < length; i++) {
			if (tokenAddresses[i] == campaign.goalToken) {
				// skip goal token
				continue;
			}
			Currency inputCurrency = Currency.wrap(tokenAddresses[i]);
			Currency outputCurrency = Currency.wrap(campaign.goalToken);
			bool zeroForOne = inputCurrency < outputCurrency;

			keys[batchIndex] = PoolKey({
				currency0: zeroForOne ? inputCurrency : outputCurrency,
				currency1: zeroForOne ? outputCurrency : inputCurrency,
				fee: 500,
				hooks: IHooks(address(0)),
				tickSpacing: 10
			});

			amountsSpecified[batchIndex] = int256(
				campaign.tokenAmounts[tokenAddresses[i]]
			);
			zeroForOnes[batchIndex] = zeroForOne;

			batchIndex++;
		}

		// Adjust the arrays to remove any skipped elements
		if (batchIndex < length) {
			PoolKey[] memory adjustedKeys = new PoolKey[](batchIndex);
			int256[] memory adjustedAmountsSpecified = new int256[](batchIndex);
			bool[] memory adjustedZeroForOnes = new bool[](batchIndex);

			for (uint j = 0; j < batchIndex; j++) {
				adjustedKeys[j] = keys[j];
				adjustedAmountsSpecified[j] = amountsSpecified[j];
				adjustedZeroForOnes[j] = zeroForOnes[j];
			}

			// batchSwap(
			// 	adjustedKeys,
			// 	adjustedAmountsSpecified,
			// 	adjustedZeroForOnes
			// );
		} else {
			// batchSwap(keys, amountsSpecified, zeroForOnes);
		}

		emit CampaignClosed(_campaignId);
	}

	/**
	 * @dev Internal function to perform a token swap using the swap router.
	 * @param key The pool key for the swap.
	 * @param amountSpecified The amount of tokens to swap. Negative for exact-input swap.
	 * @param zeroForOne Whether the swap is token0 -> token1 (true) or token1 -> token0 (false).
	 */
	function swap(
		PoolKey memory key,
		int256 amountSpecified,
		bool zeroForOne
	) internal {
		IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
			zeroForOne: zeroForOne,
			amountSpecified: amountSpecified,
			sqrtPriceLimitX96: zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT
		});

		// in v4, users have the option to receieve native ERC20s or wrapped ERC6909 tokens
		// here, we'll take the ERC20s
		PoolSwapTest.TestSettings memory testSettings = PoolSwapTest
			.TestSettings({ takeClaims: false, settleUsingBurn: false });

		bytes memory hookData = new bytes(0);

		IERC20(Currency.unwrap(key.currency0)).approve(
			address(swapRouter),
			type(uint256).max
		);
		IERC20(Currency.unwrap(key.currency1)).approve(
			address(swapRouter),
			type(uint256).max
		);
		require(
			IERC20(Currency.unwrap(key.currency0)).balanceOf(address(this)) >=
				uint256(amountSpecified),
			"Insufficient token balance"
		);
		swapRouter.swap(key, params, testSettings, hookData);
	}

	/**
	 * @dev Internal function to perform a batch token swap using the batch swap router.
	 * @param keys Array of pool keys for the swaps.
	 * @param amountsSpecified Array of amounts of tokens to swap. Negative for exact-input swaps.
	 * @param zeroForOnes Array of booleans indicating whether each swap is token0 -> token1 (true) or token1 -> token0 (false).
	 */
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
		for (uint i = 0; i < keys.length; i++) {
			params[i] = IPoolManager.SwapParams({
				zeroForOne: zeroForOnes[i],
				amountSpecified: amountsSpecified[i],
				sqrtPriceLimitX96: zeroForOnes[i]
					? MIN_PRICE_LIMIT
					: MAX_PRICE_LIMIT
			});

			IERC20(Currency.unwrap(keys[i].currency0)).approve(
				address(swapRouter),
				type(uint256).max
			);
			IERC20(Currency.unwrap(keys[i].currency1)).approve(
				address(swapRouter),
				type(uint256).max
			);
		}

		PoolBatchSwapTest.TestSettings memory testSettings = PoolBatchSwapTest
			.TestSettings({ takeClaims: false, settleUsingBurn: false });

		bytes memory hookData = new bytes(0);
		batchSwapRouter.swap(keys, params, testSettings, hookData);
	}

	/**
	 * @dev Public function to perform a single token swap for testing purposes.
	 * @param key The pool key for the swap.
	 * @param amountSpecified The amount of tokens to swap. Negative for exact-input swap.
	 * @param zeroForOne Whether the swap is token0 -> token1 (true) or token1 -> token0 (false).
	 */
	function makeSwap(
		PoolKey memory key,
		int256 amountSpecified,
		bool zeroForOne
	) public {
		swap(key, amountSpecified, zeroForOne);
	}

	/**
	 * @dev Public function to perform a batch token swap for testing purposes.
	 * @param keys Array of pool keys for the swaps.
	 * @param amountsSpecified Array of amounts of tokens to swap. Negative for exact-input swaps.
	 * @param zeroForOnes Array of booleans indicating whether each swap is token0 -> token1 (true) or token1 -> token0 (false).
	 */
	function makeBatchSwap(
		PoolKey[] memory keys,
		int256[] memory amountsSpecified,
		bool[] memory zeroForOnes
	) public {
		batchSwap(keys, amountsSpecified, zeroForOnes);
	}
}
