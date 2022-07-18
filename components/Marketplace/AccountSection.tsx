import Link from "next/link";
import styled from "@emotion/styled";
import { getContract, SoftLink } from "./marketplaceHelpers";

const Title = styled.div`
  font-size: var(--sp1);
  font-family: Alagard;
  color: var(--white);

  margin-top: var(--sp-3);

  @media only screen and (max-width: 600px) {
    font-size: 18px;
    max-width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const HorizontalLine = styled.hr`
  border-color: black;
  border-style: dashed;
  width: 50vw;
  margin-left: 0;
  border-width: 1px;
  margin-top: var(--sp-1);
  margin-bottom: 1px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin-top: var(--sp-1);
  }
`;

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  :hover {
    border: 1px dashed var(--mediumGray);
  }

  transition: all 100ms;

  @media only screen and (max-width: 600px) {
    border: 2px dashed var(--darkGray);
    max-width: 300px;
    max-height: 300px;
  }
`;

const DisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const TokenListing = styled.div`
  display: flex;
  font-family: Roboto Mono;
  color: var(--white);
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const CollectionEthSymbol = styled.img`
  height: 11px;
  margin-right: 5px;
  margin-top: 3px;
`;


export default function AccountSection({
  tokens,
  title,
  contract
}: {
  tokens: any;
  title: string;
  contract: string | null;
}) {

  // Only show cheapest listings
  var shown: any = {};
  var newTokens = [];
  if (!contract) {
    for (var token of tokens) {
      if (!(token.tokenSetId in shown)) {
        newTokens.push(token);
      }
      
      shown[token.tokenSetId] = 1;
    }

    tokens = newTokens;
  }

  return (
    <DisplayContainer>
      <Title>{title}</Title>
      <HorizontalLine />
      <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {tokens.map((token: any, index: number) => {
          var thisContract = contract ? contract : token.contract;
          var thisTokenId = contract ? token.token.tokenId : token.tokenSetId.split(':')[2];
          let contractDict = getContract(thisContract);
          return (
            <div key={index}>
              <Link 
                href={`/${thisContract}/${thisTokenId}`} 
                passHref={true}
              >
                <SoftLink>
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <TokenImage 
                      src={ contractDict.display == 'Wizards' ? 
                        `${contractDict.image_url}${thisTokenId}/${thisTokenId}.png` :
                        `${contractDict.image_url}${thisTokenId}.png`
                      }
                      height={100} 
                      width={100} 
                    />
                    { !contract && 
                      <TokenListing>
                        <CollectionEthSymbol src="/static/img/marketplace/eth.png"/>
                        {token.price}
                      </TokenListing>
                    }
                  </div>
                </SoftLink>
              </Link>
            </div>
          );
        })}
      </div>
      <HorizontalLine />
    </DisplayContainer>
  )
}
