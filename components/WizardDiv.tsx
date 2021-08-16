import styled from "@emotion/styled";

const image_base_url = 'https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-';
const opensea_base_url = 'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/';

const WizardStyle = styled.div`
  .wizard-image-div {
      height: 171px;
      width: 180.75px;
      position: relative;
      background-image: url("../static/img/frame-alt.png");
      background-size: 180.75px 171px;
      display: inline-block;
      scroll-snap-align: end;
      margin: 0.45%;
  }

  .wizard-image {
      margin-left: 11%;
      margin-top: 17%;
  }

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

  @font-face {
      font-family: "Alagard";
      src: url("/static/game/wizards/alagard.otf") format("opentype");
    }

  .name-div {
      width: 107.25px;
      height: 24.75px;
      position: absolute;
      left: 37.5px;
      top: 1.5px;
  }

  .wizard-name {
      text-align: center;
      position: relative;
      z-index: 1;
      margin-top: 0.1em;
      margin-left: 0.5em;
      margin-right: 0.5em;
      line-height: 1em;

      color: #dfd1a8;
      font-family: "Alagard";
      font-size: 69%;
  }
`;

function WizardCard(props: any) {
    return (
        <div className='wizard-image-div'>
            <div className='name-div'><h3 className='wizard-name'>{props.name}</h3></div>
            <a href={opensea_base_url + props.id}>
                <img className='wizard-image' src={image_base_url + props.id + '.png'} height={131.25} width={131.25}/>
            </a>
        </div>
    )
}

function WizardDiv(props: any) {
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

export default WizardDiv;
