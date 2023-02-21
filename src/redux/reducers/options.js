const initialState = {
    areas: [],
    vehiculos: [],
    presupuestos: []
}

//Actions Type
const SaveOptions = 'SAVE_OPTIONS'
const GetOptions = 'GET_OPTIONS'
const GetVehiculos = 'GET_VEHICULOS';
const SAVE_OPTIONS_PRESUPUESTOS = 'SAVE_OPTIONS_PRESUPUESTOS'

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
        default:
            return state;
    }
}