import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import { loadenv } from './environment/loadenv.js';
import { callLangConverter, callStreamData } from './src/services/openai.js';

loadenv();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3000;
const WSPORT = 3001;

// Middleware to parse JSON requests (optional, but useful)
app.use(express.json());

app.post('/convertdata', async (req, res) => {
  try {
    // Example of awaiting something (like a DB call)
    const data = req.body;  // Access raw JSON data
    console.log(data);
    var modelResp = await callLangConverter(data.userMsg || 'No inputs given by user', data.preffLang);
    res.status(200).send(modelResp);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('message', async (message) => {
    const userInput = message.toString();
    console.log('Received from client:', userInput);
    callStreamData(ws, userInput);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Start web socket
server.listen(WSPORT, () => {
  console.log(`WebSocket server running at ws://localhost:${WSPORT}`);
});
