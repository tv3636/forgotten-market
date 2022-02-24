import styled from "@emotion/styled";
import Link from "next/link";

const PriceValue = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

const OfferWrapper = styled.div`
  text-align: left;
  font-size: 14px;
  font-family: Roboto Mono;
  color: var(--lightGray);
  display: flex;
  margin-top: 1vh;
  
  
  @media only screen and (max-width: 600px) {
    justify-content: center;
    font-size: 13px;
    margin-top: 0;
  }
`;

export function Owner({
  owner,
  connectedAccount,
  ens,
}: {
  owner: string;
  connectedAccount: string | null | undefined;
  ens: string | null;
}) {
  return (
    <Link href={`/address/${owner}`}>
      {owner?.toLowerCase() == connectedAccount?.toLowerCase()
        ? "you" 
        : ens ? ens : owner.substring(0, 10)}
    </Link>
  );
}

export default function OfferDisplay({
  value,
  maker,
  account,
  ens
}:{
  value: string,
  maker: string,
  account: string,
  ens: string
}) {
  return (
    <OfferWrapper>{'Best Offer:  '}
      <PriceValue>
        <img
          src="/static/img/marketplace/eth_alt.png"
          style={{ height: "15px", marginRight: "5px", marginLeft: "7px", marginTop: "1px" }}
        />
        {`${value} from`}&nbsp;
        <Owner owner={maker} connectedAccount={account} ens={ens}/>
      </PriceValue>
    </OfferWrapper>
  )
}
