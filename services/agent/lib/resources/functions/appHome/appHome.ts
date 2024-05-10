import { HomeView } from "@slack/bolt";
import { getApiKeyBlocks } from "./apiKey";

export const createHome = (apiKey: string | undefined): HomeView => {
  const apiKeyBlock = getApiKeyBlocks(apiKey);

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Welcome!* \nThis is a home for the snacks app. This is yo boi for on demand snacks. Wether its Tesco or Ocado, I got you covered",
      },
    },
    {
      type: "divider",
    },
    ...apiKeyBlock,
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*How to use* \nI'm fueled by api keys so plug one in and I'm ready to go. Afterwards, just ping me a message of the munch you desire and I'll see what I can do.\n\n",
      },
    },
  ];

  const view: HomeView = {
    type: "home",
    callback_id: "home_view",
    blocks: blocks,
  };

  return view;
};
