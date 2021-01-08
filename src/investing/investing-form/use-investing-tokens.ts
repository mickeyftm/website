import { useEffect, useCallback, useState, useMemo } from 'react';
import BN from 'bignumber.js';

import { useNetworkConfig, useInvestmentContract, Token } from 'src/common';

export const useInvestingTokens = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const network = useNetworkConfig();
  const investmentContract = useInvestmentContract();

  const handleLoadTokenPrices = useCallback(async () => {
    const tokensWithPrice = Object.values(network.assets)
      .filter(({ investing }) => investing)
      .map(async (asset) => {
        const price = await investmentContract.methods
          .price(asset.address, new BN(10).pow(asset.decimals).toString())
          .call();

        return {
          name: asset.symbol,
          address: asset.address,
          decimals: asset.decimals,
          price: price
            ? new BN(price)
                .div(new BN(10).pow(network.assets.Governance.decimals))
                .toString()
            : ''
        };
      });

    try {
      setTokens(await Promise.all(tokensWithPrice));
    } catch (e) {
      console.error(e);
    }
  }, [network, investmentContract]);

  useEffect(() => {
    handleLoadTokenPrices();
  }, [handleLoadTokenPrices]);

  return useMemo(
    () =>
      tokens.reduce<Record<string, Token>>((acc, token) => {
        acc[token.name] = token;

        return acc;
      }, {}),
    [tokens]
  );
};