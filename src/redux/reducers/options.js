const initialState = {
    areas: [],
}

//Actions Type
const SaveOptions = 'SAVE_OPTIONS'
const GetOptions = 'GET_OPTIONS'

export default function (state = initialState, action) {
    switch (action.type) {
        case SaveOptions:
            return {
                ...state,
                areas: action.payload
            }
        case GetOptions:
            return initialState
        default:
            return state;
    }
}