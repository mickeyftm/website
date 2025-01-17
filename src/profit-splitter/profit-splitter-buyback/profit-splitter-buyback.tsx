import clsx from 'clsx';
import React from 'react';

import {
  Plate,
  Typography,
  Button,
  LinkIfAccount,
  useBuybackContract,
  humanizeNumeral
} from 'src/common';
import { useBuybackBuy } from './use-buyback-buy';
import { useSplitterBalance } from '../common';
import { useBuybackRecipient } from './use-buyback-recipient';

export type ProfitSplitterBuybackProps = {
  className?: string;
  updateCount: number;
  handleUpdate: () => void;
};

export const ProfitSplitterBuyback: React.FC<ProfitSplitterBuybackProps> = (
  props
) => {
  const recipient = useBuybackRecipient();

  const buybackContract = useBuybackContract();

  const { asset, tokenBalance } = useSplitterBalance(
    buybackContract?.methods.incoming,
    buybackContract?.options.address,
    props.updateCount
  );

  const balance = tokenBalance?.toString(10) ?? '';

  const handleBuy = useBuybackBuy(balance, props.handleUpdate);

  return (
    <Plate className={clsx(props.className)}>
      <Typography variant="h3">Buyback</Typography>
      <Typography variant="h5">
        Incoming balance: {humanizeNumeral(tokenBalance)} {asset?.symbol}
      </Typography>
      <Button onClick={handleBuy}>Buy</Button>
      {recipient && (
        <Typography variant="body1">
          Recipient: <LinkIfAccount>{recipient}</LinkIfAccount>
        </Typography>
      )}
    </Plate>
  );
};
