import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from 'react';
import ReactDOM from 'react-dom';
// import * as _redux from "./redux";
import App from './App'; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-datepicker/dist/react-datepicker.css";
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss'
import store from './redux/store/store' 

// const { PUBLIC_URL } = process.env;
const history = createBrowserHistory();

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