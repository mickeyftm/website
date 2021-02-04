import clsx from 'clsx';
import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { Typography, Link, Status, Skeleton } from 'src/common';
import { URLS } from 'src/router/urls';
import { ProposalState, ProposalStateColors } from '../constants';
import { FormattedProposal } from '../voting.types';
import { useVotingProposalsStyles } from './voting-proposals.styles';

export type VotingProposalsProps = {
  className?: string;
  loading: boolean;
  proposals: FormattedProposal[];
};

export const VotingProposals: React.FC<VotingProposalsProps> = (props) => {
  const classes = useVotingProposalsStyles();

  return (
    <div className={clsx(classes.root, props.className)}>
      {props.loading &&
        Array.from(Array(5), (_, index) => index).map((item) => (
          <Skeleton key={item} className={classes.proposalSkeleton} />
        ))}
      {!props.loading &&
        props.proposals.map((proposal) => (
          <Typography key={proposal.id} variant="h5" component="div">
            <Link
              component={ReactRouterLink}
              to={URLS.voting.detail(proposal.id)}
              className={classes.proposal}
            >
              <Typography variant="inherit" className={classes.proposalTitle}>
                {proposal.title}
              </Typography>
              {proposal.status && (
                <Status color={ProposalStateColors[proposal.status]}>
                  {ProposalState[Number(proposal.status)]}
                </Status>
              )}
            </Link>
          </Typography>
        ))}
      {!props.loading && !props.proposals.length && (
        <Typography variant="h5" component="div">
          <div className={classes.proposal}>
            <Typography variant="inherit" className={classes.proposalTitle}>
              No proposals yet...
            </Typography>
          </div>
        </Typography>
      )}
    </div>
  );
};