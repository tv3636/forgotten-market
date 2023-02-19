import styled from "@emotion/styled";

export const ResponsiveImg = styled.img<{ pixelArt?: boolean }>`
  width: 100%;
  height: auto;
  image-rendering: ${(props) => (props.pixelArt ? "pixelated" : "auto")};
`;

export const ResponsivePixelImg = styled.img`
  width: 100%;
  height: auto;
  image-rendering: pixelated;
`;
