import styled from "@emotion/styled";
import { BidModal } from "@reservoir0x/reservoir-kit-ui";
import { useRouter } from "next/router";
import { getTrait, getTraitValue, isTraitOffer } from "./marketplaceHelpers";

const CollectionOffer = styled.button`
  background-color: var(--darkGray);
  border-image: url(/static/img/button-frame.png);
  border-style: solid;
  border-width: calc(var(--sp0) / 1.05);
  border-image-slice: 46 42 46 42;

  font-family: Terminal;
  font-size: var(--sp0);
  text-align: left;
  color: var(--white);

  padding: var(--sp-4);
  padding-left: var(--sp-2);

  :hover {
    background-color: var(--mediumGray);
    border-color: var(--lightGray);
    color: white;
    cursor: pointer;
  }

  transition: all 200ms;
`;

export default function CollectionOfferButton() {
  const router = useRouter();  
  
  if (isTraitOffer(router.query)) {
    const trait = getTrait(router.query);
    const value = getTraitValue(router.query);
    return (
      <BidModal
        trigger={<CollectionOffer>{'TRAIT OFFER'}</CollectionOffer>}
        collectionId={String(router.query.contractSlug)}
        attribute={{ key: trait, value: value}}
      />
    )
  } else {
    return (
      <BidModal
        trigger={<CollectionOffer>{'COLLECTION OFFER'}</CollectionOffer>}
        collectionId={String(router.query.contractSlug)}
      />
    )
  }
}
