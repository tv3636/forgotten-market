import styled from "@emotion/styled";
import { SocialItem } from "../../components/Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { CONTRACTS } from "./marketplaceConstants";

export function getOptions(traits: [any]) {
  var result: any[] = [];

  if (traits.length > 0 && isNaN(traits[0].value))
    traits.sort(function (first, second) {
      return second.count - first.count;
    });

  for (var trait of traits) {
    let option: any = {};
    option.value = trait.value;
    option.label =
      trait.value + (isNaN(trait.value) ? " (" + trait.count + ")" : "");

    result.push(option);
  }
  return result;
}

function traitFormat(trait: string) {
  var out = "";
  for (var word of trait.split(' ')) {
    if (word == 'in') {
      out += word + " ";
    } else {
      out += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }
  }
  return out.slice(0, -1);
}

export function getURLAttributes(query: any) {
  var url_string = "";
  for (var trait of Object.keys(query)) {
    if (trait != 'contractSlug') {
      var url_trait = traitFormat(trait).replace("#", "%23");
      url_string +=
        "&attributes[" +
        url_trait +
        "]=" +
        query[trait];
    }
  }

  return url_string;
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
      {CONTRACTS[contract].collection == "forgottenruneswizardscult" && (
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
