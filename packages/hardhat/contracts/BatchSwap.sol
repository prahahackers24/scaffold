// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IPoolManager } from "../libs/v4-core/src/interfaces/IPoolManager.sol";
import { PoolKey } from "../libs/v4-core/src/types/PoolKey.sol";
import { PoolBatchSwapTest } from "./PoolBatchSwapTest.sol";
import { TickMath } from "../libs/v4-core/src/libraries/TickMath.sol";

contract BatchSwap {
	// Set the router address
	PoolBatchSwapTest swapRouter;

	uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
	uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

	constructor(address _swapRouter) {
		swapRouter = PoolBatchSwapTest(_swapRouter);
	}

	/// @notice Swap tokens
	/// @param keys The pools where the swaps are happening
	/// @param amountsSpecified The amounts of tokens to swap. Negative is an exact-input swap
	/// @param zeroForOnes Whether the swaps are token0 -> token1 or token1 -> token0
	/// @param hookData Any data to be passed to the pool's hook
	function batchSwap(
		PoolKey[] memory keys,
		int256[] memory amountsSpecified,
		bool[] memory zeroForOnes,
		bytes[] memory hookData
	) external payable {
		require(
			keys.length == amountsSpecified.length &&
				amountsSpecified.length == zeroForOnes.length &&
				zeroForOnes.length == hookData.length,
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

		swapRouter.swap(keys, params, testSettings, hookData);
	}
}
