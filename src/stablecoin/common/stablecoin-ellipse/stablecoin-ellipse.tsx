import React, { useMemo } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { Typography, Link, Button, Skeleton, BN } from 'src/common';
import { URLS } from 'src/router/urls';
import { SablecoinInfo } from '../use-stable-coin-info';
import { useStablecoinEllipseStyles } from './stablecoin-ellipse.styles';

export type StablecoinEllipseProps = {
  className?: string;
  onBuy: () => void;
  onSell: () => void;
  tokenInfo?: SablecoinInfo;
  loading: boolean;
};

const round = (sum?: string | null) => {
  if (!sum) return null;

  return new BN(sum).integerValue().toFormat(10);
};

export const StablecoinEllipse: React.FC<StablecoinEllipseProps> = (props) => {
  const classes = useStablecoinEllipseStyles();

  const dailyVolumeUSD = useMemo(
    () => round(props.tokenInfo?.data.tokenDayDatas?.[0]?.dailyVolumeUSD),
    [props.tokenInfo]
  );
  const totalLiquidityUSD = useMemo(
    () => round(props.tokenInfo?.data.tokenDayDatas?.[0]?.totalLiquidityUSD),
    [props.tokenInfo]
  );

  return (
    <div className={props.className}>
      <div className={classes.ellipse}>
        <Typography variant="h1" align="center" className={classes.title}>
          The first-ever decentralized{'\n'}
          stablecoin based on real-world assets
        </Typography>
        <div>
          <Typography variant="body1" align="center" className={classes.info}>
            <Typography
              variant="inherit"
              component="span"
              className={classes.supply}
            >
              {props.loading && <Skeleton className={classes.skeleton} />}
              {!props.loading && (
                <>
                  Total Liquidity:{' '}
                  <Typography variant="inherit" component="span" weight="bold">
                    {totalLiquidityUSD || 0} $
                  </Typography>
                </>
              )}
            </Typography>
            <Typography variant="inherit" component="span">
              {props.loading && <Skeleton className={classes.skeleton} />}
              {!props.loading && (
                <>
                  Volume (24h):{' '}
                  <Typography variant="inherit" component="span" weight="bold">
                    {dailyVolumeUSD || 0} $
                  </Typography>
                </>
              )}
            </Typography>
          </Typography>
          <div className={classes.actions}>
            <Button onClick={props.onBuy}>Buy</Button>
            <Button onClick={props.onSell}>Sell</Button>
          </div>
        </div>
      </div>
      <div className={classes.subtext}>
        <Typography variant="h4" align="center">
          <Typography variant="inherit" component="p" align="center">
            USDp is the first-ever decentralized stablecoin that is based on a
            basket of real-world debt obligations. USDp price equals $1 at all
            times and asset is issued only with sufficient collateral.
          </Typography>
          <Link
            color="blue"
            component={ReactRouterLink}
            to={`${URLS.whitepaper}#3`}
          >
            Learn more
          </Link>
        </Typography>
      </div>
    </div>
  );
};