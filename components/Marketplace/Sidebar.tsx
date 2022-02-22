import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./marketplaceConstants";
import { getOptions } from "./marketplaceHelpers";
import Select from "react-select";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import styled from "@emotion/styled";

const headers: HeadersInit = new Headers();
headers.set('x-api-key', process.env.NEXT_PUBLIC_REACT_APP_RESERVOIR_API_KEY ?? '');

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  margin-bottom: 30px;
  
  border: dashed;
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
  }

  transition: all 100ms;
`;

const Label = styled.label`
  margin: 5px;
  font-family: Alagard;
  font-size: 18px;

  color: var(--lightGray);

  @media only screen and (max-width: 600px) {
    font-size: 15px;
  }
`;

const FilterWrapper = styled.div`
  width: 19%;
  min-width: 150px;
  margin-right: 3%;

  @media only screen and (max-width: 600px) {
    width: auto;
    max-width: 1000px;
    margin-left: 0px;
    margin-right: 0px;
  }
`;

const FilterStyle = styled.div`
  display: flex;
  flex-direction: column;
  
  @media only screen and (max-width: 600px) {
    min-width: 90%;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: 5vw;
    margin-right: 5vw;
    display: none;
  }
`;

const FontTraitWrapper = styled.div`
  font-family: Arial;
  color: black;
`;

const ExpandButton = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 10px;
  }
`;


export default function SideBar({
  collection,
  selectionChange,
  loreChange,
  noLoreChange,
}: {
  collection: string;
  selectionChange: any;
  loreChange: any;
  noLoreChange: any;
}) {
  const [traits, setTraits] = useState([]);
  const [isOpen, setIsOpen] = useState<any>(null);
  const toggleIsOpen = () => {
    if (isOpen == null) {
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  }
  const router = useRouter();

  async function fetchTraits() {
    const attributes = await fetch(
      `${API_BASE_URL}attributes?collection=${collection}`,
      { headers: headers }
  );
    const attributeJson = await attributes.json();
    setTraits(attributeJson.attributes);
  }

  useEffect(() => {
    fetchTraits();
  }, []);

  // Only add style on mobile if toggle is used
  var testStyle = isOpen == null ? {} : {display: isOpen ? 'flex' : 'none'};

  return (
    <FilterWrapper>
      <ExpandButton>
        <a onClick={() => toggleIsOpen()}>
          <ResponsivePixelImg src='/static/img/icons/social_link_marketplace.png' />
        </a>
      </ExpandButton>
      <FilterStyle style={testStyle}>
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
        <Form>
          <Label>
            <input type='checkbox' onClick={loreChange} /> Has Lore
          </Label>
          <Label>
            <input type='checkbox' onClick={noLoreChange} /> Has No Lore
          </Label>
        </Form>
        
      </FilterStyle>
    </FilterWrapper>
  );
}
