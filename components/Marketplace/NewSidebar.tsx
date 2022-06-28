import styled from "@emotion/styled";
import Link from "next/link";
import Image from 'next/image';
import { CONTRACTS } from "./marketplaceConstants";
import { useRouter } from "next/router";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;

  margin-left: var(--sp3);
  margin-top: var(--sp1);
  max-width: 25ch;
  min-width: 25ch;

  ::-webkit-scrollbar {
    display: none;
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
      <Link href={`/new/${ contract }${ activity ? '?activity=True' : ''}`}>
        <CollectionWrapper>
          <CollectionIcon className={`icon${ active ? ' active' : ''}`}>
            <Image src={`/static/img/marketplace/icon_${CONTRACTS[contract].display}.png`} height='25ex' width='25ch' />
          </CollectionIcon>
          
            <CollectionName className={`alagard name${ active ? ' active' : ''}`}>
              { CONTRACTS[contract].display }
            </CollectionName>
        </CollectionWrapper>
      </Link>
    </div>
  )
}

export default function Sidebar({
  activity,
}:{
  activity: boolean;
}) {
  return (
    <Container>
      <Collections>
      {
        Object.keys(CONTRACTS).map((contract: string, index) => (
          <Collection key={index} contract={contract} activity={activity} />
        ))
      }
      </Collections>      
    </Container>
  )
}
