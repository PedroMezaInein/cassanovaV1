const initialState = {
    areas: [],
    vehiculos: [],
    presupuestos: [],
    departamentos: [],
    ventas: [],
    ingresos: [],
    compras: [],
    proyectos: [],
    empresas: [],
    empresa: [],
    proveedores: [],
    clientes: [],
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
const SAVE_OPTIONS_EMPRESAS = 'SAVE_OPTIONS_EMPRESAS'
const SAVE_OPTIONS_EMPRESA = 'SAVE_OPTIONS_EMPRESA'
const SAVE_OPTIONS_PROVEEDORES = 'SAVE_OPTIONS_PROVEEDORES'
const SAVE_OPTIONS_CLIENTES = 'SAVE_OPTIONS_CLIENTES'



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
        case SAVE_OPTIONS_EMPRESAS:
            return {
                ...state,
                empresas: action.payload
            }
        case SAVE_OPTIONS_PROVEEDORES:
            return {
                ...state,
                proveedores: action.payload
            }
        case SAVE_OPTIONS_EMPRESA:
            return {
                ...state,
                empresa: action.payload
            }
        case SAVE_OPTIONS_CLIENTES:
            return {
                ...state,
                clientes: action.payload
            }
        default:
            return state;
    }
}