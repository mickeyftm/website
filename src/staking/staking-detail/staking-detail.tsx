import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';
import Tippy from '@tippyjs/react';
import { useToggle, useAsyncFn, useAsyncRetry } from 'react-use';

import { MainLayout } from 'src/layouts';
import {
  Plate,
  Typography,
  PageWrapper,
  useBalance,
  Head,
  BN,
  humanizeNumeral,
  Skeleton
} from 'src/common';
import {
  StakingHeader,
  useStakingUnlock,
  useCanUnStaking,
  useStakingListData,
  StakingEmpty,
  useStakingContracts
} from 'src/staking/common';
import { useStakingConfig } from 'src/staking-config';
import { WalletButtonWithFallback } from 'src/wallets';
import { config } from 'src/config';
import { StakingLockForm } from '../staking-lock-form';
import { useStakingDetailStyles } from './staking-detail.styles';

export const StakingDetail: React.FC = () => {
  const classes = useStakingDetailStyles();
  const params = useParams<{ tokenId: string }>();
  const { account = null, chainId } = useWeb3React<Web3>();
  const [canUnstake, toggleCanUnstake] = useToggle(false);

  const { stakingConfig } = useStakingConfig();

  const currentStakingToken = stakingConfig[params.tokenId.toLowerCase()];

  const {
    stakingList,
    rewardSum,
    volume24,
    stakingAddresses
  } = useStakingListData(params.tokenId);

  const stakingItem = useMemo(() => stakingList?.[0], [stakingList]);

  const getBalance = useBalance(stakingItem?.chaindId);

  const getStakingContract = useStakingContracts(stakingItem?.chaindId);

  const stakingContract = useMemo(
    () =>
      stakingItem?.chaindId
        ? getStakingContract(stakingItem.contractName, stakingItem.chaindId)
        : null,
    [getStakingContract, stakingItem]
  );

  const unlock = useStakingUnlock(stakingContract);

  const unstake = useCanUnStaking(stakingContract);

  const stakingBalanceIsEmpty = useMemo(
    () => Boolean(stakingItem?.amount.isZero()),
    [stakingItem]
  );

  const [unstakeState, handleUnstake] = useAsyncFn(async () => {
    if (stakingBalanceIsEmpty) return;

    if (!unstake.value?.can && stakingItem?.lockable) {
      toggleCanUnstake(true);

      return;
    }
    toggleCanUnstake(false);

    await unlock();

    stakingAddresses.retry();
  }, [
    unlock,
    stakingAddresses.retry,
    stakingBalanceIsEmpty,
    unstake.value,
    toggleCanUnstake
  ]);

  const [claimState, handleClaim] = useAsyncFn(async () => {
    if (stakingBalanceIsEmpty) return;

    await unlock(false);

    stakingAddresses.retry();
  }, [unlock, stakingBalanceIsEmpty]);

  const balanceOfToken = useAsyncRetry(async () => {
    if (!stakingItem) return;

    const balanceOfTokenResult = await getBalance({
      tokenAddress: stakingItem.tokenAddress
    });

    const balance = balanceOfTokenResult.div(
      new BN(10).pow(stakingItem.decimals)
    );

    return balance.isNaN() ? new BN(0) : balance;
  }, [getBalance, stakingItem]);

  const { tokenName } = currentStakingToken ?? {};

  const poolShare = new BN(stakingItem?.amount ?? '0')
    .div(stakingItem?.totalSupplyFloat ?? '1')
    .multipliedBy(100);

  const loading = !stakingItem;

  const depositToken = useMemo(() => stakingItem?.token?.join('_'), [
    stakingItem
  ]);

  const showUnstakeButton =
    unstake.value?.unstakingStartBlock.eq(0) ||
    unstake.value?.currentBlockNumber.isGreaterThan(
      unstake.value?.unstakingStartBlock
    );

  return (
    <>
      <Head title={`Staking ${tokenName}`} />
      <MainLayout>
        <PageWrapper className={classes.staking}>
          <StakingHeader
            depositToken={depositToken}
            lockable={stakingItem?.lockable}
            tokenKey={params.tokenId}
            token={stakingItem?.token}
            APY={stakingItem?.apy}
            totalValueLocked={stakingItem?.totalValueLocked}
            className={classes.header}
            poolRate={stakingItem?.poolRate}
            volumeUSD={volume24}
            loading={loading}
          />
          <div className={classes.row}>
            <Plate className={classes.card}>
              <StakingLockForm
                account={account}
                token={stakingItem?.token}
                tokenName={tokenName}
                tokenKey={params.tokenId}
                tokenAddress={stakingItem?.tokenAddress}
                stakingContract={stakingContract}
                tokenDecimals={stakingItem?.decimals}
                unstakeStart={unstake.value?.date}
                unstakingStartBlock={unstake.value?.unstakingStartBlock}
                lockable={stakingItem?.lockable}
                onSubmit={stakingAddresses.retry}
                balanceOfToken={balanceOfToken.value ?? new BN(0)}
                loading={loading}
                depositToken={depositToken}
                chainId={stakingItem?.chaindId}
              />
            </Plate>
            <Plate className={clsx(classes.card, classes.cardFlex)}>
              <div className={classes.stakingBalance}>
                <div className={classes.unstakeAndClaim}>
                  <Typography
                    variant="body1"
                    align="center"
                    className={classes.cardTitle}
                  >
                    You staked{' '}
                    {loading ? (
                      '...'
                    ) : (
                      <>
                        {config.CHAIN_IDS.includes(
                          Number(
                            stakingItem?.chaindId ?? config.DEFAULT_CHAIN_ID
                          )
                        )
                          ? tokenName
                          : stakingItem?.token.join('_')}
                      </>
                    )}
                  </Typography>
                  <Typography variant="h2" align="center">
                    {stakingItem?.amount.isNaN() ||
                    !stakingItem?.amount.isFinite()
                      ? '0'
                      : stakingItem?.amount.toString(10)}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    className={classes.usd}
                  >
                    {loading ? (
                      '...'
                    ) : (
                      <>{humanizeNumeral(poolShare)}% Pool share</>
                    )}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    className={clsx(classes.usd, classes.marginBottom)}
                  >
                    {loading ? (
                      '...'
                    ) : (
                      <>${humanizeNumeral(stakingItem?.amountInUSDC)}</>
                    )}
                  </Typography>
                  {loading ? (
                    <Skeleton className={classes.attention} />
                  ) : (
                    <>
                      {!showUnstakeButton &&
                        account &&
                        stakingItem?.chaindId === chainId &&
                        unstake.value && (
                          <Typography
                            variant="body2"
                            align="center"
                            className={classes.attention}
                          >
                            Unstaking will start at{' '}
                            {unstake.value?.unstakingStartBlock.toString(10)}{' '}
                            block
                            <br />({unstake.value?.date})
                          </Typography>
                        )}
                      {stakingItem?.chaindId === chainId ? (
                        <>
                          {showUnstakeButton && account && (
                            <Tippy
                              visible={canUnstake}
                              key={String(canUnstake)}
                              content="Unstaking not started"
                              maxWidth={200}
                              offset={[0, 25]}
                              className={classes.tooltip}
                              animation={false}
                            >
                              <WalletButtonWithFallback
                                onClick={handleUnstake}
                                className={classes.unlock}
                                loading={unstakeState.loading}
                                disabled={unstakeState.loading}
                              >
                                Unstake
                              </WalletButtonWithFallback>
                            </Tippy>
                          )}
                        </>
                      ) : (
                        <StakingEmpty className={classes.empty} />
                      )}
                    </>
                  )}
                </div>
                <div className={classes.unstakeAndClaim}>
                  <Typography
                    variant="body1"
                    align="center"
                    className={classes.cardTitle}
                  >
                    You earned BAG
                  </Typography>
                  <Typography variant="h2" align="center">
                    {loading ? '...' : humanizeNumeral(rewardSum?.reward)}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    className={clsx(classes.usd, classes.marginBottom2)}
                  >
                    {loading ? (
                      '...'
                    ) : (
                      <>${humanizeNumeral(rewardSum?.rewardInUSDC)}</>
                    )}
                  </Typography>
                  {loading ? (
                    <Skeleton className={classes.attention} />
                  ) : (
                    <>
                      {account && stakingItem?.chaindId === chainId ? (
                        <WalletButtonWithFallback
                          onClick={handleClaim}
                          className={classes.unlock}
                          loading={claimState.loading}
                          disabled={claimState.loading}
                        >
                          Claim
                        </WalletButtonWithFallback>
                      ) : (
                        <StakingEmpty className={classes.empty} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </Plate>
          </div>
        </PageWrapper>
      </MainLayout>
    </>
  );
};
