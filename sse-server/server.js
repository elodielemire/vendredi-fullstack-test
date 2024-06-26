const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
/** @type {express.Response[]} */
const clients = [];
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
    lastTenMessages.forEach(item => sendEvent(item, response))

    const clientId = Date.now();
    clients.push(response);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        const index = clients.indexOf(response);
        assert(index !== -1, 'client could not be dropped'); // throw an exception if the first param is false
        clients.splice(index, 1); // delete matching client
    });
}

app.get('/events', eventsHandler);

function sendEventsToAll(newMessage) {
    clients.forEach(client => sendEvent(newMessage, client))
}

function sendEvent(item, response, event) {
    if (event) {
        response.write(`event: ${event}\n`);
    }
    response.write(`data: ${JSON.stringify(item)}\n\n`);
}

function addMessage(request, response) {
    const newMessage = request.body;
    lastTenMessages = [...lastTenMessages.slice(-9), newMessage];
    response.status(204).end();
    return sendEventsToAll(newMessage);
}

app.post('/message', addMessage);

/**
 * @param {express.Request} request
 * @param {express.Response} response
 */
function deleteMessage(request, response) {
    const {messageId} = request.params;
    lastTenMessages = lastTenMessages.filter(message => message.id !== messageId);
    clients.forEach(client => sendEvent(messageId, client, "delete"));
    response.status(204).end();
}

app.delete('/:messageId', deleteMessage);