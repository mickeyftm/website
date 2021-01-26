import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Head, PageWrapper } from 'src/common';
import { MainLayout } from 'src/layouts';
import {
  useVotingProposalList,
  VotingInfoFactoid,
  VotingInfoProposalList,
  VotingInfoDecision,
  VotingInfoHowTo
} from '../common';
import { useVotingInfoStyles } from './voting-info.styles';

export const VotingInfo: React.FC = () => {
  const classes = useVotingInfoStyles();

  const { proposals = [], loading, pages } = useVotingProposalList(3);

  const proposalCount = useMemo(
    () => Math.round(pages.length * proposals.length),
    [pages.length, proposals.length]
  );

  return (
    <>
      <Head title="Influence the future of protocol using the BondAppétit Governance" />
      <MainLayout>
        <PageWrapper className={classes.root}>
          <VotingInfoProposalList
            loading={loading}
            proposals={proposals}
            proposalCount={proposalCount}
            className={clsx(classes.proposals, classes.block)}
          />
          <VotingInfoFactoid className={clsx(classes.factoid, classes.block)} />
          <VotingInfoDecision className={classes.decision} />
          <VotingInfoHowTo />
        </PageWrapper>
      </MainLayout>
    </>
  );
};
