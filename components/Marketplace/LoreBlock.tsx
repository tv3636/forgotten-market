import styled from "@emotion/styled";
import IndividualLorePage from "../Lore/IndividualLorePage";
import { CONTRACTS } from "./marketplaceConstants";
import LoadingCard from "./LoadingCard";
import { SoftLink } from "./marketplaceHelpers";

const LoreContainer = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;
  
  background: var(--darkGray);
  color: var(--lightGray);

  padding: 40px;
  width: 100%;

  font-family: Alagard;
  font-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
  }

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }

  transition: all 100ms;
`;

const PageWrapper = styled.div`
  margin-top: var(--sp5);

  @media only screen and (max-width: 600px) {
    margin-top: var(--sp1);
  }
`;

export default function LoreBlock({ 
  pages,
  length,
  tokenId,
  contract,
}: { 
  pages: any[];
  length: number;
  tokenId: string;
  contract: string;
}) {
  if (pages?.length > 0) {
    return (
      <LoreContainer style={pages && pages.length == 1 ? {background: pages[0].bgColor} : {}}>
        {pages.map((page: any, index: number) =>
          page.nsfw ? (
            <SoftLink 
              href={`https://forgottenlewds.com/lore/${CONTRACTS[contract].display.toLowerCase()}/${tokenId}/0`}
              target="_blank"
            >
              <div style={{display: 'flex', color: 'var(--lightGray)'}}>
                View NSFW Lore Entry
                <IconImage src="/static/img/marketplace/share.png"/>
              </div>
            </SoftLink>
          ) : (
            <PageWrapper key={index}>
              <IndividualLorePage bgColor={page.bgColor} story={page.story} />
            </PageWrapper>
          )
        )}
      </LoreContainer>
    );
  } else if (length > 0) {
    return (
      <LoreContainer>
        <LoadingCard height={'40vh'} background={false}/>
      </LoreContainer>
    )
  } else {
    return <LoreContainer>No Lore has been recorded...</LoreContainer>
  }
}
