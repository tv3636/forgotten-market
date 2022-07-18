import styled from "@emotion/styled";
import { ORDER_TYPE } from "./marketplaceConstants"
import { getContract } from "./marketplaceHelpers";
import { Title, TokenImage } from "./Order"

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
        <Title style={{marginBottom: "40px", fontSize: "24px"}}>
          Submitting a { trait ? 'trait' : 'collection ' } offer for {trait ? `${trait}: ${traitValue}` : name}
        </Title>
      </HeaderContainer>
    )
  }

  return (
    <HeaderContainer>
      <Title style={{marginBottom: "40px", fontSize: "24px"}}>
          { action == ORDER_TYPE.OFFER ? 
            `Submitting an offer for ${name} (#${tokenId})` :
            `Listing ${name} (#${tokenId}) for sale`
          }
      </Title>
      <TokenImage src={imageUrl} height={'auto'} width={250} />
    </HeaderContainer>
  )
}
