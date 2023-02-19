import styled from "@emotion/styled";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { getContract } from "./marketplaceHelpers";

const SocialItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4em;

  a:hover {
    opacity: 0.5;
    transition: all 100ms;
  }

  a:active {
    opacity: 0.3;
  }

  .gm-img {
    height: 30px;
    width: 33px;
  }
`;

// Social icons for each token
export default function Icons({
  tokenId,
  contract,
}: {
  tokenId: number;
  contract: string;
}) {
  let contractDict = getContract(contract);
  
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}
    >
      <SocialItem>
        <a
          href={`https://forgottenrunes.com/scenes/gm/${tokenId}`}
          className="icon-link gm"
          target="_blank"
        >
          <ResponsivePixelImg
            src="/static/img/icons/gm.png"
            className="gm-img"
          />
        </a>
      </SocialItem>
      <SocialItem>
        <a href={`https://forgottenrunes.com/lockscreen?tokenSlug=${contractDict.display.toLowerCase()}&tokenId=${tokenId}`} className="icon-link" target="_blank">
          <ResponsivePixelImg src="/static/img/icons/social_phone_default.png" />
        </a>
      </SocialItem>
      {contractDict.collection == "forgottenruneswizardscult" && (
        <SocialItem>
          <a
            href={`https://forgottenrunes.com/api/art/${contractDict.display.toLowerCase()}/${tokenId}.zip`}
            className="icon-link"
            target="_blank"
          >
            <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
          </a>
        </SocialItem>
      )}
      <SocialItem>
        <a
          href={`https://forgottenrunes.com/lore/${contractDict.display.toLowerCase()}/${tokenId}/0`}
          className="icon-link"
          target="_blank"
        >
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </SocialItem>
    </div>
  );
}
