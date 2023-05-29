import axios from 'axios';

export const GET_USER = 'GET_USER';
export const GET_OPTIONS = 'GET_OPTIONS';
export const SAVE_OPTIONS = 'SAVE_OPTIONS';
export const GET_VEHICULOS = 'GET_VEHICULOS'
export const ADD_DEPARTAMENTOS = 'ADD_DEPARTAMENTOS'
export const SAVE_OPTIONS_PRESUPUESTOS = 'SAVE_OPTIONS_PRESUPUESTOS'
export const SAVE_OPTIONS_VENTAS = 'SAVE_OPTIONS_VENTAS'
export const SAVE_OPTIONS_INGRESOS = 'SAVE_OPTIONS_INGRESOS'
export const SAVE_OPTIONS_COMPRAS = 'SAVE_OPTIONS_COMPRAS'
export const SAVE_OPTIONS_PROYECTOS = 'SAVE_OPTIONS_PROYECTOS'


export function getUser(id) {
    return async function(dispatch){
        try {
            let user = await axios.get(`http://localhost:3001/user/${id}`)
            return dispatch({
                type: GET_USER,
                payload: user.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function SaveOptionsAreas(areas) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS,
            payload: areas
        })
    }
}


export function saveOptionsVehiculos(vehiculos) {
    return async function (dispatch) {
        return dispatch({
            type: GET_VEHICULOS,
            payload: vehiculos
        })
    }
}

export function SaveOptionsPresupuestos(presupuestos) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS_PRESUPUESTOS,
            payload: presupuestos
        })
    }
}

export function Departamentos(departamentos) {
    return async function (dispatch) {
        return dispatch({
            type: ADD_DEPARTAMENTOS,
            payload: departamentos
        })
    }
}

export function Ventas(ventas) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS_VENTAS,
            payload: ventas
        })
    }
}

export function Ingresos(ingresos) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS_INGRESOS,
            payload: ingresos
        })
    }
}

export function Compras(compras) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS_COMPRAS,
            payload: compras
        })
    }
}

export function Proyectos(proyectos) {
    return async function (dispatch) {
        return dispatch({
            type: SAVE_OPTIONS_PROYECTOS,
            payload: proyectos
        })
    }
}