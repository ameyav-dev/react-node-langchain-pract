import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import http from 'http';
import dotenv from "dotenv/config";


const getTranslateText = async (textToTranslate, res) => {
  console.log(process.env.OPENAI_API_KEY)
  const model = new ChatOpenAI({ model: "gpt-4o-mini" });

  const messages = [
    new SystemMessage("Translate the following from English into Hindi"),
    new HumanMessage(textToTranslate),
  ];

  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked'
  });
  const stream = await model.stream(messages);

  const chunks = [];
  for await (const chunk of stream) {
    // chunks.push(chunk);
    console.log(`${chunk.content}|`);
    res.write(chunk?.content.toString('utf-8') || "");
    // console.log(`Sent: ${chunk}`);
  }
  res.end();
};

const server = http.createServer(async (req, res) => {

  let body = '';
  console.log(req.method)
  console.log(req.url)
  // Collect chunks of data
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', async () => {
    const data = JSON.parse(body);
    console.log('✅ Received JSON:', data);
    // getTranslateText(data.stringToConvert, res);
// req.socket.setNoDelay(true);


    console.log(process.env.OPENAI_API_KEY)
    const model = new ChatOpenAI({ model: "gpt-4o-mini" });

    const messages = [
      new SystemMessage("Translate the following from English into Hindi"),
      new HumanMessage(data.stringToConvert),
    ];

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });
    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      // chunks.push(chunk);
      console.log(`${chunk.content}|`);
      res.write(chunk?.content.toString('utf-8') || "");
      // console.log(`Sent: ${chunk}`);
    }
    res.end();
  });
});
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`));