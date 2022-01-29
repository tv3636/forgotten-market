import styled from "@emotion/styled";

const InfoImage = styled.img`
width: 15px;
height: 15px;

:hover {
  cursor: pointer;
}
`;

export default function InfoTooltip({
  tooltip
}: {
  tooltip: string;
}) {
  return (
    <InfoImage 
      src='/static/img/marketplace/info.png'
      onMouseOver={(e) =>
        (e.currentTarget.src = '/static/img/marketplace/info_hover.png')
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = '/static/img/marketplace/info.png')
      } 
    />
  );
}