import styled from "@emotion/styled";
import IndividualLorePage from "../Lore/IndividualLorePage";
import { LoadingCard } from "./marketplaceHelpers";

const LoreContainer = styled.div`
  border: 2px dashed var(--mediumGray);
  border-radius: 4px;
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

export default function LoreBlock({ 
  pages,
  length 
}: { 
  pages: [];
  length: number;
}) {
  if (pages?.length > 0) {
    return (
      <LoreContainer>
        {pages.map((page: any, index: number) =>
          page.nsfw ? (
            <div>NSFW Lore Entry not shown</div>
          ) : (
            <div key={index} style={{ marginTop: '6vh' }}>
              <IndividualLorePage bgColor={page.bgColor} story={page.story} />
            </div>
          )
        )}
      </LoreContainer>
    );
  } else if (length > 0) {
    return (
      <LoreContainer>
        <LoadingCard height={'auto'}/>
      </LoreContainer>
    )
  } else {
    return <LoreContainer>No Lore has been recorded...</LoreContainer>
  }
}
