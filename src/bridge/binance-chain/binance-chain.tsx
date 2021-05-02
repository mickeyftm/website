import { useWeb3React } from '@web3-react/core';
import { FormikProvider, useFormik } from 'formik';
import React from 'react';
import { useAsyncRetry, useDebounce } from 'react-use';

import {
  BN,
  Typography,
  useApprove,
  reset,
  approveAll,
  useBalance,
  useIntervalIfHasAccount
} from 'src/common';
import {
  BurgerSwapBridgeTransitTypeEnum,
  useAddBurgerSwapBridgeTransitMutation
} from 'src/graphql/_generated-hooks';
import {
  BridgeForm,
  useTransitContract,
  useBBagContract,
  burgerSwapApi,
  BurgerSwapPayback
} from '../common';

const GAS = 120000;

export type BinanceChainProps = {
  onBscPayback?: (transactionHash: string) => void;
  bscPayback?: null | string;
  onConfirm?: (payback: BurgerSwapPayback) => void;
};

const payback: BurgerSwapPayback = {
  id: 0,
  payback_id: '',
  status: 3,
  createBlock: 0,
  amount: '',
  from: '',
  token: 'bBAG',
  sign: '',
  withdrawBlock: 0,
  version: 0,
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString()
};

export const BinanceChain: React.VFC<BinanceChainProps> = (props) => {
  const { account, chainId } = useWeb3React();

  const transitContract = useTransitContract();
  const bbagContract = useBBagContract();

  const [addBurgerSwapTransit] = useAddBurgerSwapBridgeTransitMutation();

  const getBalance = useBalance();

  const [approve, approvalNeeded] = useApprove();

  const decimals = useAsyncRetry(bbagContract.methods.decimals().call, [
    bbagContract
  ]);

  const formik = useFormik({
    initialValues: {
      amount: ''
    },

    validate: async (formValues) => {
      const errors: Partial<typeof formValues> = {};

      if (!formValues.amount) {
        errors.amount = 'bBAG is required';
      }

      const balanceOfGovToken = await getBalance({
        tokenAddress: bbagContract.options.address
      });

      if (
        decimals.value &&
        balanceOfGovToken
          .div(new BN(10).pow(decimals.value))
          .isLessThan(formValues.amount)
      ) {
        errors.amount = 'Not enough bBAG';
      }

      return errors;
    },

    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (formValues, { resetForm }) => {
      if (!decimals.value) return;

      const amount = new BN(formValues.amount)
        .multipliedBy(new BN(10).pow(decimals.value))
        .toString(10);

      if (!account) return;

      const options = {
        token: bbagContract,
        owner: account,
        spender: bbagContract.options.address,
        amount
      };

      const approved = await approvalNeeded(options);

      if (approved.reset) {
        await reset(options);
      }
      if (approved.approve) {
        await approveAll(options);
        await approvalNeeded(options);
        return;
      }

      const paybackTransit = transitContract.methods.paybackTransit(
        bbagContract.options.address,
        amount
      );

      const newPayback = {
        ...payback
      };

      await paybackTransit
        .send({
          from: account,
          gas: GAS,
          value: `5${'0'.repeat(16)}`
        })
        .on('transactionHash', async (transactionHash) => {
          props.onBscPayback?.(transactionHash);

          await addBurgerSwapTransit({
            variables: {
              input: {
                tx: transactionHash,
                owner: account,
                type: BurgerSwapBridgeTransitTypeEnum.BscWithdraw
              }
            }
          });
        })
        .on('confirmation', (_, receipt) => {
          newPayback.id = receipt.transactionIndex;
          newPayback.payback_id = receipt.transactionHash;
          newPayback.amount = amount;

          props.onConfirm?.(newPayback);
        })
        .on('receipt', async () => {
          if (props.bscPayback) {
            await burgerSwapApi.bscPayback(props.bscPayback);
          }

          resetForm();

          return Promise.resolve();
        })
        .on('error', (error) => {
          console.error(error.message);

          return Promise.reject(error.message);
        });
    }
  });

  const balance = useAsyncRetry(async () => {
    if (!decimals.value) return;

    const bbagBalance = await getBalance({
      tokenAddress: bbagContract.options.address
    });

    return bbagBalance.div(new BN(10).pow(decimals.value));
  }, [bbagContract, decimals.value, chainId]);

  useIntervalIfHasAccount(balance.retry);

  useDebounce(
    async () => {
      if (!decimals.value || !account) return;

      const amount = new BN(formik.values.amount)
        .multipliedBy(new BN(10).pow(decimals.value))
        .toString(10);

      const options = {
        token: bbagContract,
        owner: account,
        spender: bbagContract.options.address,
        amount
      };

      await approvalNeeded(options);
    },
    200,
    [approvalNeeded, account, formik.values.amount]
  );

  return (
    <div>
      <Typography variant="body1" align="center">
        Move your bBAG to Etherium
      </Typography>
      <FormikProvider value={formik}>
        <BridgeForm
          balance={balance.value}
          approve={approve.value?.approve}
          reset={approve.value?.reset}
        />
      </FormikProvider>
    </div>
  );
};