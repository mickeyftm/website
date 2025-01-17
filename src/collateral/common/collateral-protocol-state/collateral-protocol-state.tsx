import React, { useMemo, useRef } from 'react';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { useHoverDirty, useMedia } from 'react-use';

import { BN, Typography } from 'src/common';
import { useCollateralProtocolStateStyles } from './collateral-protocol-state.styles';

enum CollateralProtocolStates {
  balanced,
  unbalanced,
  critical
}

export type CollateralProtocolStateProps = {
  stableCoinBalanceValue?: BN;
  issuerBalanceValue?: BN;
};

export const CollateralProtocolState: React.FC<CollateralProtocolStateProps> = (
  props
) => {
  const balanced = useRef(null);
  const unbalanced = useRef(null);
  const critical = useRef(null);

  const classes = useCollateralProtocolStateStyles();
  const isHoveringBalanced = useHoverDirty(balanced);
  const isHoveringUnbalanced = useHoverDirty(unbalanced);
  const isHoveringCritical = useHoverDirty(critical);

  const isMobile = useMedia('(max-width: 959px)');

  const collateralState = useMemo(() => {
    if (!props.stableCoinBalanceValue || !props.issuerBalanceValue)
      return CollateralProtocolStates.balanced;

    if (props.stableCoinBalanceValue.eq(props.issuerBalanceValue))
      return CollateralProtocolStates.balanced;

    const collateralValue = props.stableCoinBalanceValue
      .div(props.issuerBalanceValue)
      .minus(1);

    if (collateralValue.isLessThanOrEqualTo(0))
      return CollateralProtocolStates.balanced;

    if (
      collateralValue.isGreaterThan(0) &&
      collateralValue.isLessThanOrEqualTo(0.1)
    )
      return CollateralProtocolStates.unbalanced;

    return CollateralProtocolStates.critical;
  }, [props.stableCoinBalanceValue, props.issuerBalanceValue]);

  return (
    <div className={classes.root}>
      <Tippy
        visible={isHoveringBalanced}
        content="The protocol is fully balanced "
        maxWidth={248}
        offset={[140, 8]}
        animation={false}
        className={classes.tippy}
      >
        <Typography
          variant="h2"
          component="span"
          ref={balanced}
          className={clsx(classes.circle, {
            [classes.green]:
              collateralState === CollateralProtocolStates.balanced
          })}
        >
          {isMobile ? 'balanced' : 'b'}
        </Typography>
      </Tippy>

      <Tippy
        visible={isHoveringUnbalanced}
        content="Insufficient collateral stored but unbalance can be compensated by the funds of the protocol"
        maxWidth={248}
        offset={[140, 8]}
        animation={false}
        className={classes.tippy}
      >
        <Typography
          variant="h2"
          component="span"
          ref={unbalanced}
          className={clsx(classes.circle, {
            [classes.yellow]:
              collateralState === CollateralProtocolStates.unbalanced
          })}
        >
          {isMobile ? 'unbalanced' : 'u'}
        </Typography>
      </Tippy>
      <Tippy
        visible={isHoveringCritical}
        content="The protocol is in a critical state, the community must take immediate actions to rebalance the protocol"
        maxWidth={248}
        offset={[140, 8]}
        animation={false}
        className={classes.tippy}
      >
        <Typography
          variant="h2"
          component="span"
          ref={critical}
          className={clsx(classes.circle, {
            [classes.red]: collateralState === CollateralProtocolStates.critical
          })}
        >
          {isMobile ? 'critical' : 'c'}
        </Typography>
      </Tippy>
    </div>
  );
};
