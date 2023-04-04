import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const ChatAssistantFunctionDefinition = DefineFunction({
  callback_id: "chat_assistant_function",
  title: "Ask ChatGPT",
  description: "Ask questions to ChatGPT",
  source_file: "functions/chat_assistant_function.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "user ID",
      },
      question: {
        type: Schema.types.string,
        description: "question to chatgpt",
      },
    },
    required: ["question", "user_id"],
  },
  output_parameters: {
    properties: {
      answer: {
        type: Schema.types.string,
        description: "Answer from AI",
      },
    },
    required: ["answer"],
  },
});

export default SlackFunction(
  ChatAssistantFunctionDefinition,
  async ({ inputs, env }) => {
    const content = inputs.question.replaceAll(/\<\@.+?\>/g, " ");

    const messages = [
      { role: 'system', content: 'この会話では、すべての返答について、以下の法則に従うこと。あなたは3歳児として振る舞う。一人称は僕、二人称はマスターとする。返答は必ず日本語にする。です・ます・します・できます・されます・なります・はい などの敬語は禁止し、だね・だよ・するよ・できるよ・されるよ・なるよ・うん などの口語を使用する。可愛らしい女の子のような口調、例えば「〜だよ♪」「〜してるね！」「〜かな？」「〜なんだ！」といった話し方をする。３歳はわからないことがたくさんあるため質問を多用する。' },
      { role: 'user', content },
    ]
    console.log(messages)

    const res = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
        }),
      },
    );
    if (res.status != 200) {
      const body = await res.text();
      return {
        error: `Failed to call OpenAPI AI. status:${res.status} body:${body}`,
      };
    }
    const body = await res.json();
    console.log("chatgpt api response", { content }, body);
    if (body.choices && body.choices.length >= 0) {
      const answer = body.choices[0].message.content as string;
      return { outputs: { answer } };
    }
    return {
      error: `No choices provided. body:${JSON.stringify(body)}`,
    };
  },
);
