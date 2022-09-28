import {v4 as uuidv4} from "uuid";

const INITIAL_STATE = [];

export default function messageReducer (state= INITIAL_STATE, action) {
    switch (action.type) {
        case "ADDMESSAGE":
            const newMessage = action.payload;
            // To avoid adding sent messages again
            if (state.find(message => message.id === newMessage.id)) return state;

            return [...state, newMessage];

        case "DELETEMESSAGE":
            return state.filter(message => message.id !== action.payload);
        default:
            return state;
    }
}

export const sendMessage = text => (dispatch, getState) => {
    const state = getState();
    const message = {
        text,
        id: uuidv4(),
        senderId: state.currentUserId
    }
    dispatch(addMessage(message));

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(message)
    }

    // TODO handle error case
    fetch('http://localhost:3001/message', options);
}

export const addMessage = message => ({
    type: 'ADDMESSAGE',
    payload: message
});

export const deleteMessage = id => ({
    type: 'DELETEMESSAGE',
    payload: id
});
