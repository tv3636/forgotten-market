import styled from "@emotion/styled";
import WizardCard from "./WizardCard";

const image_base_url = 'https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-';
const opensea_base_url = 'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/';

const WizardStyle = styled.div`
  .outer-div {
      background-color: #0e0e0e;
      top: 1.8em;
      position: relative;

      margin-left: auto;
      margin-right: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
  }
`;

function WizardDiv(props: any) {
  if (props.onClick) {
    return (
        <WizardStyle>
            <div className='outer-div'>
                {props.wizards.map((wizard: any) =>
                    <WizardCard id={wizard.id} name={wizard.name} onClick={props.onClick}/>
                )}
            </div>
        </WizardStyle>
    )
  } else {
    return (
        <WizardStyle>
            <div className='outer-div'>
                {props.wizards.map((wizard: any) =>
                    <WizardCard id={wizard.id} name={wizard.name}/>
                )}
            </div>
        </WizardStyle>
    )
  }
}

export default WizardDiv;
