import styled from "@emotion/styled";
import { ModalDecorator } from "../ui/ModalDecorator";

const StyledModal = styled(ModalDecorator)`
  &__Overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    transition: all 1s ease-in;
    background-color: rgba(0, 0, 0, 0.75);
  }

  &__Content {
    position: absolute;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    border: none;
    background: #0d0019;
    overflow: auto;
    border-radius: 3px;
    outline: none;
    padding: 20px;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    text-align: center;
    min-width: 50vw;
    min-height: 50vw;
    color: white;
    display: flex;
    width: 90vw;
    max-width: 800px;
    max-height: 90vh;
  }
`;
export default StyledModal;
