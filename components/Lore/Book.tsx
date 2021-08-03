import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import HTMLFlipBook from "react-pageflip";
import Page from "./Page";
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

  return (
    <BookWrapper>
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onFlip}
        style={{}}
        flippingTime={300}
        startPage={0}
        // onChangeOrientation={this.onChangeOrientation}
        // onChangeState={this.onChangeState}
        className="book"
        ref={(el) => (flipBook.current = el)}
      >
        <Page />
        <Page />
        <Page />
        <Page />
        <Page />
        <Page />
      </HTMLFlipBook>
    </BookWrapper>
  );
}
