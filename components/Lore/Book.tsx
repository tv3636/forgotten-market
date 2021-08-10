import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Page from "./Page";
import { range } from "lodash";
import { InfiniteLoader, List } from "react-virtualized";

type Props = { wizardId: number; page: number };

const BookWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .flip-book {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
    display: none;
    background-size: cover;
  }
`;

export default function Book({ wizardId, page }: Props) {
  const onFlip = () => null;
  const flipBook = useRef<any>(null);

  const list = range(0, 1000);
  const hasNextPage = true;
  const isNextPageLoading = false;
  const loadNextPage = () => {};

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }: { index: number }) =>
    !hasNextPage || index < list.length;

  // Render a list item or a loading indicator.
  const rowRenderer = ({
    index,
    key,
    style
  }: {
    index: number;
    key: any;
    style: any;
  }) => {
    let content;

    if (!isRowLoaded({ index })) {
      content = "Loading...";
    } else {
      //   content = list.getIn([index, "name"]);
      content = "Loaded";
    }

    return (
      <Page key={key} wizardId={index} page={index} />
      //   <div key={key} style={style}>
      //     {content}
      //   </div>
    );
  };

  return <BookWrapper></BookWrapper>;
}
