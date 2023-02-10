const initialState = {
    areas: [],
    vehiculos: [],
}

//Actions Type
const SaveOptions = 'SAVE_OPTIONS'
const GetOptions = 'GET_OPTIONS'
const GetVehiculos = 'GET_VEHICULOS';

export default function (state = initialState, action) {
    switch (action.type) {
        case SaveOptions:
            return {
                ...state,
                areas: action.payload
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