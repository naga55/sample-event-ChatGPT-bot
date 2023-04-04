import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { ChatAssistantFunctionDefinition } from "../functions/chat_assistant_function.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 */
const ChatAssistantWorkflow = DefineWorkflow({
  callback_id: "chat_assistant_workflow", //（必須）アプリを特定するための一意の文字列
  title: "Ask Assisstant", //（必須）エンドユーザーのモーダルなどに表示されるタイトル
  description: "Enter your question for Assistant", //オプション
  input_parameters: {// （オプション）ステップ関数や他のワークフローに与える値
    properties: {// workflowが利用するパラメータを列挙
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      user_id: {
        type: Schema.slack.types.user_id,
      },
      question: {
        type: Schema.types.string,
      },
    },
    required: ["channel_id", "question"], //このパラメータが入力されている場合のみworkflowを実施する
  },
});

// OpenAI をコールする Step
const chatAssistantFunctionStep = ChatAssistantWorkflow.addStep(
  ChatAssistantFunctionDefinition,
  {
    user_id: ChatAssistantWorkflow.inputs.user_id,
    question: ChatAssistantWorkflow.inputs.question,
  },
);

// メッセージをチャネルに送信する Step
ChatAssistantWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: ChatAssistantWorkflow.inputs.channel_id,
  message: chatAssistantFunctionStep.outputs.answer,
})

export default ChatAssistantWorkflow;
