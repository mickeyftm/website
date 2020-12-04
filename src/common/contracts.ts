import IERC20 from '@bondappetit/networks/abi/IERC20.json';
import { abi as BondAbi } from '@bondappetit/networks/abi/Bond.json';
import { AbiItem } from 'web3-utils';

import type { Investment } from 'src/generate/Investment';
import type { Market } from 'src/generate/Market';
import type { Ierc20 } from 'src/generate/IERC20';
import type { GovernorAlpha } from 'src/generate/GovernorAlpha';
import type { Bond } from 'src/generate/Bond';
import type { Stacking } from 'src/generate/Stacking';
import type { IUniswapV2Router02 } from 'src/generate/IUniswapV2Router02';
import type { UniswapAnchoredView } from 'src/generate/UniswapAnchoredView';
import type { Issuer } from 'src/generate/Issuer';
import type { SecurityOracle } from 'src/generate/SecurityOracle';
import type { DepositaryOracle } from 'src/generate/DepositaryOracle';
import type { Vesting } from 'src/generate/Vesting';
import { createUseContract } from './create-use-contract';

export const useInvestmentContract = createUseContract<Investment>(
  (network) => ({
    abi: network.contracts.Investment.abi,
    address: network.contracts.Investment.address
  })
);

export const useMarketContract = createUseContract<Market>((network) => ({
  abi: network.contracts.Market.abi,
  address: network.contracts.Market.address
}));

export const useUSDTContract = createUseContract<Ierc20>((network) => ({
  abi: IERC20.abi as AbiItem[],
  address: network.assets.USDT.address
}));

export const useDAIContract = createUseContract<Ierc20>((network) => ({
  abi: IERC20.abi as AbiItem[],
  address: network.assets.DAI.address
}));

export const useUSDCContract = createUseContract<Ierc20>((network) => ({
  abi: IERC20.abi as AbiItem[],
  address: network.assets.USDC.address
}));

export const useBondTokenContract = createUseContract<Ierc20>((network) => ({
  abi: IERC20.abi as AbiItem[],
  address: network.assets.Bond.address
}));

export const useABTTokenContract = createUseContract<Ierc20>((network) => ({
  abi: IERC20.abi as AbiItem[],
  address: network.assets.ABT.address
}));

export const useGovernorContract = createUseContract<GovernorAlpha>(
  (network) => ({
    abi: network.contracts.GovernorAlpha.abi,
    address: network.contracts.GovernorAlpha.address
  })
);

export const useBondContract = createUseContract<Bond>((network) => ({
  abi: BondAbi as AbiItem[],
  address: network.assets.Bond.address
}));

export const useStackingContract = createUseContract<Stacking>((network) => ({
  abi: network.contracts.Stacking.abi,
  address: network.contracts.Stacking.address
}));

export const useUniswapRouter = createUseContract<IUniswapV2Router02>(
  (network) => ({
    abi: network.contracts.UniswapV2Router02.abi,
    address: network.contracts.UniswapV2Router02.address
  })
);

export const useUniswapAnchoredView = createUseContract<UniswapAnchoredView>(
  (network) => ({
    abi: network.contracts.UniswapAnchoredView.abi,
    address: network.contracts.UniswapAnchoredView.address
  })
);

export const useIssuerContract = createUseContract<Issuer>((network) => ({
  abi: network.contracts.Issuer.abi,
  address: network.contracts.Issuer.address
}));

export const useSecurityOracleContract = createUseContract<SecurityOracle>(
  (network) => ({
    abi: network.contracts.SecurityOracle.abi,
    address: network.contracts.SecurityOracle.address
  })
);

export const useDepositaryOracleContract = createUseContract<DepositaryOracle>(
  (network) => ({
    abi: network.contracts.DepositaryOracle.abi,
    address: network.contracts.DepositaryOracle.address
  })
);

export const useVestingContract = createUseContract<Vesting>((network) => ({
  abi: network.contracts.Vesting.abi,
  address: network.contracts.Vesting.address
}));
