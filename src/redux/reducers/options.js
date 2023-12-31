const initialState = {
    areas: [],
    vehiculos: [],
    presupuestos: [],
    departamentos: [],
    ventas: [],
    ingresos: [],
    compras: [],
    proyectos: [],
}

//Actions Type
const SaveOptions = 'SAVE_OPTIONS'
const GetOptions = 'GET_OPTIONS'
const GetVehiculos = 'GET_VEHICULOS';
const SAVE_OPTIONS_PRESUPUESTOS = 'SAVE_OPTIONS_PRESUPUESTOS'
const ADD_DEPARTAMENTOS = 'ADD_DEPARTAMENTOS'
const SAVE_OPTIONS_VENTAS = 'SAVE_OPTIONS_VENTAS'
const SAVE_OPTIONS_INGRESOS = 'SAVE_OPTIONS_INGRESOS'
const SAVE_OPTIONS_COMPRAS = 'SAVE_OPTIONS_COMPRAS'
const SAVE_OPTIONS_PROYECTOS = 'SAVE_OPTIONS_PROYECTOS'

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
        case SAVE_OPTIONS_VENTAS:
            return {
                ...state,
                ventas: action.payload
            }
        case SAVE_OPTIONS_INGRESOS:
            return {
                ...state,
                ingresos: action.payload
            }
        case SAVE_OPTIONS_COMPRAS:
            return {
                ...state,
                compras: action.payload
            }
        case SAVE_OPTIONS_PROYECTOS:
            return {
                ...state,
                proyectos: action.payload
            }
        default:
            return state;
    }
}