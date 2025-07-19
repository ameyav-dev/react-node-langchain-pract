import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const promptType = {
  ENGTOOTH: "Translate the following from English into ||TO-LANG||"
}

const getModelObj = function () {
  return new ChatOpenAI({ model: "gpt-4o-mini" });
}

const getStreamModelObj = function () {
  return new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    streaming: true,
    modelName: 'gpt-4o-mini',
  });
}

const getSystemPrompt = function (promptKey) {
  return promptType[promptKey];
}

const invokeConversionModel = async function (messages) {
  const model = getModelObj();
  let aiMessage = await model.invoke(messages);
  return aiMessage.content;
}

export async function callStreamData(ws, userMsg) {
  const chatModel = getStreamModelObj();

  const stream = await chatModel.stream([
    new HumanMessage(userMsg),
  ]);

  try {
    for await (const chunk of stream) {
      ws.send(chunk.content || '');
    }
    ws.send('[END]'); // Optional end marker
  } catch (error) {
    console.error('Streaming error:', error);
    ws.send('[ERROR]');
  }
}

export function callLangConverter(userMsg, langPrefTo) {
  let sysPrompt = getSystemPrompt('ENGTOOTH');
  let systemMessage = sysPrompt.replace("||TO-LANG||", langPrefTo || 'Hindi');
  const messages = [
    new SystemMessage(systemMessage),
    new HumanMessage(userMsg),
  ];
  const modelResp = invokeConversionModel(messages);
  return modelResp;
}
