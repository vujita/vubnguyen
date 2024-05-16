import { type Meta, type StoryObj } from "@storybook/react";
import { Avatar, type AvatarProps } from "vujita-ui/src/avatar";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "radio", defaultValue: "gray", description: "background color", options: ["gray"] },
    border: { control: "boolean", defaultValue: false, description: "border" },
    className: { control: "text", defaultValue: "", description: "extra classnames" },
    imgClassName: { control: "text", defaultValue: "", description: "extra classnames" },
    placeholder: { control: "text", defaultValue: "N/A", description: "placeholder when image is missing" },
    shape: { control: "radio", defaultValue: "rounded", options: ["rounded", "square"] },
    size: { control: "radio", defaultValue: "xs", options: ["xs", "sm", "md", "lg"] },
    src: { control: "text" },
  },

  component: Avatar,

  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],

  title: "Example/Avatar",
} satisfies Meta<AvatarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceholderAvatar: Story = {
  args: {
    backgroundColor: "gray",
    border: false,
    placeholder: "N/A",
    shape: "rounded",
    size: "xs",
  },
};
export const ProfileAvatar: Story = {
  args: {
    backgroundColor: "gray",
    border: false,
    placeholder: "N/A",
    shape: "rounded",
    size: "sm",
    src: "https://cdn.discordapp.com/avatars/318810734685454336/2d4cae233d57ba9ab0e3deec9c2600d6.png",
  },
};
