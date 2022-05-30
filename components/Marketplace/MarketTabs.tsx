import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { CONTRACTS } from "./marketplaceConstants";

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
  align-self: flex-start;

  @media only screen and (max-width: 600px) {
    margin-left: 0px;

    flex-wrap: wrap;
    justify-content: center;
  }

`;

const Tab  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--mediumGray);
  border-width: 3px;

  font-family: Alagard;
  font-size: 22px;
  color: var(--lightGray);

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  transition: border-color 300ms;

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`;

const TabSelected  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--lightGray);
  border-width: 1px;

  font-family: Alagard;
  font-size: 22px;
  color: var(--white);

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    font-size: 20px;
  }
`;

export default function MarketTabs() {
  var router = useRouter();
  return (
    <Tabs>
      {
      Object.keys(CONTRACTS).map((contract: string, index) => (
        <Link 
          href={`/${contract}${'activity' in router.query ? '?activity=True' : ''}`}
          key={index}
        >
        {contract == router.query.contractSlug ? 
          <TabSelected>{CONTRACTS[contract].display}</TabSelected> : 
          <Tab>{CONTRACTS[contract].display}</Tab>
        }
        </Link>
      ))}
    </Tabs>
  )
}
