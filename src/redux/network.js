import {receiveMessage} from "./articles/messageReducer";

const BASE_URL = 'http://localhost:3001';

/** @type {import('redux').Middleware} **/
export const middleware = store => next => {
    const events = new EventSource(`${BASE_URL}/events`);
    events.onmessage = (event) => {
        const message = JSON.parse(event.data);
        store.dispatch(receiveMessage(message));
    };

    events.onerror = () => {
        console.error('Error on server side')
        events.close()
    }

    return action => {
        if (action.type === 'SEND_MESSAGE') {
            const message = action.payload;
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(message)
            }
            const result = fetch(`${BASE_URL}/message`, options);
            // Let it flow in the middleware pipeline, we don’t want to intercept it, just POST the message.
            next(action);
            // Let the caller deal with error handling
            return result;
        }

        return next(action);
    }
}
