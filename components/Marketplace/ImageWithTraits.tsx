import styled from "@emotion/styled";
import { COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";
import { getValue } from "./marketplaceHelpers";

const ImageWrapper = styled.div`
  @media only screen and (max-width: 600px) {
    position: relative;
  }
`;

const TokenImage = styled.img`
  padding: var(--sp1);
  width: 400px;

  @media only screen and (max-width: 600px) {
    max-width: 250px;
  }

  transition: all 250ms;
`;

const TraitImage = styled(TokenImage)`
  position: absolute;
  top: 0;
  left: 0;

  opacity: 0;
`;

const NewFrame = styled.div`
--frameSize: 36px;
width: calc(100% + 0.85 * var(--frameSize));
height: calc(100% - 15px);

position: absolute;
left: calc(-0.425 * var(--frameSize));
top: calc(-0.1 * var(--frameSize));
z-index: 1;
border-image-source: url(/static/img/newframe_black.png);
border-image-slice: 35 50;
border-image-width: var(--frameSize);
border-image-outset: 0;
border-style: solid;
border-image-repeat: round;
image-rendering: pixelated;

@media only screen and (max-width: 600px) {
  width: 100%;
  height: 100%;
  left: 0;
}
`;

export default function ImageWithTraits({
  source,
  background,
  traitHover,
  contract,
  attributes,
  keyImage,
}:{
  source: string;
  background: string;
  traitHover: string;
  contract: string;
  attributes: any;
  keyImage: number;
}) {
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
  return (
    <ImageWrapper>
      <TokenImage 
        src={source} 
        style={{background: background, opacity: traitHover && keyImage == 0 ? 0.5 : 1}}
      />
      <NewFrame/>
      {contracts[contract].coreTraits?.map((trait: any, index: number) => {
          return (
            getValue(attributes, trait) != 'None' &&
            <TraitImage 
              src={`/static/img/traits/${contracts[contract].display.toLowerCase()}/${trait.toLowerCase()}/${getValue(attributes, trait)}.png`}
              style={{
                opacity: (traitHover == trait) ? 1 : (trait == 'Head' && traitHover == 'Body') ? .5 : 0,
                zIndex: trait == 'Body' ? 0 : 1,
                display: keyImage == 0 ? 'block' : 'none',
                top: contracts[contract].display == 'Warriors' ? '-0.5px' : '0',
                left: contracts[contract].display == 'Warriors' ? '-0.5px' : '0',
              }}
              key={index}
            />
          );
        })}
    </ImageWrapper>
  )
}