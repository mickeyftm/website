import clsx from 'clsx';
import React, { useRef } from 'react';
import { NavLink as ReactRouterNavLink } from 'react-router-dom';
import { useHoverDirty } from 'react-use';

import { ButtonBase, Link, useDevMode } from 'src/common';
import { URLS } from 'src/router/urls';
import { config } from 'src/config';
import { useLayoutMenuStyles } from './layout-menu.styles';
import { LayoutMenuDropdown } from './layout-menu-dropdown';
import { LayoutMenuPhasesDropdown } from './layout-menu-phases-dropdown';
import { SOCIAL_LINKS } from '../constants';

type MenuItem = {
  title: string;
  link: string;
  inDevMode?: boolean;
  children?: MenuItem[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: 'USDap',
    link: URLS.stablecoin
  },

  {
    title: 'Staking',
    link: URLS.staking.list
  },

  {
    title: 'Collateral',
    link: URLS.collateral.list
  },

  {
    title: 'Governance',
    link: URLS.voting.info
  },

  {
    title: 'Whitepaper',
    link: URLS.whitepaper
  },

  {
    title: 'Resources',
    link: '',
    children: [
      {
        title: 'Docs',
        link: URLS.docs.list
      },
      ...SOCIAL_LINKS
    ]
  },

  {
    title: 'Developers',
    link: '',
    inDevMode: true,

    children: [
      {
        title: 'Monitor',
        link: URLS.monitor
      },

      {
        title: 'VestingSplitter',
        link: URLS.vestingSplitter
      },

      {
        title: 'Vesting',
        link: URLS.vesting
      },
      {
        title: 'Profit splitter',
        link: URLS.profitSplitter
      }
    ]
  }
];

const LinkIfExternal: React.FC<MenuItem> = (props) => {
  const classes = useLayoutMenuStyles();
  const external = props.link.includes('http');

  return !external ? (
    <ReactRouterNavLink
      className={clsx(classes.navLink)}
      activeClassName={classes.activeNavLink}
      exact={props.link === URLS.main}
      to={props.link}
    >
      {props.title}
    </ReactRouterNavLink>
  ) : (
    <Link href={props.link} className={clsx(classes.navLink)} target="_blank">
      {props.title}
    </Link>
  );
};

export type LayoutMenuProps = {
  menuItems?: MenuItem[];
  className?: string;
};

export const LayoutMenu: React.FC<LayoutMenuProps> = ({
  menuItems = MENU_ITEMS,
  className,
  children
}) => {
  const classes = useLayoutMenuStyles();

  const [devMode] = useDevMode();

  const phasesRef = useRef<HTMLButtonElement | null>(null);

  const phasesHovered = useHoverDirty(phasesRef);

  return (
    <ul className={clsx(classes.root, classes.menu, className)}>
      <li className={clsx(classes.menuItem, classes.phase)}>
        <ButtonBase
          ref={phasesRef}
          className={clsx(classes.navLink, classes.phaseLink)}
        >
          Phase {config.IS_COLLATERAL ? '3' : '1'}
        </ButtonBase>
        {phasesHovered && <LayoutMenuPhasesDropdown />}
      </li>
      {menuItems.map((menuItem) => {
        if (menuItem.inDevMode && !devMode) return null;

        return (
          <li className={classes.menuItem} key={menuItem.title}>
            {menuItem.link ? (
              <LinkIfExternal {...menuItem} />
            ) : (
              <LayoutMenuDropdown menuItems={menuItem.children}>
                {menuItem.title}
              </LayoutMenuDropdown>
            )}
          </li>
        );
      })}
      <li className={clsx(classes.menuItem, classes.toggleTheme)}>
        {children}
      </li>
    </ul>
  );
};
