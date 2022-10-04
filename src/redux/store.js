import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import { middleware as networkMiddleware } from "./network";
import messageReducer from './articles/messageReducer';

// TODO
const randomId = Math.floor(Math.random()*100);
const rootReducer = combineReducers({
    currentUserId: (state = randomId, action) => state,
    messages: messageReducer,
});

/** @type {typeof compose} */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, networkMiddleware)));

export default store;
