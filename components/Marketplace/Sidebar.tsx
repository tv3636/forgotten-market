import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_BASE_URL, MARKETS } from "./marketplaceConstants";
import { getOptions } from "./marketplaceHelpers";
import Select from "react-select";
import styled from "@emotion/styled";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const CollapseButton = styled.div`
  background-color: var(--darkGray);
  color: var(--lightGray);
  font-family: Bitdaylong;
  font-size: 18px;
  padding: 15px;
  padding-right: 9px;
  margin-top: 30px;
  
  border: solid;
  border-color: var(--mediumGray);
  border-width: 2px;
  
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  :hover {
    border-color: var(--lightGray);
    background-color: var(--mediumGray);
    cursor: pointer;
  }

  transition: border-color 100ms;
  transition: background-color 100ms;

  @media only screen and (max-width: 600px) {
    margin-top: 10px;
    width: 75%;
    padding: 5px;

    justify-content: center;
  }

`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 30px;
  
  border: solid;
  padding: 10px;
  border-width: 2px;
  border-color: var(--mediumGray);
  background-color: var(--darkGray);

  :hover {
    border-color: var(--lightGray);
    background-color: var(--mediumGray);
  }

  @media only screen and (max-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }

  transition: all 100ms;
`;

const Label = styled.label`
  margin: 5px;
  font-family: Bitdaylong;
  font-size: 18px;

  color: var(--lightGray);

  @media only screen and (max-width: 600px) {
    font-size: 15px;
  }
`;

const MarketLabel = styled.label`
  margin: 5px;
  font-family: Bitdaylong;
  font-size: 18px;

  color: var(--lightGray);

  @media only screen and (max-width: 600px) {
    font-size: 15px;

    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

const MarketInput = styled.input`
  @media only screen and (max-width: 600px) {  
    margin-bottom: 5px;
  }

`;

const FilterWrapper = styled.div`
  width: 21%;
  min-width: 150px;
  margin-right: 3%;

  @media only screen and (max-width: 600px) {
    width: 100%;
    max-width: 1000px;
    margin-left: 0px;
    margin-right: 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const FilterStyle = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 0px;
  overflow: hidden;
  
  @media only screen and (max-width: 600px) {
    min-width: 90%;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: 5vw;
    margin-right: 5vw;
  }
  
`;

const FontTraitWrapper = styled.div`
  font-family: Arial;
  color: black;

  @media only screen and (max-width: 600px) {  
    width: 100%;
  }
`;

const DesktopWrapper = styled.div`
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const MobileWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: block;
  }
`;

function Forms({
  loreChange,
  noLoreChange,
  setSource,
}: {
  loreChange: any;
  noLoreChange: any;
  setSource: any;
}) {
  const router = useRouter();
  
  return (
    <div>
      <Form style={{marginBottom: '0px'}}>
        <Label>
          <input type='checkbox' onClick={loreChange} /> Has Lore
        </Label>
        <Label>
          <input type='checkbox' onClick={noLoreChange} /> Has No Lore
        </Label>
      </Form>
      <Form>
        {Object.keys(MARKETS).map((source: string, index: number) => (
          <MarketLabel key={index}>
            <MarketInput type='radio' name='source' onClick={() => setSource(source)} checked={router.query['source'] == source} /> {MARKETS[source].name}
          </MarketLabel>
        ))}
        <MarketLabel>
          <MarketInput type='radio' name='source' onClick={() => setSource('')} checked={!router.query['source']}/> Show All
        </MarketLabel>            
      </Form>
    </div>
  )
}

export default function SideBar({
  contract,
  selectionChange,
  loreChange,
  noLoreChange,
  setSource
}: {
  contract: string;
  selectionChange: any;
  loreChange: any;
  noLoreChange: any;
  setSource: any;
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
  }, []);

  useEffect(() => {
    if (expanded) {
      setActiveTimer(setTimeout(() => setOverflow('visible'), 1000));
    } else {
      clearTimeout(activeTimer);
      setOverflow('hidden');
    }
  }, [expanded]);

  return (
    <FilterWrapper>
      <CollapseButton 
        onClick={() => setExpanded(!expanded)}
        style={{paddingRight: expanded ? '9px' : '15px'}}
      >
        <DesktopWrapper>Filter by Trait</DesktopWrapper>
        <MobileWrapper style={{marginRight: '10px', marginLeft: '10px', fontSize: '15px'}}>Filter</MobileWrapper>
        <div>{ expanded ? <img src='/static/img/marketplace/down_arrow.png' height='12px' width='20px'/> : `>`}</div>
      </CollapseButton>
      <FilterStyle 
        style={{
          maxHeight: expanded ? '200vh' : '0px', 
          transition: expanded ? 'max-height 1000ms' : 'max-height 300ms',
          overflow: overflow,
        }}
      >
        {traits.map((trait: any, index) => (
          <FontTraitWrapper key={index} style={{ marginTop: '30px' }}>
            <Select
              options={getOptions(trait.values)}
              onChange={(e) => selectionChange(e, trait.key)}
              isClearable={true}
              placeholder={trait.key}
              value={trait.key.toLowerCase() in router.query ? {label: router.query[trait.key.toLowerCase()]} : null}
              classNamePrefix='select'
            />
          </FontTraitWrapper>
        ))}
        <MobileWrapper>
          <Forms 
            loreChange={loreChange} 
            noLoreChange={noLoreChange}
            setSource={setSource}
          />
        </MobileWrapper>
      </FilterStyle>
      <DesktopWrapper>
          <Forms 
            loreChange={loreChange} 
            noLoreChange={noLoreChange}
            setSource={setSource}
          />
      </DesktopWrapper>
    </FilterWrapper>
  );
}
