import styled from "@emotion/styled";
import { ORDER_TYPE } from "./marketplaceConstants"
import { getContract } from "./marketplaceHelpers";

const BannerImage = styled.img`
  width: 100%;
  height: 20%;
  margin-bottom: 40px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ActionHeader({
  collectionWide,
  contract,
  action,
  name,
  tokenId,
  imageUrl,
  trait,
  traitValue,
}: {
  collectionWide: boolean;
  contract: string;
  action: ORDER_TYPE;
  name: string;
  tokenId: string;
  imageUrl: string;
  trait: string;
  traitValue: string;
}) {
  let contractDict = getContract(contract);

  if (collectionWide) {
    return (
      <HeaderContainer>
        <BannerImage src={`/static/img/marketplace/${contractDict.display.toLowerCase()}-banner.png`} />
      </HeaderContainer>
    )
  }

  return (
    <HeaderContainer>
    </HeaderContainer>
  )
}
