import styled from "@emotion/styled";
import Link from "next/link";
import Image from 'next/image';
import { API_BASE_URL, CONTRACTS, MARKETS } from "./marketplaceConstants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getOptions } from "./marketplaceHelpers";
import Select from "react-select";

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

const FormWrapper = styled.div`
  max-height: 5ex;

  > * {
    margin-bottom: var(--sp0);
  }
`;

const Filter = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--mediumGray);

  border-radius: 15px;
  padding: var(--sp0);

  :hover {
    background-color: var(--darkGray);
    cursor: pointer;
  }

  transition: all 200ms;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: var(--mediumGray);
  
  border-radius: 15px;
  padding: var(--sp0);

  :hover {
    background-color: var(--darkGray);
  }

  transition: all 200ms;
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
  contract,
  activity,
  loreChange,
  noLoreChange,
  setSource,
  selectionChange,
}:{
  contract: string;
  activity: boolean;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
  selectionChange: any;
}) {
  const [traits, setTraits] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState('hidden');
  const [activeTimer, setActiveTimer] = useState<any>(0);

  const router = useRouter();

  async function fetchTraits() {
    const attributes = await fetch(
      `${API_BASE_URL}collections/${contract}/attributes/all/v1`,
      { headers: headers }
  );
    const attributeJson = await attributes.json();
    setTraits(attributeJson.attributes);
  }

  useEffect(() => {
    fetchTraits();
  }, [contract]);

  useEffect(() => {
    if (expanded) {
      setActiveTimer(setTimeout(() => setOverflow('visible'), 1000));
    } else {
      clearTimeout(activeTimer);
      setOverflow('hidden');
    }
  }, [expanded]);

  return (
    <Container>
      <Collections>
      {
        Object.keys(CONTRACTS).map((contract: string, index) => (
          <Collection key={index} contract={contract} activity={activity} />
        ))
      }
      </Collections>      
      <FormWrapper>
        <Filter onClick={() => setExpanded(!expanded)}>
          FILTER BY TRAIT
          <div>{ expanded ? <img src='/static/img/marketplace/down_arrow.png' height='12px' width='20px'/> : `>`}</div>
        </Filter>
        <div 
        style={{
          maxHeight: expanded ? '200vh' : '0px', 
          marginBottom: expanded ? 'var(--sp2)' : '0',
          transition: expanded ? 'max-height 1000ms' : 'max-height 300ms',
          overflow: overflow,
        }}
      >
        {traits.map((trait: any, index) => (
          <div key={index} style={{ marginBottom: 'var(--sp0)' }}>
            <Select
              options={getOptions(trait.values)}
              onChange={(e) => selectionChange(e, trait.key)}
              isClearable={true}
              placeholder={trait.key}
              value={trait.key.toLowerCase() in router.query ? {label: router.query[trait.key.toLowerCase()]} : null}
              classNamePrefix='select'
            />
          </div>
        ))}
      </div>
        <Form>
          <label>
            <input type='checkbox' onClick={loreChange} /> HAS LORE
          </label>
          <label>
            <input type='checkbox' onClick={noLoreChange} /> HAS NO LORE
          </label>
        </Form>
        <Form>
          {Object.keys(MARKETS).map((source: string, index: number) => (
            <label key={index}>
              <input type='radio' name='source' onClick={() => setSource(source)} checked={router.query['source'] == source} /> 
              &nbsp;{MARKETS[source].name.toUpperCase()}
            </label>
          ))}
          <label>
            <input type='radio' name='source' onClick={() => setSource('')} checked={!router.query['source']}/> SHOW ALL
          </label>            
        </Form>
      </FormWrapper>
    </Container>
  )
}
