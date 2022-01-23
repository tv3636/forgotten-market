import styled from "@emotion/styled";
import { SocialItem } from "../../components/Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";

export const CONTRACTS: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": {
    collection: "forgottenruneswizardscult",
    display: "Wizards",
    image_url: "/api/art/wizards/",
  },
  "0x251b5f14a825c537ff788604ea1b58e49b70726f": {
    collection: "forgottensouls",
    display: "Souls",
    image_url: "https://portal.forgottenrunes.com/api/souls/img/",
  },
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": {
    collection: "forgottenrunesponies",
    display: "Ponies",
    image_url: "https://portal.forgottenrunes.com/api/shadowfax/img/",
  },
};

const Timespan = styled.span`
  width: 10ch;
  min-width: 10ch;
  text-align: right;
`;

export function ListingExpiration({
  timer,
  dateString,
}: {
  timer: any;
  dateString: string;
}) {
  if (timer?.days > 1) {
    if (dateString) {
      return <div>Listing expires on {dateString}</div>;
    } else {
      return null;
    }
  } else {
    return (
      <div>
        <div>
          Listing expires in{" "}
          {timer?.days > 0 && <Timespan> {timer?.days} days, </Timespan>}
          <Timespan> {timer?.hours} hours, </Timespan>
          <Timespan> {timer?.minutes} minutes, </Timespan>
          <Timespan> {timer?.seconds} seconds </Timespan>
        </div>
      </div>
    );
  }
}

export function Icons({
  tokenId,
  contract,
}: {
  tokenId: number;
  contract: string;
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}
    >
      <SocialItem>
        <a
          href={`/scenes/gm/${tokenId}`}
          className="icon-link gm"
          target="_blank"
        >
          <ResponsivePixelImg
            src="/static/img/icons/gm.png"
            className="gm-img"
          />
        </a>
      </SocialItem>
      {CONTRACTS[contract].collection == "Wizards" && (
        <SocialItem>
          <a
            href={`/api/art/${CONTRACTS[contract].collection}/${tokenId}.zip`}
            className="icon-link"
            target="_blank"
          >
            <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
          </a>
        </SocialItem>
      )}
      <SocialItem>
        <a
          href={`/lore/${CONTRACTS[contract].collection}/${tokenId}/0`}
          className="icon-link"
        >
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </SocialItem>
    </div>
  );
}
