import styled from "@emotion/styled";
import { useState } from "react";
import { WizardConfiguration } from "./AddLore/WizardPicker";
import { motion, AnimateSharedLayout } from "framer-motion";

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
  background-image: url("/static/img/wizard_frame.png");
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

const WizardImage = styled(motion.img)`
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

const WizardCard = ({
  id,
  name,
  onWizardPicked,
}: {
  id: string;
  name: string;
  onWizardPicked?: (wizardConfiguration: WizardConfiguration) => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <CardStyle
      isHovering={isHovering}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <WizardFrame
        className="wizardFrame"
        onClick={
          onWizardPicked
            ? () => {
                const wizardPicked: WizardConfiguration = {
                  tokenId: id,
                  name: name,
                };
                console.log("wizardPicked: ", wizardPicked);
                onWizardPicked(wizardPicked);
              }
            : () => null
        }
      >
        <WizardName>
          <h3>
            {name} (#{id})
          </h3>
        </WizardName>
        <WizardImageContainer>
          <WizardImage
            layoutId={`wizard-image-${id}`}
            key={`wizard-image-${id}`}
            src={`${process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_WEB_IMG_BASE_URL}/alt/400-nobg/wizard-${id}.png`}
          />
        </WizardImageContainer>
      </WizardFrame>
    </CardStyle>
  );
};

export default WizardCard;
