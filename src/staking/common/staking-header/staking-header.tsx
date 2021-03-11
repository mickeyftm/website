import React, { useMemo } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import clsx from 'clsx';

import { ReactComponent as ArrowLeftIcon } from 'src/assets/icons/arrow-left-bold.svg';
import {
  Link,
  Typography,
  STAKING_ICONS,
  BN,
  humanizeNumeral
} from 'src/common';
import { URLS } from 'src/router/urls';
import { useStakingHeaderStyles } from './staking-header.styles';

export type StakingHeaderProps = {
  token?: string[];
  tokenKey: string;
  APY?: BN;
  totalSupply?: BN;
  className?: string;
  poolRate?: BN;
  lockable?: boolean;
  loading: boolean;
};

export const StakingHeader: React.FC<StakingHeaderProps> = (props) => {
  const tokenName = useMemo(() => {
    return props.token?.join('_');
  }, [props.token]);

  const classes = useStakingHeaderStyles({
    tokenName
  });

  return (
    <div className={clsx(classes.root, props.className)}>
      <Link
        component={ReactRouterLink}
        className={classes.link}
        to={URLS.staking.list}
      >
        <ArrowLeftIcon className={classes.linkIcon} />
      </Link>
      <div className={classes.content}>
        <div className={classes.title}>
          <Typography variant="h2" weight="bold" align="center">
            {props.loading
              ? 'Loading pool...'
              : props.token?.map((title, index) => {
                  const Icon = STAKING_ICONS[title];

                  return (
                    <React.Fragment key={title}>
                      {Icon && <Icon />} {title}{' '}
                      {index === 0 && props.token?.length === 2 ? ' + ' : null}
                    </React.Fragment>
                  );
                })}
          </Typography>
          <Typography variant="h2" align="center">
            APY {props.loading ? '...' : <>{humanizeNumeral(props.APY)} %</>}
          </Typography>
        </div>
        <div className={classes.info}>
          <Typography variant="body1" component="span">
            Deposit:{' '}
            <Typography variant="inherit" component="span" weight="bold">
              {props.loading ? '...' : tokenName}
            </Typography>
          </Typography>
          <Typography variant="body1" component="span">
            Earn:{' '}
            <Typography variant="inherit" component="span" weight="bold">
              {props.loading ? '...' : 'BAG'}
            </Typography>
          </Typography>
          <Typography variant="body1" component="span">
            Total Supply:{' '}
            <Typography variant="inherit" component="span" weight="bold">
              {props.loading ? (
                '...'
              ) : (
                <>${humanizeNumeral(props.totalSupply)}</>
              )}
            </Typography>
          </Typography>
          <Typography variant="body1" component="span">
            Pool rate:{' '}
            <Typography variant="inherit" component="span" weight="bold">
              {props.loading ? (
                '...'
              ) : (
                <>{humanizeNumeral(props.poolRate)} BAG / day</>
              )}
            </Typography>
          </Typography>
          {props.lockable && (
            <Typography variant="body1" component="span">
              Locking:{' '}
              <Typography variant="inherit" component="span" weight="bold">
                {props.loading ? '...' : '3 month'}
              </Typography>
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};
