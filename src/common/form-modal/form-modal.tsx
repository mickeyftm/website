import { useFormikContext } from 'formik';
import React, { useMemo, useCallback, useRef } from 'react';
import { useToggle, useHover, useUpdateEffect } from 'react-use';
import { useWeb3React } from '@web3-react/core';
import Tippy from '@tippyjs/react';

import { ReactComponent as HelpIcon } from 'src/assets/icons/help.svg';
import { ButtonBase } from '../button-base';
import { Typography } from '../typography';
import { Button } from '../button';
import { Input } from '../input';
import { SmallModal } from '../small-modal';
import { Modal } from '../modal';
import { FormModalSelect } from './form-modal-select';
import { Asset } from '../types';
import { useFormModalStyles } from './form-modal.styles';
import { BN, humanizeNumeral } from '../bignumber';

export type FormModalValues = {
  currency: string;
  payment: string;
  youGet: string;
};

export type FormModalProps = {
  open: boolean;
  onClose: () => void;
  tokenName: string;
  tokens: Asset[];
  balance: string;
  tokenCost: string;
  withReward?: boolean;
  reward?: {
    product: BN;
    rewardGov: BN;
    rewardPercent: BN;
  };
  onOpenWallet: () => void;
  onPaymentChange?: () => void;
  onYouGetChange?: () => void;
};

export const FormModal: React.FC<FormModalProps> = (props) => {
  const classes = useFormModalStyles();

  const { account } = useWeb3React();

  const [select, toggleSelect] = useToggle(false);

  const formik = useFormikContext<FormModalValues>();

  const currentToken = useMemo(() => {
    return props.tokens.find(({ symbol }) => symbol === formik.values.currency);
  }, [formik.values.currency, props.tokens]);

  const handleOpenWalletList = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      props.onOpenWallet();
    },
    [props]
  );

  const youGetRef = useRef(false);
  const paymentRef = useRef(false);

  useUpdateEffect(() => {
    if (props.tokenCost === '0' || paymentRef.current || select) return;

    props.onPaymentChange?.();
  }, [formik.values.payment, props.tokenCost, props.onPaymentChange]);

  useUpdateEffect(() => {
    if (props.tokenCost === '0' || youGetRef.current || select) return;

    props.onYouGetChange?.();
  }, [formik.values.youGet, props.tokenCost, props.onYouGetChange]);

  const help = useCallback(
    (isHovering: boolean) => (
      <span>
        <Tippy
          visible={isHovering}
          content={`The given price is not exact, as the final price will be calculated based on the current ${props.tokenName} conversion rate on exchange`}
          maxWidth={280}
          offset={[140, 8]}
          animation={false}
          className={classes.tippy}
        >
          <ButtonBase className={classes.hintButton}>
            <HelpIcon />
          </ButtonBase>
        </Tippy>
      </span>
    ),
    [classes.tippy, classes.hintButton, props.tokenName]
  );

  const [helpHoverable] = useHover(help);

  const reward = useCallback(
    (isHovering: boolean) => (
      <span>
        <Tippy
          visible={isHovering}
          content={
            <>
              <Typography variant="body2">
                Buying USDP during sale you will get extra{' '}
                {props.reward?.rewardPercent.toFormat(1) || '0'}% of you
                investment in BAG as a reward.
              </Typography>
              <br />
              <Typography variant="body2">
                Current price: 1 BAG = ${humanizeNumeral(props.tokenCost)}
              </Typography>
            </>
          }
          animation={false}
          maxWidth={280}
          offset={[140, 8]}
          className={classes.tippy}
        >
          <Typography variant="body2" align="center" className={classes.reward}>
            + {humanizeNumeral(props.reward?.rewardGov)} BAG reward
          </Typography>
        </Tippy>
      </span>
    ),
    [classes.tippy, classes.reward, props.reward, props.tokenCost]
  );

  const [rewardHoverable] = useHover(reward);

  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        onBack={select ? toggleSelect : undefined}
      >
        <SmallModal>
          {select && (
            <FormModalSelect
              value={formik.values.currency}
              options={props.tokens}
              onChange={(value: string) => {
                formik.resetForm();
                formik.setFieldValue('currency', value);
                toggleSelect();
              }}
            />
          )}
          {!select && (
            <form
              onSubmit={!account ? handleOpenWalletList : formik.handleSubmit}
              className={classes.root}
            >
              <div className={classes.inputs}>
                <div className={classes.row}>
                  <Input
                    name="payment"
                    label="You spent"
                    placeholder="0.0"
                    type="number"
                    disabled={formik.isSubmitting}
                    value={formik.values.payment}
                    className={classes.input}
                    onChange={formik.handleChange}
                    onFocus={() => {
                      youGetRef.current = true;
                    }}
                    onBlur={() => {
                      youGetRef.current = false;
                    }}
                  />
                  <div className={classes.input}>
                    <Typography variant="body1" component="div">
                      Balance:{' '}
                      <ButtonBase
                        type="button"
                        className={classes.balanceButton}
                        onClick={
                          currentToken?.balance
                            ? () =>
                                formik.setFieldValue(
                                  'payment',
                                  currentToken?.balance
                                )
                            : undefined
                        }
                      >
                        {humanizeNumeral(currentToken?.balance ?? '0')}
                      </ButtonBase>
                    </Typography>
                    <ButtonBase
                      type="button"
                      disabled={formik.isSubmitting}
                      className={classes.selectButton}
                      onClick={toggleSelect}
                    >
                      {formik.values.currency}↓
                    </ButtonBase>
                  </div>
                </div>
                <div className={classes.row}>
                  <div className={classes.input}>
                    <Input
                      name="youGet"
                      label="You will get"
                      placeholder="0.0"
                      type="number"
                      disabled={formik.isSubmitting}
                      value={formik.values.youGet}
                      className={classes.input}
                      onChange={formik.handleChange}
                      onFocus={() => {
                        paymentRef.current = true;
                      }}
                      onBlur={() => {
                        paymentRef.current = false;
                      }}
                    />
                  </div>
                  {props.withReward && rewardHoverable}
                  <div className={classes.input}>
                    <Typography variant="body1" component="div">
                      Balance: {humanizeNumeral(props.balance)}
                    </Typography>
                    <Typography variant="inherit" component="div">
                      {props.tokenName}
                    </Typography>
                  </div>
                </div>
              </div>
              {currentToken?.symbol !== 'USDC' && (
                <Typography
                  variant="body1"
                  align="center"
                  className={classes.hint}
                >
                  {humanizeNumeral(props.tokenCost)} {formik.values.currency}{' '}
                  per {props.tokenName}, estimated price
                  {helpHoverable}
                </Typography>
              )}
              <Button
                type="submit"
                disabled={
                  Boolean(formik.errors.payment || formik.errors.currency) ||
                  formik.isSubmitting
                }
                loading={formik.isSubmitting}
              >
                {!account
                  ? 'Connect Wallet'
                  : formik.errors.payment || formik.errors.currency || 'Buy'}
              </Button>
            </form>
          )}
        </SmallModal>
      </Modal>
    </>
  );
};
