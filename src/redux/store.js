import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import messageReducer, {addMessage} from './articles/messageReducer';
import thunk from 'redux-thunk';

// TODO
const randomId = Math.floor(Math.random()*100);
const rootReducer = combineReducers({
    currentUserId: (state = randomId, action) => state,
    messages: messageReducer,
});

/** @type {typeof compose} */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;

const events = new EventSource('http://localhost:3001/events');
events.onmessage = (event) => {
    const message = JSON.parse(event.data);
    store.dispatch(addMessage(message));
};