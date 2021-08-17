import styled from "@emotion/styled";
import { useState } from "react";

const image_base_url =
  "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-";
const opensea_base_url =
  "https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/";

const CardStyle = styled.div<{ isHovering: boolean }>`
  opacity: ${(props) => (props.isHovering ? 1 : 0.7)};
  transition: all 0.1s ease-in;

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
    margin-top: 28px;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wizard-name {
    text-align: center;
    position: relative;
    z-index: 1;
    line-height: 1em;

    font-size: 11px;
    padding: 0 5px;
    color: #dfd1a8;
    font-family: "Alagard";
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
      <div
        className="wizard-image-div"
        onClick={() =>
          props.onClick ? props.onClick(props.id, props.name) : null
        }
      >
        <div className="name-div">
          <h3 className="wizard-name">{props.name}</h3>
        </div>
        <img
          className="wizard-image"
          src={image_base_url + props.id + ".png"}
          height={131.25}
          width={131.25}
        />
      </div>
    </CardStyle>
  );
};

export default WizardCard;
