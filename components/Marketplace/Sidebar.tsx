import styled from "@emotion/styled";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/router";
import RuneHeader from "./RuneHeader";
import { getContract } from "./marketplaceHelpers";
import { BEAST_CONTRACTS, CHARACTER_CONTRACTS, COMMUNITY_CONTRACTS, CONTRACTS, ITEM_CONTRACTS, MOUNT_CONTRACTS } from "./marketplaceConstants";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  margin-top: var(--sp3);

  max-width: var(--sidebar);
  min-width: calc(var(--sidebar) / 1.1);

  ::-webkit-scrollbar {
    display: none;
  }

  @media only screen and (min-width: 1250px) and (max-height: 700px) {
    min-width: calc(var(--sidebar) * .9);
  }
`;

const MobileContainer = styled.div`
  @media only screen and (max-width: 1250px) {
    text-align: center;
  }
`;

const Collections = styled.div`
  margin-bottom: var(--sp-1);
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
  transition: all 150ms;
`;

const CollectionName = styled.div`
  padding: var(--sp-5);
  padding-top: calc(var(--sp-5) / 1.25);
  padding-bottom: calc(var(--sp-5) / 1.25);
  font-size: var(--sp1);
  transform: translateX(-2ch);

  transition: all 200ms;

  @media only screen and (max-width: 1250px) {
    transform: none;
  }
`;

const HeaderWrap = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 40 50;
  border-image-width: calc(var(--frameSize) / 1.25);
  border-style: solid;
  border-image-repeat: round;

  background-color: var(--darkGray);

  padding: var(--sp0) var(--sp0);  
`;

const SectionWrap = styled.div`
  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 40 50;
  border-image-width: calc(var(--frameSize) / 1.25);
  border-style: solid;
  border-image-repeat: round;

  margin-bottom: var(--sp1);
  background-color: var(--darkGray);
  padding: var(--sp-1);
`;

const BlockWrap = styled.div`
  margin-top: var(--sp-4);
`;

const NameWrap = styled.div`
  display: flex;
  justify-content: center;

  margin-left: var(--sp0);

  @media only screen and (max-width: 1250px) {
    margin-left: 0;
  }
`;

function Collection({
  contract,
  setBurgerActive,
}:{
  contract: string;
  setBurgerActive: (active: boolean) => void;
}) {
  const router = useRouter();
  let active = router.query.contractSlug == contract;
  let contractDict = getContract(contract);
  
  return (
    <NameWrap>
      <Link href={`/${ contract }${ 'activity' in router.query ? `?activity=${router.query.activity}` : ''}`}>
        <CollectionWrapper onClick={() => setBurgerActive(false)}>
          <CollectionIcon className={`icon${ active ? ' active' : ''} desktop`}>
            <Image 
              src={`/static/img/marketplace/icon_${contractDict.display}.png`} 
              height='25ex' 
              width='25ch' 
            />
          </CollectionIcon>
          
            <CollectionName className={`alagard name${ active ? ' active' : ''}`}>
              { contractDict.display }
            </CollectionName>
        </CollectionWrapper>
      </Link>
    </NameWrap>
  )
}

function CollectionBlock({
  contracts,
  name,
  setBurgerActive,
}: {
  contracts: string[];
  name: string;
  setBurgerActive: (active: boolean) => void;
}) {
  return (
    <BlockWrap>
      <RuneHeader plaintext={false} home={true}>{name}</RuneHeader>
      <Collections>
      {
        Object.keys(contracts).map((contract: string, index) => (
          <Collection key={index} contract={contract} setBurgerActive={setBurgerActive} />
        ))
      }
      </Collections>
    </BlockWrap>
  )
}

type Props = {
  setBurgerActive?: (active: boolean) => void;
};

export function CollectionContainer({
  setBurgerActive = () => {},
}: Props) {
  return (
    <MobileContainer>
      <HeaderWrap>
        <RuneHeader plaintext={true} home={true}>OFFICIAL COLLECTIONS</RuneHeader>
      </HeaderWrap>
      <SectionWrap>
        <CollectionBlock contracts={CHARACTER_CONTRACTS} name={'CHARACTERS'} setBurgerActive={setBurgerActive}/>
        <CollectionBlock contracts={MOUNT_CONTRACTS} name={'MOUNTS'} setBurgerActive={setBurgerActive}/>
        <CollectionBlock contracts={BEAST_CONTRACTS} name={'BEASTS'} setBurgerActive={setBurgerActive}/>
        <CollectionBlock contracts={ITEM_CONTRACTS} name={'ITEMS'} setBurgerActive={setBurgerActive}/>
      </SectionWrap>
      <HeaderWrap>
        <RuneHeader plaintext={true} home={true}>COMMUNITY COLLECTIONS</RuneHeader>
      </HeaderWrap>
      <SectionWrap>
        <Collections>
        {
          Object.keys(COMMUNITY_CONTRACTS).map((contract: string, index) => (
            <Collection key={index} contract={contract} setBurgerActive={setBurgerActive} />
          ))
        }
        </Collections>
      </SectionWrap>
    </MobileContainer>
  )
}

export default function Sidebar({}:{}) {
  return (
    <Container className="noscrim desktop">
      <CollectionContainer />
    </Container>
  )
}
