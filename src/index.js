import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import reducer from './redux/reducers';
import { createStore, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss'
import thunk from 'redux-thunk'
import { loadState, saveState } from './redux/store/store'
const history =  createHistory()

const initialData = loadState()

const store = createStore(reducer, initialData, applyMiddleware(thunk));
store.subscribe( function () {
    saveState(store.getState())
})

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <App history={history}/>
        </Router>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
