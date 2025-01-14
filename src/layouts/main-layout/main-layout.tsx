import { useToggle, useMedia } from 'react-use';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

import {
  LinkModal,
  ToggleThemeButton,
  useChangeNetworkModal,
  useNetworkConfig
} from 'src/common';
import { WalletButton, WalletModal } from 'src/wallets';
import { useStablecoinBuybackModal } from 'src/stablecoin/stablecoin-buyback-modal';
import {
  WalletProfile,
  WalletProfileDropdown
} from 'src/wallets/wallet-profile';
import { ContactsNews } from 'src/contacts/contacts-news';
import { VotingInvestingAttention } from 'src/voting/voting-investing-attention';
import { VotingInvestingForm } from 'src/voting/voting-investing-form';
import { config } from 'src/config';
import { useStablecoinHowItWorks } from 'src/stablecoin/common';
import {
  LayoutHeader,
  LayoutContainer,
  LayoutWrapper,
  LayoutFooter,
  LayoutSwap
} from '../common';
import { useMainLayoutStyles } from './main-layout.styles';

export const MainLayout: React.FC = (props) => {
  const classes = useMainLayoutStyles();

  const { chainId } = useWeb3React();

  const networkConfig = useNetworkConfig();

  const [open, toggle] = useToggle(false);

  const [linkModalOpen, togglelinkModal] = useToggle(false);
  const [investFormIsOpen, toggleInvestForm] = useToggle(false);
  const [attentionModalOpen, toggleAttentionModal] = useToggle(false);
  const [linksOpen, linksToggle] = useToggle(false);

  const [walletModalOpen, toggleWalletModal] = useToggle(false);

  const handleAttention = () => {
    togglelinkModal(false);
    toggleAttentionModal(true);
  };
  const handleBuyInvestment = () => {
    toggleAttentionModal(false);
    toggleInvestForm(true);
  };

  const isMobile = useMedia('(max-width: 1279px)');

  const [openBuyback] = useStablecoinBuybackModal();

  const [openChangeNetwork] = useChangeNetworkModal();

  const [openHowItWorks] = useStablecoinHowItWorks(openBuyback);

  const handleOpenBuyBack = () => {
    if (config.CHAIN_BINANCE_IDS.includes(Number(chainId))) {
      openChangeNetwork();
    } else {
      openHowItWorks();
    }
  };

  return (
    <>
      {config.BUY_BACK_ENABLE && <LayoutSwap onSwap={handleOpenBuyBack} />}
      <LayoutWrapper>
        <LayoutHeader
          rightButton={
            <>
              <ToggleThemeButton className={classes.toggleTheme} />
              <WalletProfile className={classes.profileButton} />
              <WalletButton />
            </>
          }
          mobileButton={<ToggleThemeButton />}
          profile={
            isMobile ? (
              <WalletProfileDropdown
                className={classes.profile}
                onBuy={
                  config.CHAIN_BINANCE_IDS.includes(Number(chainId))
                    ? linksToggle
                    : togglelinkModal
                }
                onConnect={toggleWalletModal}
              />
            ) : null
          }
        />
        <LayoutContainer>{props.children}</LayoutContainer>
        <LayoutFooter onSubscribe={toggle} />
      </LayoutWrapper>
      <ContactsNews open={open} onClose={toggle} />
      <LinkModal
        open={linkModalOpen}
        onClose={togglelinkModal}
        tokenName={networkConfig.assets.Governance?.symbol}
        tokenAddress={networkConfig.assets.Governance?.address}
        withBuyInvestment={config.IS_INVEST}
        onBuyInvestment={handleAttention}
      />
      <LinkModal
        open={linksOpen}
        onClose={linksToggle}
        tokenName={networkConfig.assets.Governance.symbol}
        tokenAddress={networkConfig.assets.Governance.address}
      />
      <VotingInvestingAttention
        open={attentionModalOpen}
        onClose={toggleAttentionModal}
        onBuy={handleBuyInvestment}
      />
      {investFormIsOpen && (
        <VotingInvestingForm
          open={investFormIsOpen}
          onClose={toggleInvestForm}
        />
      )}
      <WalletModal open={walletModalOpen} onClose={toggleWalletModal} />
    </>
  );
};
