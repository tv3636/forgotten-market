import styled from "@emotion/styled";

const GrainFill = styled.div`
  position: absolute;
  opacity: 10%;

  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background-image: url(/static/img/marketplace/paperTxt03.png);
  background-repeat: repeat;
`;

export default function Grain({
  tokenId,
  opacity,
}: {
  tokenId: number,
  opacity: number,
}) {
  return (
    <GrainFill style={{
      backgroundImage: `url(/static/img/marketplace/paperTxt0${(Number(tokenId) % 4) + 1}.png)`,
      backgroundPosition: `${(Number(tokenId) % 100)}% ${(Number(tokenId) % 100)}%`,
      opacity: `${opacity}%`,
    }}/>
  )
}
