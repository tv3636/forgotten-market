import * as React from "react";
import styled from "@emotion/styled";
import { space } from "styled-system";

type Props = { page: number; wizardId: number };

const PageWrapper = styled.div`
  padding: 20px;

  background-color: hsl(35, 55, 98);
  color: hsl(35, 35, 35);
  border: solid 1px hsl(35, 20, 70);

  overflow: hidden;

  background-color: green;

  .page-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;

    .page-header {
      height: 30px;
      font-size: 100%;
      text-transform: uppercase;
      text-align: center;
    }

    .page-image {
      height: 100%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .page-text {
      height: 100%;
      flex-grow: 1;
      font-size: 80%;
      text-align: justify;
      margin-top: 10px;
      padding-top: 10px;
      box-sizing: border-box;
      border-top: solid 1px hsl(35, 55, 90);
    }

    .page-footer {
      height: 30px;
      border-top: solid 1px hsl(35, 55, 90);
      font-size: 80%;
      color: hsl(35, 20, 50);
    }
  }

  &.--left {
    // for left page (property will be added automatically)
    border-right: 0;
    box-shadow: inset -7px 0 30px -7px rgba(0, 0, 0, 0.4);
  }

  &.--right {
    // for right page (property will be added automatically)
    border-left: 0;
    box-shadow: inset 7px 0 30px -7px rgba(0, 0, 0, 0.4);

    .page-footer {
      text-align: right;
    }
  }

  &.hard {
    // for hard page
    background-color: hsl(35, 50, 90);
    border: solid 1px hsl(35, 20, 50);
  }

  &.page-cover {
    background-color: hsl(35, 45, 80);
    color: hsl(35, 35, 35);
    border: solid 1px hsl(35, 20, 50);

    h2 {
      text-align: center;
      padding-top: 50%;
      font-size: 210%;
    }

    &.page-cover-top {
      box-shadow: inset 0px 0 30px 0px rgba(36, 10, 3, 0.5),
        -2px 0 5px 2px rgba(0, 0, 0, 0.4);
    }

    &.page-cover-bottom {
      box-shadow: inset 0px 0 30px 0px rgba(36, 10, 3, 0.5),
        10px 0 8px 0px rgba(0, 0, 0, 0.4);
    }
  }
`;

export const Spacer = styled.div(space);

export const PageHorizontalBreak = styled.div`
  width: 100%;
  height: 8px;
  background-image: url("/static/lore/book/page_border_horizontal.png");
  background-repeat: no-repeat;
  background-size: cover;
`;

const Page = React.forwardRef((props: Props, ref: any) => {
  const { wizardId, page } = props;
  return (
    <PageWrapper className="page" ref={ref}>
      <div className="page-content">
        <h2 className="page-header">Page header {wizardId}</h2>
        <div className="page-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus
          mollis nibh, non convallis ex convallis eu. Suspendisse potenti.
          Aenean vitae pellentesque erat. Integer non tristique quam.
          Suspendisse rutrum, augue ac sollicitudin mollis, eros velit viverra
        </div>
        <div className="page-footer">{wizardId}</div>
      </div>
    </PageWrapper>
  );
});

export default Page;
