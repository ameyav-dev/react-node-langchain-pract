import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv/config";
import http from 'http';

(async () => {
  console.log(process.env.OPENAI_API_KEY)
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });

  const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });



    const messages = [
      new SystemMessage("Translate the following from English into Hindi"),
      new HumanMessage("My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker. My name is joker"),
    ];

    const stream = await model.stream(messages);

    const chunks = [];
    for await (const chunk of stream) {
      // chunks.push(chunk);
      console.log(`${chunk.content}|`);
      res.write(chunk?.content.toString('utf-8') || "");
      // console.log(`Sent: ${chunk}`);
    }
    res.end();
  });
  const PORT = 3000;
  server.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}/`));

})();