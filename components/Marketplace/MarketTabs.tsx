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
  flex-wrap: wrap;

  @media only screen and (max-width: 600px) {
    margin-left: 0px;
    justify-content: center;
  }

`;

const Tab  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--mediumGray);
  border-width: 3px;

  font-family: Bitdaylong;
  font-size: 22px;
  color: var(--lightGray);

  font-smooth:  never;
  -webkit-font-smoothing: none;

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;

  display: flex;
  align-items: center;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;

    .icon {
      display: inline-block;
    }
  }

  transition: border-color 300ms;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const TabSelected  = styled.div`
  background: var(--darkGray);
  border-style: solid;
  border-radius: 10px;
  border-color: var(--lightGray);
  border-width: 3px;

  font-family: Bitdaylong;
  font-size: 22px;
  color: var(--white);

  font-smooth: never;
  -webkit-font-smoothing: none;

  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;

  display: flex;
  align-items: center;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
    cursor: pointer;

    .icon {
      display: inline-block;
    }
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const CollectionIcon = styled.img`
  margin-left: 5px;
  display: none;
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
          <TabSelected>
            {CONTRACTS[contract].display}
            <CollectionIcon 
              src={`/static/img/marketplace/icon_${CONTRACTS[contract].display}.png`}
              height='25px'
              width='25px'
              className='icon'
              style={{display: 'inline-block'}}
            />
          </TabSelected> : 
          <Tab>
            {CONTRACTS[contract].display}
            <CollectionIcon 
              src={`/static/img/marketplace/icon_${CONTRACTS[contract].display}.png`}
              height='25px'
              width='25px'
              className='icon'
            />
          </Tab>
        }
        </Link>
      ))}
    </Tabs>
  )
}
