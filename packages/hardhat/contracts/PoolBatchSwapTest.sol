// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { CurrencyLibrary, Currency } from "../libs/v4-core/src/types/Currency.sol";
import { IPoolManager } from "../libs/v4-core/src/interfaces/IPoolManager.sol";
import { BalanceDelta, BalanceDeltaLibrary } from "../libs/v4-core/src/types/BalanceDelta.sol";
import { PoolKey } from "../libs/v4-core/src/types/PoolKey.sol";
import { IHooks } from "../libs/v4-core/src/interfaces/IHooks.sol";
import { Hooks } from "../libs/v4-core/src/libraries/Hooks.sol";
import { PoolTestBase } from "../libs/v4-core/src/test/PoolTestBase.sol";
import { CurrencySettler } from "../libs/v4-core/test/utils/CurrencySettler.sol";

contract PoolBatchSwapTest is PoolTestBase {
	using CurrencySettler for Currency;
	using Hooks for IHooks;

	constructor(IPoolManager _manager) PoolTestBase(_manager) {}

	error NoSwapOccurred();

	struct CallbackData {
		address sender;
		TestSettings testSettings;
		PoolKey[] keys;
		IPoolManager.SwapParams[] params;
		bytes hookData;
	}

	struct TestSettings {
		bool takeClaims;
		bool settleUsingBurn;
	}

	function swap(
		PoolKey[] memory keys,
		IPoolManager.SwapParams[] memory params,
		TestSettings memory testSettings,
		bytes memory hookData
	) external payable returns (BalanceDelta[] memory deltas) {
		require(keys.length == params.length, "Array lengths must match");

		deltas = new BalanceDelta[](keys.length);

		bytes memory callbackData = abi.encode(
			CallbackData(msg.sender, testSettings, keys, params, hookData)
		);
		deltas = abi.decode(manager.unlock(callbackData), (BalanceDelta[]));

		uint256 ethBalance = address(this).balance;
		if (ethBalance > 0)
			CurrencyLibrary.NATIVE.transfer(msg.sender, ethBalance);
	}

	function unlockCallback(
		bytes calldata rawData
	) external returns (bytes memory) {
		require(msg.sender == address(manager));

		CallbackData memory data = abi.decode(rawData, (CallbackData));

		BalanceDelta[] memory deltas = new BalanceDelta[](data.keys.length);

		for (uint256 i = 0; i < data.keys.length; i++) {
			PoolKey memory key = data.keys[i];
			IPoolManager.SwapParams memory params = data.params[i];
			bytes memory hookData = data.hookData;

			(, , int256 deltaBefore0) = _fetchBalances(
				key.currency0,
				data.sender,
				address(this)
			);
			(, , int256 deltaBefore1) = _fetchBalances(
				key.currency1,
				data.sender,
				address(this)
			);

			require(deltaBefore0 == 0, "deltaBefore0 is not equal to 0");
			require(deltaBefore1 == 0, "deltaBefore1 is not equal to 0");

			// todo
			BalanceDelta delta = manager.swap(key, params, hookData);

			(, , int256 deltaAfter0) = _fetchBalances(
				key.currency0,
				data.sender,
				address(this)
			);
			(, , int256 deltaAfter1) = _fetchBalances(
				key.currency1,
				data.sender,
				address(this)
			);

			if (params.zeroForOne) {
				if (params.amountSpecified < 0) {
					// exact input, 0 for 1
					require(
						deltaAfter0 >= params.amountSpecified,
						"deltaAfter0 is not greater than or equal to data.params.amountSpecified"
					);
					require(
						delta.amount0() == deltaAfter0,
						"delta.amount0() is not equal to deltaAfter0"
					);
					require(
						deltaAfter1 >= 0,
						"deltaAfter1 is not greater than or equal to 0"
					);
				} else {
					// exact output, 0 for 1
					require(
						deltaAfter0 <= 0,
						"deltaAfter0 is not less than or equal to zero"
					);
					require(
						delta.amount1() == deltaAfter1,
						"delta.amount1() is not equal to deltaAfter1"
					);
					require(
						deltaAfter1 <= params.amountSpecified,
						"deltaAfter1 is not less than or equal to data.params.amountSpecified"
					);
				}
			} else {
				if (params.amountSpecified < 0) {
					// exact input, 1 for 0
					require(
						deltaAfter1 >= params.amountSpecified,
						"deltaAfter1 is not greater than or equal to data.params.amountSpecified"
					);
					require(
						delta.amount1() == deltaAfter1,
						"delta.amount1() is not equal to deltaAfter1"
					);
					require(
						deltaAfter0 >= 0,
						"deltaAfter0 is not greater than or equal to 0"
					);
				} else {
					// exact output, 1 for 0
					require(
						deltaAfter1 <= 0,
						"deltaAfter1 is not less than or equal to 0"
					);
					require(
						delta.amount0() == deltaAfter0,
						"delta.amount0() is not equal to deltaAfter0"
					);
					require(
						deltaAfter0 <= params.amountSpecified,
						"deltaAfter0 is not less than or equal to data.params.amountSpecified"
					);
				}
			}

			if (deltaAfter0 < 0) {
				key.currency0.settle(
					manager,
					data.sender,
					uint256(-deltaAfter0),
					data.testSettings.settleUsingBurn
				);
			}
			if (deltaAfter1 < 0) {
				key.currency1.settle(
					manager,
					data.sender,
					uint256(-deltaAfter1),
					data.testSettings.settleUsingBurn
				);
			}
			if (deltaAfter0 > 0) {
				key.currency0.take(
					manager,
					data.sender,
					uint256(deltaAfter0),
					data.testSettings.takeClaims
				);
			}
			if (deltaAfter1 > 0) {
				key.currency1.take(
					manager,
					data.sender,
					uint256(deltaAfter1),
					data.testSettings.takeClaims
				);
			}

			deltas[i] = delta;
		}

		return abi.encode(deltas);
	}
}
