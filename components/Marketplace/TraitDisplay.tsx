
import styled from "@emotion/styled";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import { BURN_TRAITS, CONTRACTS } from "./marketplaceConstants";

const TraitItem = styled.div`
  text-align: start;
  margin-left: 1vw;
  margin-right: 1vw;
  font-size: 24px;
  font-family: Alagard;
`;

const TraitRow = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
  
  font-family: Roboto Mono;
  background: var(--darkGray);
  color: var(--lightGray);
  border: 2px dashed var(--mediumGray);
  border-radius: 4px;

  margin: var(--sp-4);
  padding: var(--sp1) var(--sp0);

  :hover {
    cursor: pointer;
    background: var(--mediumGray);
    border-color: var(--lightGray);
  }

  transition: all 100ms;
`;

const TraitType = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
`;

const TraitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    padding: 20px;
  }
`;

export default function TraitDisplay({ 
  attributes,
  contract,
  tokenId,
}: { 
  attributes: [];
  contract: string;
  tokenId: string;
}) {
  if (attributes.length == 0) {
    return null
  } else {
    return (
      <div style={{ textAlign: 'center' }}>
          <TraitWrapper>
            {attributes.map((attribute: any, index: number) => (
              <div key={index}>
                <Link 
                  href={ BURN_TRAITS.includes(attribute.key) ? 
                    `/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/${tokenId}`
                    : `/${contract}?${attribute.key.toLowerCase().replace('#', '%23')}=${attribute.value.replaceAll(' ', '+')}`
                  } 
                  passHref={true}
                >
                  <SoftLink>
                    <TraitRow
                      style={{height: CONTRACTS[contract].display == 'Flames' ? 'auto' : '50px'}}
                    >
                      <TraitType>{attribute.key}</TraitType>
                      <TraitItem>{attribute.value}</TraitItem>
                    </TraitRow>
                  </SoftLink>
                </Link>
              </div>
            ))}
          </TraitWrapper>
      </div>
    );
  }
}
