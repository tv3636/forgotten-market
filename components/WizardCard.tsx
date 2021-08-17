import styled from "@emotion/styled";
import { useState } from "react";

const image_base_url =
  "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-";
const opensea_base_url =
  "https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/";

const CardStyle = styled.div<{ isHovering: boolean }>`
  /* opacity: ${(props) => (props.isHovering ? 1 : 0.7)}; */
  transition: all 0.1s ease-in;
  max-width: 100%;
  position: relative;

  &:after {
    content: "";
    display: block;
    /* padding-bottom: 100%; */
  }
`;

const WizardFrame = styled.div`
  position: relative;
  background-image: url("/static/img/frame-alt.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const WizardImageContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WizardImage = styled.img`
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  margin-top: 23%;
  margin-bottom: 13%;
`;

const WizardName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    text-align: center;
    position: relative;
    line-height: 1em;

    font-size: 1em;
    padding: 0 30%;
    color: #dfd1a8;
    font-family: "Alagard";
    position: absolute;
    margin-top: 30%;
  }
`;

const WizardCard = (props: any) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <CardStyle
      isHovering={isHovering}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <WizardFrame
        onClick={() =>
          props.onClick ? props.onClick(props.id, props.name) : null
        }
      >
        <WizardName>
          <h3>
            {props.name} (#{props.id})
          </h3>
        </WizardName>
        <WizardImageContainer>
          <WizardImage src={image_base_url + props.id + ".png"} />
        </WizardImageContainer>
      </WizardFrame>
    </CardStyle>
  );
};

export default WizardCard;
