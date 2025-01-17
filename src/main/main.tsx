import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';
import React from 'react';
import { useToggle } from 'react-use';

import {
  BN,
  Head,
  humanizeNumeral,
  LinkModal,
  PageWrapper,
  Typography,
  useChangeNetworkModal,
  useNetworkConfig
} from 'src/common';
import { ReactComponent as MixBytesLogo } from 'src/assets/icons/mix-bytes.svg';
import { ReactComponent as HashExLogo } from 'src/assets/icons/hashex.svg';
import { MainLayout } from 'src/layouts';
import {
  useStableCoinBalance,
  StablecoinModals,
  useStablecoinModals,
  useStablecoinBuybackModal,
  useStablecoinHowItWorks
} from 'src/stablecoin';
import { StakingSwopFi, useStakingListData } from 'src/staking';
import { ContactsBecomePartner } from 'src/contacts/contacts-become-partner';
import { config } from 'src/config';
import {
  MainStaking,
  MainStablecoin,
  MainCollateral,
  MainVoting,
  MainSteps,
  MainEditor,
  MainAudit,
  MainMediumArticles,
  MainWaves,
  MainTeam,
  MainHeader
} from './common';
import { useMainStyles } from './main.styles';
import { useMediumArticles } from './common/use-medium-articles';
import { MainCointelegraph } from './common/main-cointelegraph';

export const Main: React.FC = () => {
  const classes = useMainStyles();

  const { chainId } = useWeb3React();

  const {
    totalValueLocked,
    stakingList,
    governanceInUSDC,
    swopfiItem,
    swopfiLoading
  } = useStakingListData();

  const stablecoinBalance = useStableCoinBalance();

  const {
    linkModalOpen,
    togglelinkModal,
    sellModalOpen,
    toggleSellModal,
    handleBuyMarket,
    marketModalOpen,
    toggleMarketModal
  } = useStablecoinModals();

  const mediumArticles = useMediumArticles();

  const [becomeAPartnerIsOpen, toggleBecomeAPartner] = useToggle(false);

  const [linksOpen, linksToggle] = useToggle(false);

  const networkConfig = useNetworkConfig();

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
      <Head
        title="The first DeFi protocol that connects real-world debt instruments with the Ethereum ecosystem."
        ogUrl="https://bondappetit.io"
      />
      <MainLayout>
        <PageWrapper className={classes.root}>
          <MainHeader
            onBuyGov={linksToggle}
            totalValueLocked={humanizeNumeral(totalValueLocked)}
            stablecoinBalance={humanizeNumeral(stablecoinBalance.value)}
            govCost={humanizeNumeral(governanceInUSDC)}
          />
          <MainStaking
            countOfCards={4}
            className={classes.section}
            staking={stakingList?.slice(0, 4)}
          >
            <StakingSwopFi
              tvl={swopfiItem?.totalLiquidityUSD}
              apy={new BN(swopfiItem?.apr.year ?? '0')
                .multipliedBy(100)
                .toString(10)}
              loading={swopfiLoading}
            />
          </MainStaking>
          <MainStablecoin
            className={classes.section}
            stablecoinBalance={humanizeNumeral(stablecoinBalance.value)}
            onBuy={togglelinkModal}
            onSell={toggleSellModal}
            onSwap={handleOpenBuyBack}
          >
            <MainCollateral />
          </MainStablecoin>
          <MainEditor className={clsx(classes.section)}>
            <MainAudit
              mixBytesLink="https://github.com/mixbytes/audits_public/tree/4fc7d333e3df57586e0f96cc551819e2c93f3ae9/BondAppetit"
              hashExLink="https://github.com/HashEx/public_audits/blob/32a680c5b8f3a784ef3273c324e0841341f3abc2/BondAppétit/BondAppetit%20report.pdf"
              mixBytesLogo={<MixBytesLogo />}
              hashExLogo={<HashExLogo />}
            />
          </MainEditor>
          <MainVoting className={classes.section} />
          <MainSteps className={classes.section} />
          <MainWaves
            className={classes.section}
            onBecomePartner={toggleBecomeAPartner}
          />
          <MainTeam className={classes.section} />
          <div>
            <Typography variant="h2" className={classes.newsTitle}>
              Learn more about BondAppétit
            </Typography>
            <div className={classes.articles}>
              <MainMediumArticles
                loading={mediumArticles.loading}
                articles={mediumArticles.value}
              />
              <MainCointelegraph />
            </div>
          </div>
        </PageWrapper>
      </MainLayout>
      <ContactsBecomePartner
        open={becomeAPartnerIsOpen}
        onClose={toggleBecomeAPartner}
      />
      <StablecoinModals
        marketModalOpen={marketModalOpen}
        toggleMarketModal={toggleMarketModal}
        linkModalOpen={linkModalOpen}
        togglelinkModal={togglelinkModal}
        sellModalOpen={sellModalOpen}
        toggleSellModal={toggleSellModal}
        onBuyMarket={handleBuyMarket}
      />
      <LinkModal
        open={linksOpen}
        onClose={linksToggle}
        tokenName={networkConfig.assets.Governance.symbol}
        tokenAddress={networkConfig.assets.Governance.address}
      />
    </>
  );
};
