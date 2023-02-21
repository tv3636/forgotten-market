import { ORDER_TYPE } from "./marketplaceConstants";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import styled from "@emotion/styled";

const Expiration = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;

  margin-bottom: var(--sp3);
  margin-top: var(--sp1);
  max-width: 250px;
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
