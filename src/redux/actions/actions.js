import axios from 'axios';

export const GET_USER = 'GET_USER';


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