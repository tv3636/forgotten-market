import React from "react";
import Modal from "react-modal";

// https://github.com/emotion-js/emotion/issues/1476#issuecomment-707047762
export const ModalDecorator = ({
  className,
  ...props
}: {
  className: string;
} & any) => {
  const [name] = (className && className.split(" ")) || [""];
  const styles = name
    ? {
        portalClassName: name,
        overlayClassName: `${name}__Overlay`,
        className: `${name}__Content`
      }
    : {};

  return <Modal {...styles} {...props} />;
};
