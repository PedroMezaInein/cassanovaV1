import axios from 'axios';

export const GET_USER = 'GET_USER';
export const GET_OPTIONS = 'GET_OPTIONS';
export const SAVE_OPTIONS = 'SAVE_OPTIONS';
export const GET_VEHICULOS = 'GET_VEHICULOS'

export const SAVE_OPTIONS_PRESUPUESTOS = 'SAVE_OPTIONS_PRESUPUESTOS'

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