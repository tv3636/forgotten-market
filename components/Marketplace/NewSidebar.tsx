import styled from "@emotion/styled";
import Link from "next/link";
import Image from 'next/image';
import { COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";
import { useRouter } from "next/router";
import RuneHeader from "./RuneHeader";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  margin-left: var(--sp3);
  margin-top: var(--sp1);

  max-width: var(--sidebar);
  min-width: var(--sidebar);

  ::-webkit-scrollbar {
    display: none;
  }
`;

const MobileContainer = styled.div`
  @media only screen and (max-width: 1250px) {
    text-align: center;
  }
`;

const Collections = styled.div`
  margin-bottom: var(--sp1);
`;

const CollectionWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;

  :hover {
    .name {
      transform: translateX(0ch);
      cursor: pointer;
    }

    .icon {
      opacity: 1;
      cursor: pointer;
    }
  }

  .active.name {
    transform: translateX(0ch);
    cursor: pointer;
  }

  .active.icon {
    opacity: 1;
    cursor: pointer;
  }

`;

const CollectionIcon = styled.div`
  opacity: 0;
  transition: all 250ms;
`;

const CollectionName = styled.div`
  padding: var(--sp-5);
  font-size: var(--sp2);
  transform: translateX(-2ch);

  transition: all 250ms;

  @media only screen and (max-width: 1250px) {
    transform: none;
  }
`;

function Collection({
  contract,
  activity,
}:{
  contract: string;
  activity: boolean;
}) {
  const router = useRouter();
  let active = router.query.contractSlug == contract;
  
  return (
    <div>
      <Link href={`/${ contract }${ activity ? '?activity=True' : ''}`}>
        <CollectionWrapper>
          <CollectionIcon className={`icon${ active ? ' active' : ''} desktop`}>
            <Image 
              src={`/static/img/marketplace/icon_${contract in CONTRACTS? CONTRACTS[contract]?.display :COMMUNITY_CONTRACTS[contract].display }.png`} 
              height='25ex' 
              width='25ch' 
            />
          </CollectionIcon>
          
            <CollectionName className={`alagard name${ active ? ' active' : ''}`}>
              { contract in CONTRACTS ? CONTRACTS[contract].display : COMMUNITY_CONTRACTS[contract].display }
            </CollectionName>
        </CollectionWrapper>
      </Link>
    </div>
  )
}

export function CollectionContainer({
  activity
}: {
  activity: boolean
}) {
  return (
    <MobileContainer>
      <RuneHeader>OFFICIAL</RuneHeader>
      <Collections>
      {
        Object.keys(CONTRACTS).map((contract: string, index) => (
          <Collection key={index} contract={contract} activity={activity} />
        ))
      }
      </Collections>
      <RuneHeader>COMMUNITY</RuneHeader>
      <Collections>
      {
        Object.keys(COMMUNITY_CONTRACTS).map((contract: string, index) => (
          <Collection key={index} contract={contract} activity={activity} />
        ))
      }
      </Collections>
    </MobileContainer>
  )
}

export default function Sidebar({
  activity,
}:{
  activity: boolean;
}) {
  return (
    <Container className="noscrim desktop">
      <CollectionContainer activity={activity} />
    </Container>
  )
}
