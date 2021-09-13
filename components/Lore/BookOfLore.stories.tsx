import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BookOfLorePage from "./BookOfLorePage";

export default {
  title: "Wizards/BookOfLorePage",
  component: BookOfLorePage,
  argTypes: {
    bg: { control: "color" }
  }
} as ComponentMeta<typeof BookOfLorePage>;

const Template: ComponentStory<typeof BookOfLorePage> = (args) => (
  <BookOfLorePage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  bg: "black",
  wizardId: "0",
  page: "0",
  children: <div>hey</div>
};
