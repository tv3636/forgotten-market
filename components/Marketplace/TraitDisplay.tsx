
import styled from "@emotion/styled";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import { BURN_TRAITS, COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";

const TraitItem = styled.div`
  text-align: start;
  margin-left: 14px;
  margin-right: 10px;
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
  justify-content: center;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    padding: 20px;
  }
`;

export default function TraitDisplay({ 
  attributes,
  fullAttributes,
  contract,
  tokenId,
}: { 
  attributes: [];
  fullAttributes: any;
  contract: string;
  tokenId: string;
}) {
  var traitCounts: any = {};
  var traits: any = {};
  var maxCount = 0;
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;

  for (var trait of fullAttributes) {
    var totalCount = 0;
    traits[trait.key] = {};
    
    for (var value of trait.values) {
      totalCount += value.count;
      traits[trait.key][value.value] = value.count;
    }

    traitCounts[trait.key] = totalCount;
    maxCount = Math.max(maxCount, totalCount);
  }

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
                      style={{height: contracts[contract].display == 'Flames' ? 'auto' : '50px'}}
                    >
                      <TraitType>{attribute.key}</TraitType>
                      <TraitItem>{attribute.value}</TraitItem>
                      <TraitType style={{marginRight: '0'}}>
                        {
                          traits[attribute.key] && contracts[contract].display != 'Flames' &&
                          `(${((traits[attribute.key][attribute.value] / maxCount) * 100)
                            .toPrecision(traits[attribute.key][attribute.value] == maxCount ? 3 : 2)}%)`
                        }
                      </TraitType>
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
