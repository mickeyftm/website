import React from 'react';

import WhitepaperMd from 'src/assets/md/BondAppétit Whitepaper.md';
import WhitepaperPdf from 'src/assets/pdf/whitepaper.pdf';
import OnepagerPdf from 'src/assets/pdf/onepager.pdf';
import { Typography, Link } from 'src/common';
import { DocsRenderer } from '../docs-renderer';
import { useWhitepaperStyles } from './whitepaper.styles';

export const WhitePaper: React.FC = () => {
  const classes = useWhitepaperStyles();

  return (
    <DocsRenderer
      header={
        <div className={classes.header}>
          <Typography className={classes.title} variant="h1">
            BondAppétit Protocol
          </Typography>
          <Link
            href={WhitepaperPdf}
            className={classes.link}
            target="_blank"
            color="blue"
          >
            ↓ whitepaper.pdf
          </Link>
          <Link
            href={OnepagerPdf}
            className={classes.link}
            target="_blank"
            color="blue"
          >
            ↓ onepager.pdf
          </Link>
        </div>
      }
    >
      {WhitepaperMd}
    </DocsRenderer>
  );
};
