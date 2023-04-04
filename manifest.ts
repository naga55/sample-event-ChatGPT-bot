import { Manifest } from "deno-slack-sdk/mod.ts";
import ChatAssistantWorkflow from "./workflows/chat_assistant_workflow.ts";
import GreetingWorkflow from "./workflows/greeting_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "sample-sol-dvs-event",
  description:
    "SOL×DVSのイベント用のサンプルBot",
  icon: "assets/default_new_app_icon.png",
  workflows: [ChatAssistantWorkflow],
  outgoingDomains: [ //Open AIのAPIを叩くため追加
    "api.openai.com",
  ],
  botScopes: [ 
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:read",
  ],
});
