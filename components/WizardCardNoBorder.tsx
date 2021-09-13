import { Box, Flex } from "rebass";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import * as React from "react";
import { IMAGE_NOBG_BASE_URL, OPENSEA_BASE_URL } from "../constants";
import Link from "next/link";

const WizardCardNoBorder = ({
  id,
  name,
  showOpenSeaLink = false,
  showLoreLink = false,
  bookOfLore = false
}: {
  id: number;
  name: string;
  showOpenSeaLink: boolean;
  showLoreLink: boolean;
  bookOfLore: boolean;
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
              {/* TODO: have this just _select_ the Wizard if you're on the Book of Lore. Maybe need some state management like Mobx? */}
              <Link passHref={true} href={`/lore/${id}/0`}>
                <a
                  className="icon-link"
                  title={"Lore"}
                  target={bookOfLore ? "_self" : "_blank"}
                >
                  <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
                </a>
              </Link>
            </>
          ) : null}
        </Flex>
      </Box>
    </Flex>
  );
};

export default WizardCardNoBorder;
