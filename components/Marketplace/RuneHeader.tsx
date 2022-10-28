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

  margin-bottom: var(--sp0);

  color: var(--newGray);
`;

export default function RuneHeader({
  plaintext,
  home,
  children
}:{
  plaintext: boolean;
  home: boolean;
  children: ReactNode;
}) {
  return (
    <SectionHeader style={plaintext ? {
        color: 'var(--lightGray)', 
        fontSize: 'var(--sp0)', 
        marginBottom: '0',
      } : home ? {
        marginBottom: 'var(--sp-2)'
      } : {}}>
      { !plaintext && <Image src="/static/img/floaters-left.png" height='14.5px' width='67px' /> }
        {children}
      { !plaintext && <Image src="/static/img/floaters-right.png" height='14.5px' width='67px' /> }
    </SectionHeader>
  )
}
