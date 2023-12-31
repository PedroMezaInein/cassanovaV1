import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose  } from 'redux';
import reducer from '../reducers'
const composeEnhaners = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const loadState = () => {
    try {
        const serializedData = localStorage.getItem('state')
        if (serializedData === null){
            return undefined // Si no existe el state en el local storage devolvemos undefined para que cargue el state inicial que hayamos definido
        }
        return JSON.parse(serializedData) // Si encontramos con exito nuestro storage lo devolvemos.
    } catch (error) {
        return undefined // Si ocurre algun error, devuelvo undefined para cargar el state inicial.
    }
}

export const saveState = (state) => {    
    try {
        let serializedData = JSON.stringify(state)
        localStorage.setItem('state', serializedData)
    } catch (error) {
	    return undefined
    }
}

const store = createStore(reducer, loadState(), composeEnhaners(applyMiddleware(thunk)));
store.subscribe( function () {
    saveState(store.getState())
})

export default store