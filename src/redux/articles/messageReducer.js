import {v4 as uuidv4} from "uuid";

const INITIAL_STATE = [];

export default function messageReducer (state= INITIAL_STATE, action) {
    switch (action.type) {
        case "SEND_MESSAGE":
        case "RECEIVE_MESSAGE":
            const newMessage = action.payload;
            // To avoid adding sent messages again
            if (state.find(message => message.id === newMessage.id)) return state;

            return [...state, newMessage];

        case "DELETE_MESSAGE":
        case "RECEIVE_DELETION_REQUEST":
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
    return dispatch({
        type: 'SEND_MESSAGE',
        payload: message
    });
}

export const receiveMessage = message => ({
    type: 'RECEIVE_MESSAGE',
    payload: message
});

export const deleteMessage = id => ({
    type: 'DELETE_MESSAGE',
    payload: id
});

export const receiveDeletionRequest = id => ({
    type: 'RECEIVE_DELETION_REQUEST',
    payload: id
});
