import styled from "@emotion/styled";
import { API_BASE_URL, MARKETS } from "./marketplaceConstants";
import { getOptions } from "./marketplaceHelpers";
import Select from "react-select";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

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

const TraitExpander = styled.div`
  display: none;
`

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

export default function Filters({
  contract,
  loreChange,
  noLoreChange,
  setSource,
  selectionChange,
  setActivity,

}:{
  contract: string;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
  selectionChange: any;
  setActivity: any;
}) {
  const [traits, setTraits] = useState([]);
  const [expanded, setExpanded] = useState(false);
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

  return (
    <>
    { (router.query.activity == 'sales' || !router.query.activity) &&
      <>
        <Filter onClick={() => setExpanded(!expanded)}>
          FILTER BY TRAIT
          <div>{ expanded ? <img src='/static/img/marketplace/down_arrow.png' height='12px' width='20px'/> : `>`}</div>
        </Filter>
        <TraitExpander style={{display: expanded ? 'block': 'none'}}>
        {traits.map((trait: any, index) => (
          <div key={index} style={{ marginBottom: 'var(--sp0)' }}>
            <Select
              options={getOptions(trait.values)}
              onChange={(e) => selectionChange(e, trait.key)}
              isClearable={true}
              isMulti={true}
              placeholder={trait.key}
              value={trait.key.toLowerCase() in router.query 
                ? Array.isArray(router.query[trait.key.toLowerCase()]) 
                  ? (router.query[trait.key.toLowerCase()] as string[]).map(selection => { return { value: selection, label: selection } }) 
                  : [{ value: router.query[trait.key.toLowerCase()], label: router.query[trait.key.toLowerCase()] }]
                : []
              }
              classNamePrefix='select'
            />
          </div>
        ))}
        </TraitExpander>
      </>
    }
    { !router.query.activity ?
      <>
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
              <input type='radio' name='source' onClick={() => setSource(MARKETS[source].name)} checked={router.query['source'] == MARKETS[source].name} /> 
              &nbsp;{MARKETS[source].name.toUpperCase()}
            </label>
          ))}
          <label>
            <input type='radio' name='source' onClick={() => setSource('')} checked={!router.query['source']}/> SHOW ALL
          </label>            
        </Form>
      </> 
      : <Form>
         <label>
            <input 
              type='radio' 
              name='activity' 
              onClick={() => { setActivity('sales') }} checked={router.query.activity == 'sales'} /> SHOW SALES
          </label>
          <label>
            <input 
              type='radio' 
              name='activity' 
              onClick={() => { setActivity('listings') }} checked={router.query.activity == 'listings'} /> SHOW LISTINGS
          </label>
      </Form>
      }
    </>
  )
}
