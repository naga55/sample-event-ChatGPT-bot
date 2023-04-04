import { Trigger } from "deno-slack-api/types.ts";
import GreetingWorkflow from "../workflows/greeting_workflow.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const greetingTrigger: Trigger<typeof GreetingWorkflow.definition> = {
  type: "event",
  name: "Trigger workflow with app mentioned",
  workflow: "#/workflows/chat_assistant_workflow", //トリガーが起動するworkflow
  event: { //イベントオブジェクト
    event_type: "slack#/events/app_mentioned", //必須
    channel_ids: [ //必須
      ""
    ],
  },
  inputs: { //workflowへ提供される値
    channel_id: { value: "{{data.channel_id}}" },
    user_id: { value: "{{data.user_id}}" },
    question: { value: "{{data.text}}" },
  },
};

export default greetingTrigger;
