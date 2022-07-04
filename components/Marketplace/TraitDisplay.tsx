
import styled from "@emotion/styled";
import Link from "next/link";
import { SoftLink } from "./marketplaceHelpers";
import { BURN_TRAITS, COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";

const TraitRow = styled.div`
  color: var(--lightGray);
  border-image: url("/static/img/trait_background.png");
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 15 20;

  background-color: var(--frameGray);

  margin: var(--sp-3);

  :hover {
    cursor: pointer;
  }

  transition: all 100ms;
`;

const TraitItem = styled.div`
  font-size: var(--sp1);
  font-family: Alagard;
  color: var(--white);
  
  margin-right: var(--sp-2);
`;

const TraitType = styled.div`
  display: flex;
  flex-direction: row;
  
  font-size: var(--sp-1);
  color: var(--beige);
  
  margin-bottom: var(--sp-4);
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

const TraitContent = styled.div`
  padding-left: var(--sp0);
  padding-right: var(--sp0);
`;

const TraitValues = styled.div`
  display: flex;
  flex-direction: row;
  
  align-items: center;
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
                    <TraitRow>
                      <TraitContent>
                        <TraitType>{attribute.key.toUpperCase()}</TraitType>
                        <TraitValues>
                          <TraitItem>{attribute.value}</TraitItem>
                          <TraitType>
                            {
                              traits[attribute.key] && contracts[contract].display != 'Flames' &&
                              `(${((traits[attribute.key][attribute.value] / maxCount) * 100)
                                .toPrecision(traits[attribute.key][attribute.value] == maxCount ? 3 : 2)}%)`
                            }
                          </TraitType>
                        </TraitValues>
                      </TraitContent>
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
