import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import Switch from "react-switch";
import { AddressZero } from "@ethersproject/constants";
import { GetServerSidePropsContext } from "next";
import { gql, useQuery } from "@apollo/client";
import HelpTooltip from "../Lore/HelpTooltip";
import { ArtifactConfiguration } from "../Lore/types";
import { useNFTInfo } from "../NFTDisplay";
import { useExtractColors } from "../../hooks/useExtractColors";

const InlineFieldStyles = styled.div`
  h3 {
    display: inline-block;
  }
  label {
    position: relative;
    margin-left: 14px;
    top: 4px;
  }
`;

const Swatch = styled.div<{ bgColor?: string | null }>`
  width: 42px;
  height: 24px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: ${(props) => props.bgColor || "transparent"};
  display: inline-block;
  cursor: pointer;
`;

export const NSFWField = ({ ...props }: { name: string }) => {
  // const [field, meta] = useField({ ...props, type: "checkbox" });
  const [checked, setChecked] = useState(false);

  // TODO how to useField with Switch?
  return (
    <InlineFieldStyles>
      <h3>
        nsfw?
        <HelpTooltip>
          <p>
            Assigning nsfw status is a courtesy to let Wizards of all ages and
            backgrounds to safely enjoy the Lore.
          </p>
          <p>
            A good rule of thumb is nsfw should be enabled if the Lore is
            inappropriate for minors.
          </p>
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Switch
          onChange={() => setChecked(!checked)}
          checked={checked}
          uncheckedIcon={false}
          width={40}
          height={22}
          offColor={"#494949"}
          onColor={"#8e0606"}
          offHandleColor={"#a7a7a7"}
          name={props.name}
          // {...field}
          // {...props}
        />
      </label>
    </InlineFieldStyles>
  );
};

export const PixelArtField = ({ ...props }: { name: string }) => {
  // const [field, meta] = useField({ ...props, type: "checkbox" });
  const [checked, setChecked] = useState(false);

  return (
    <InlineFieldStyles>
      <h3>
        Pixel Art?
        <HelpTooltip>
          Pixel Art requires a special style of rendering for sharp edges. Check
          this box if your Artifact is pixel art
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Switch
          onChange={() => setChecked(!checked)}
          checked={checked}
          uncheckedIcon={false}
          width={40}
          height={22}
          offColor={"#494949"}
          onColor={"#65D36E"}
          offHandleColor={"#a7a7a7"}
          name={props.name}
        />
      </label>
    </InlineFieldStyles>
  );
};

export const BackgroundColorPickerField = ({
  artifactConfiguration,
  onChange,
  ...props
}: {
  artifactConfiguration: ArtifactConfiguration | null;
  onChange: (color?: string | null) => void;
  name: string;
}) => {
  // const [field, meta] = useField({ ...props, type: "string" });

  const { loading, nftData, error } = useNFTInfo({
    contractAddress: artifactConfiguration?.contractAddress,
    tokenId: artifactConfiguration?.tokenId
  });

  const [localBgColor, setLocalBgColor] = useState<string>();
  const [bigPickerShowing, setBigPickerShowing] = useState<boolean>(false);

  const { bgColor: detectedBgColor } = useExtractColors(nftData?.image);

  const setColor = (newColor: string) => {
    onChange(newColor);
    setLocalBgColor(newColor);
  };

  useEffect(() => {
    if (detectedBgColor) setColor(detectedBgColor);
  }, [detectedBgColor]);

  return (
    <InlineFieldStyles>
      <h3>
        BG Color
        <HelpTooltip>
          Background color for the page. Helps some images fit better on the
          page.
        </HelpTooltip>
      </h3>
      <label className="checkbox-input">
        {/* <input type="checkbox" {...field} {...props} /> */}
        <Swatch
          bgColor={localBgColor}
          onClick={() => setBigPickerShowing(!bigPickerShowing)}
        />
        {bigPickerShowing && (
          <HexColorPicker
            color={localBgColor}
            onChange={(hex) => setColor(hex)}
          />
        )}
      </label>
    </InlineFieldStyles>
  );
};
