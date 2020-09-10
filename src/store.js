// store.js

import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';

import rootReducer from './reducers/index';

const loggerMiddleware = createLogger();

// create an object for the default data

// const defaultState = {
// 	app: {
//     geneiscool: true
// 	}
// };

const store = createStore(
	rootReducer,
	// defaultState,
	applyMiddleware(
		loggerMiddleware
	)
);

export default store;