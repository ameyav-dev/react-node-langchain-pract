import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv/config";
console.log(process.env.OPENAI_API_KEY)

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const messages = [
  new SystemMessage("Translate the following from English into Hindi"),
  new HumanMessage("My name is joker"),
];

console.log(await model.invoke(messages));