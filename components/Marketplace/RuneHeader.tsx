import styled from "@emotion/styled";
import Image from 'next/image';
import { ReactNode } from "react";

const SectionHeader = styled.div`
display: flex;
justify-content: center;
text-align: center;
align-items: center;

> * {
  margin-left: var(--sp-1) !important;
  margin-right: var(--sp-1) !important;
}

margin-bottom: var(--sp-1);

color: var(--newGray);
`;

export default function RuneHeader({
  children
}:{
  children: ReactNode;
}) {
  return (
    <SectionHeader>
      <Image src="/static/img/floaters-left.png" height='14.5px' width='67px' />
        {children}
      <Image src="/static/img/floaters-right.png" height='14.5px' width='67px' />
    </SectionHeader>
  )
}
