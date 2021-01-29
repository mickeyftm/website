import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Tex from '@matejmazur/react-katex';
import math from 'remark-math';
import 'katex/dist/katex.min.css';

import {
  MarkdownHeading,
  MarkdownLink,
  MarkdownImage,
  MarkdownCode,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  MarkdownList,
  MarkdownListItem
} from 'src/common';
import { MainLayout } from 'src/layouts';
import {
  DocsRendererParagraph,
  DocsRendererTable,
  DocsRendererTableOfContents,
  TableOfContent
} from './common';
import { useDocsRendererStyles } from './docs-renderer.styles';

const renderers = {
  paragraph: DocsRendererParagraph,
  link: MarkdownLink,
  heading: MarkdownHeading,
  image: MarkdownImage,
  table: DocsRendererTable,
  tableHead: TableHead,
  tableBody: TableBody,
  tableRow: TableRow,
  tableCell: TableCell,
  code: MarkdownCode,
  list: MarkdownList,
  listItem: MarkdownListItem,
  inlineMath: ({ value }: { value: string }) => <Tex math={value} />,
  math: ({ value }: { value: string }) => <Tex block math={value} />
};

export type DocsRendererProps = {
  children: string;
  header?: React.ReactNode;
  tableOfContents?: TableOfContent[];
};

export const DocsRenderer: React.FC<DocsRendererProps> = (props) => {
  const classes = useDocsRendererStyles();

  return (
    <MainLayout>
      <div className={classes.root}>
        <DocsRendererTableOfContents
          className={classes.list}
          tableOfContents={props.tableOfContents}
        />
        <div className={classes.body}>
          {props.header}
          <ReactMarkdown plugins={[gfm, math]} renderers={renderers}>
            {props.children}
          </ReactMarkdown>
        </div>
      </div>
    </MainLayout>
  );
};
