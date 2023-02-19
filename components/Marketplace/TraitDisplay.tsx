
import styled from "@emotion/styled";
import { getContract } from "./marketplaceHelpers";
import TraitLink from "./TraitLink";

const TraitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  z-index: 1;

  gap: var(--sp0);
  margin-top: var(--sp-3);

  @media only screen and (max-width: 600px) {
    justify-content: center;
    padding: 20px;

    gap: 0;
    > *:not(:last-child) {
      margin-bottom: var(--sp-2);
    }
  }
`;

const TraitContainer = styled.div`
  position: relative;
  width: 48%;

  @media only screen and (max-width: 600px) {
    width: auto;
  }
`;

const TraitRow = styled.div`
  color: var(--lightGray);
  margin-bottom: var(--sp-4);
  width: 100%;
  position: relative;

  z-index: 1;

  background-color: var(--frameGray);
  border-image: url("/static/img/trait_background.png");
  border-style: solid;
  border-width: var(--sp-1);
  border-image-slice: 15 20;

  box-shadow: 3px 4px 0 var(--mediumGray);

  padding-left: var(--sp-1);
  padding-right: var(--sp-1);

  :hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    width: 35ch;
  }

  transition: all 100ms;
`;

const TraitItem = styled.div`
  font-size: var(--sp1);
  font-family: Alagard;
  color: var(--white);
  text-shadow: 0px 2.5px var(--darkGray);

  margin-right: var(--sp-1);

  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :hover {
    color: white;
  }
  
  transition: all 100ms;
`;

const TraitType = styled.div`
  display: flex;
  flex-direction: row;
  
  font-size: var(--sp-1);
  color: var(--beige);
  
  margin-bottom: var(--sp-4);
`;

const TraitValues = styled.div`
  display: flex;
  flex-direction: row;
  
  align-items: flex-end;
  justify-content: space-between;
`;

const GrainFill = styled.div`
  position: absolute;
  opacity: 8%;

  width: 100%;
  height: calc(100% + (2 * var(--sp-1)));
  top: calc(0px - var(--sp-1));
  left: 0;

  background-image: url(/static/img/marketplace/paperTxt03.png);
  background-repeat: repeat;
`;

function Grain({
  tokenId,
}: {
  tokenId: number,
}) {
  return (
    <GrainFill style={{
      backgroundImage: `url(/static/img/marketplace/paperTxt0${(Number(tokenId) % 4) + 1}.png)`,
      backgroundPosition: `${(Number(tokenId) % 100)}% ${(Number(tokenId) % 100)}%`,
    }}/>
  )
}

export default function TraitDisplay({ 
  attributes,
  fullAttributes,
  contract,
  setHover,
  filters,
  showAll,
}: { 
  attributes: {key: string, value: string}[];
  fullAttributes: any;
  contract: string;
  setHover: (hover: string) => void;
  filters: string[];
  showAll: boolean;
}) {
  var traitCounts: any = {};
  var traits: any = {};
  var maxCount = 0;
  let contractDict = getContract(contract);

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
    let newAttributes: any = [];

    if (filters) {
      for (var filter of filters) {
        for (var attribute of attributes) {
          if (attribute.key == filter) {
            newAttributes.push(attribute);
          }
        }
      }
    }

    if (newAttributes.length == 0) {
      newAttributes = attributes;
    }

    return (
      <TraitWrapper style={
        showAll ? 
          {} : {justifyContent: 'center'}
        }>
        {newAttributes.map((attribute: any, index: number) => {
          return (
            <TraitContainer 
              key={index} 
              style={showAll ? {} : {width: 'auto'}}
            >
              <TraitLink trait={attribute.key} value={attribute.value}>
                <TraitRow
                  onMouseOver={
                    () => setHover(
                      contractDict.coreTraits?.includes(attribute.key) 
                        && !['Background', 'Undesirable'].includes(attribute.key) 
                        && attribute.value != 'None' 
                          ? attribute.key : ''
                    )
                  }
                  onMouseOut={() => setHover('')}
                  style={showAll ? {} : {width: '34ch'}}
                >
                    <Grain 
                      tokenId={traits[attribute.key] 
                        ? traits[attribute.key][attribute.value]
                        : Math.random() * 100 + 1} 
                    />
                    <TraitType>{attribute.key.toUpperCase()}</TraitType>
                    <TraitValues>
                      <TraitItem title={attribute.value}>{attribute.value}</TraitItem>
                      <TraitType style={{fontSize: 'calc(var(--sp-1) * 1.25)'}}>
                        {
                          traits[attribute.key] && contractDict.display != 'Flames' &&
                          `(${((traits[attribute.key][attribute.value] / maxCount) * 100)
                            .toPrecision(traits[attribute.key][attribute.value] == maxCount ? 3 : 2)}%)`
                        }
                      </TraitType>
                    </TraitValues>
                </TraitRow>
              </TraitLink>
            </TraitContainer>
          )
        })}
      </TraitWrapper>
    );
  }
}
