const initialState = {
    areas: [],
    vehiculos: [],
    presupuestos: [],
    departamentos: []
}

//Actions Type
const SaveOptions = 'SAVE_OPTIONS'
const GetOptions = 'GET_OPTIONS'
const GetVehiculos = 'GET_VEHICULOS';
const SAVE_OPTIONS_PRESUPUESTOS = 'SAVE_OPTIONS_PRESUPUESTOS'
const ADD_DEPARTAMENTOS = 'ADD_DEPARTAMENTOS'

export default function (state = initialState, action) {
    switch (action.type) {
        case SaveOptions:
            return {
                ...state,
                areas: action.payload
            }
        case SAVE_OPTIONS_PRESUPUESTOS:
            return {
                ...state,
                presupuestos: action.payload
            }
        case GetOptions:
            return initialState
        case GetVehiculos:
            return {
                ...state,
                vehiculos: action.payload
            }
        case ADD_DEPARTAMENTOS:
            return {
                ...state,
                departamentos: action.payload
            }
        default:
            return state;
    }
}