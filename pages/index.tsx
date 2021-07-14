import dynamic from "next/dynamic";
import React from "react";

const DynamicGameRoot = dynamic(() => import("../game/GameRoot"), {
  ssr: false
});

const IndexPage = () => (
  <>
    <DynamicGameRoot />
  </>
);

export default IndexPage;
