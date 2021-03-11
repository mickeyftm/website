import React, { useCallback } from 'react';
import { useToggle } from 'react-use';

import {
  Button,
  LinkModal,
  Skeleton,
  Typography,
  useNetworkConfig
} from 'src/common';
import { VotingInvestingForm } from '../voting-investing-form';
import { useVotingInvestingStyles } from './voting-investing.styles';

export type VotingInvestingProps = {
  loading: boolean;
  percent?: string;
  totalTokens?: string;
  balance?: string;
};

export const VotingInvesting: React.VFC<VotingInvestingProps> = (props) => {
  const networkConfig = useNetworkConfig();
  const [linkModalIsOpen, toggleLinkModal] = useToggle(false);
  const [investFormIsOpen, toggleInvestForm] = useToggle(false);

  const classes = useVotingInvestingStyles();

  const handleOpenBuyModal = useCallback(() => {
    toggleLinkModal(false);
    toggleInvestForm(true);
  }, [toggleLinkModal, toggleInvestForm]);

  return (
    <>
      <div className={classes.root}>
        <Typography variant="h2">
          {props.loading ? <Skeleton /> : <>{props.balance} BAG Remaining</>}
          <br />
          of {props.loading ? <Skeleton /> : props.totalTokens} total
          distributed
        </Typography>
        <div>
          <progress
            className={classes.progress}
            max="100"
            value={props.percent}
          />
        </div>
        <Button onClick={toggleLinkModal}>Buy</Button>
      </div>
      <VotingInvestingForm open={investFormIsOpen} onClose={toggleInvestForm} />
      <LinkModal
        withBuyCollateralMarket
        onBuyCollateralMarket={handleOpenBuyModal}
        open={linkModalIsOpen}
        onClose={toggleLinkModal}
        tokenName={networkConfig.assets.Governance.symbol}
        tokenAddress={networkConfig.assets.Governance.address}
      />
    </>
  );
};