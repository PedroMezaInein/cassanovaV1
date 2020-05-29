import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import * as _redux from "./redux";

/* import './index.css';
import "./index.scss";    */
import App from './App'; 
/* import "./_metronic/_assets/plugins/keenthemes-icons/font/ki.css"; */
/* import "socicon/css/socicon.css"; */
import "@fortawesome/fontawesome-free/css/all.min.css";
/* import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css"; */ 
import "react-datepicker/dist/react-datepicker.css";
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

/* import {
  MetronicLayoutProvider,
  MetronicSplashScreenProvider,
  MetronicSubheaderProvider
} from "./_metronic/layout";
import {MetronicI18nProvider} from "./_metronic/i18n"; */
const { PUBLIC_URL } = process.env;
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
    </Provider>  ,	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();