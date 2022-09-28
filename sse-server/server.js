const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
let clients = [];
let lastTenMessages = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.get('/status', (request, response) => {
    response.json({
        clients: clients.length, messages: lastTenMessages,
    })
});
app.listen(PORT, () => {
    console.log(`Message Events service listening at http://localhost:${PORT}`)
})

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
    lastTenMessages.forEach((item) => {
        const data = `data: ${JSON.stringify(item)}\n\n`;
        response.write(data);
    })

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        response
    };
    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

app.get('/events', eventsHandler);

function sendEventsToAll(newMessage) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newMessage)}\n\n`))
}

async function addMessage(request, response) {
    const newMessage = request.body;
    lastTenMessages = [...lastTenMessages.slice(-9), newMessage];
    response.status(204).end();
    return sendEventsToAll(newMessage);
}

app.post('/message', addMessage);