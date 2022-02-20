import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "../../components/Layout";
import styled from "@emotion/styled";
import { getProvider } from "../../hooks/useProvider";
import { getTokenDataForAllCollections } from "../../lib/nftUtilis";
import { useState, useEffect } from "react";
import { API_BASE_URL, CONTRACTS } from "../../components/Marketplace/marketplaceConstants";
import Link from "next/link";
import { getInfinityVeilContract, getPoniesContract } from "../../contracts/ForgottenRunesWizardsCultContract";

export default function About({
}: {
}) {
  return (
    <Layout title="About">
      <div style={{height: '90vh'}}>
        forgotten.market is a community-run Forgotten Runes marketplace, powered by Reservoir Protocol.
      </div>
    </Layout>
  )
}
