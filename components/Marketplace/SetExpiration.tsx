import { ORDER_TYPE } from "./marketplaceConstants";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import styled from "@emotion/styled";
import { Title } from "./Order";

const Expiration = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

export default function SetExpiration({
  action,
  expiration,
  setExpiration,
}: {
  action: ORDER_TYPE;
  expiration: any;
  setExpiration: (date: any) => void;
}) {
  return (
    <Expiration>
      <Title>
        <div style={{marginRight: '10px', marginBottom: '5px'}}>
          { `${action == ORDER_TYPE.OFFER ? 'Offer' : 'Listing'} Expires` }
        </div>
        <InfoTooltip 
          tooltip={
            action == ORDER_TYPE.OFFER ?
            'An offer can no longer be accepted after its expiration. To invalidate an offer before its expiration, you will need to manually cancel the offer.' :
            'A listing can no longer be filled after its expiration. Invalidating a listing before its expiration requires manual cancellation'
          }
        />
      </Title>
      <Flatpickr
        data-enable-time
        value={expiration}
        onChange={([date]) => { setExpiration(date) }}
        options={{
          "disable": [
            function(date) { return date < new Date(); }
          ]
        }}
      />
    </Expiration>
  )
}
