import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import {
  MarkdownHeading,
  MarkdownLink,
  MarkdownImage,
  useScrollSpy,
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
  buildTableOfContents,
  DocsRendererParagraph,
  DocsRendererTableOfContents,
  DocsRendererTableOfContentsProps,
  DocsRendererTable
} from './common';
import { useDocsRendererStyles } from './docs-renderer.styles';

const HEADINGS = 'h2, h3';

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
  listItem: MarkdownListItem
};

export type DocsRendererProps = {
  children: string;
  header?: React.ReactNode;
};

export const DocsRenderer: React.FC<DocsRendererProps> = (props) => {
  const [tableOfContent, setTableOfContent] = useState<
    DocsRendererTableOfContentsProps['tableOfContent']
  >([]);

  const classes = useDocsRendererStyles();

  useEffect(() => {
    const headingElements = document.querySelectorAll(HEADINGS);

    headingElements.forEach((headingElement, index) => {
      headingElement.setAttribute('id', String(index));
    });

    setTableOfContent(buildTableOfContents([...headingElements]));
  }, [props.children]);

  const activeElement = useScrollSpy({
    activeSectionDefault: '0',
    sectionElements: HEADINGS,
    offsetPx: 10
  });

  return (
    <MainLayout>
      <div className={classes.root}>
        <DocsRendererTableOfContents
          className={classes.list}
          tableOfContent={tableOfContent}
          activeElement={activeElement}
        />
        <div className={classes.body}>
          {props.header}
          <ReactMarkdown plugins={[gfm]} renderers={renderers}>
            {props.children}
          </ReactMarkdown>
        </div>
      </div>
    </MainLayout>
  );
};
