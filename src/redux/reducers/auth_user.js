const initialState = {
    access_token: '',
    user: {}
}

//Actions Type
const LOGIN = 'USER LOGIN'
const LOGOUT = 'USER_LOGOUT'
const REGISTER = 'USER_REGISTER'

//Action creator
export const login = payload => ({
    type: LOGIN,
    payload
})
export const logout = () => ({
    type: LOGOUT
})
export const register = payload => ({
    type: REGISTER,
    payload
})

//Reducer
//Todos los reducer deben retornar estados inmutables
//Pregunta si el estado cambio
export default function(state = initialState, action){
    switch(action.type){
        case LOGIN:
            return action.payload
        case LOGOUT:
            return initialState
        case REGISTER:
            return action.payload
        default:
            return state;
    }
}