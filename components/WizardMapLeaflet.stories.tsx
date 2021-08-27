import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Map from "./Map";
// import dynamic from "next/dynamic";
// const DynamicMap = dynamic(() => import("../Map"), {
//   ssr: false // leaflet doesn't like Next.js SSR
// });

export default {
  title: "Wizards/Map",
  component: Map,
  argTypes: {
    backgroundColor: { control: "color" }
  }
} as ComponentMeta<typeof Map>;

const Template: ComponentStory<typeof Map> = (args) => <Map {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: "Button"
};
