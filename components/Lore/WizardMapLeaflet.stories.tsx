import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WizardMapLeaflet from "./WizardMapLeaflet";
// import dynamic from "next/dynamic";
// const DynamicMap = dynamic(() => import("../Map"), {
//   ssr: false // leaflet doesn't like Next.js SSR
// });

export default {
  title: "Wizards/WizardMapLeaflet",
  component: WizardMapLeaflet,
  argTypes: {
    backgroundColor: { control: "color" }
  }
} as ComponentMeta<typeof WizardMapLeaflet>;

const Template: ComponentStory<typeof WizardMapLeaflet> = (args) => (
  <WizardMapLeaflet {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
