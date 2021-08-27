import { Box, Flex } from "rebass";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import * as React from "react";
import { IMAGE_NOBG_BASE_URL, OPENSEA_BASE_URL } from "../constants";

const WizardCardNoBorder = ({
  id,
  name,
  showOpenSeaLink = false,
  showLoreLink = false,
}: {
  id: number;
  name: string;
  showOpenSeaLink: boolean;
  showLoreLink: boolean;
}) => {
  return (
    <Flex flexDirection={"column"} alignItems={"center"} p={1}>
      <Box py={3} textAlign={"center"}>
        <h3>
          {name} (#{id})
        </h3>
      </Box>
      <Box pb={2}>
        <img
          src={IMAGE_NOBG_BASE_URL + id + ".png"}
          width={"200px"}
          height={"200px"}
        />
      </Box>
      <Box pb={3}>
        <Flex
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {showOpenSeaLink ? (
            <>
              <a
                href={`${OPENSEA_BASE_URL}${id}`}
                target={"_blank"}
                className="icon-link"
                title={"OpenSea"}
              >
                <ResponsivePixelImg src="/static/img/icons/social_opensea_default_w.png" />
              </a>
            </>
          ) : null}
          <Box ml={3} />
          {showLoreLink ? (
            <>
              <a
                href={`/lore/${id}/0`}
                className="icon-link"
                title={"Lore"}
                target={"_blank"}
              >
                <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
              </a>
            </>
          ) : null}
        </Flex>
      </Box>
    </Flex>
  );
};

export default WizardCardNoBorder;
