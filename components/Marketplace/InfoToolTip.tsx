import styled from "@emotion/styled";
import ReactTooltip from 'react-tooltip'; 

const InfoImage = styled.img`
width: 15px;
height: 15px;

:hover {
  cursor: pointer;
}
`;

const FlexDisplay = styled.div`
  display: flex;
`;

export default function InfoTooltip({
  tooltip
}: {
  tooltip: string;
}) {
  return (
    <FlexDisplay>
      <InfoImage 
        src='/static/img/marketplace/info.png'
        onMouseOver={(e) =>
          (e.currentTarget.src = '/static/img/marketplace/info_hover.png')
        }
        onMouseOut={(e) =>
          (e.currentTarget.src = '/static/img/marketplace/info.png')
        }
        data-tip={tooltip} 
      />
      <ReactTooltip/>
    </FlexDisplay>
  );
}
