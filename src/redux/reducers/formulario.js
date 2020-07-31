const initialState = {
    form: {},
    page: ''
}

//Actions Type
const SAVE = 'AUTO_SAVE'
const DELETE = 'DELETE_FORM'

//Action creator
export const save = payload => ({
    type: SAVE,
    payload
})
export const deleteForm = () => ({
    type: DELETE
})

//Reducer
//Todos los reducer deben retornar estados inmutables
//Pregunta si el estado cambio
export default function(state = initialState, action){
    switch(action.type){
        case SAVE:
            return action.payload
        case DELETE:
            return initialState
        default:
            return state;
    }
}