import axios from 'axios'
import { URL_DEV } from '../constants'
import { setSingleHeader } from './routers'
import { errorAlert } from './alert'
import store from '../redux/store/store';

export const apiDelete = async(url, at) => {
    return axios.delete(`${URL_DEV}${url}`, { headers: setSingleHeader(at) })
}

export const apiOptions = async(url, at) => {
    return await axios.options(`${URL_DEV}${url}`, { headers: setSingleHeader(at) })
}

export const apiPutForm = async(url, form, at) => {
    return await axios.put(`${URL_DEV}${url}`, form, { headers: setSingleHeader(at) })
}

export const apiPostForm = async(url, form, at) => {
    return await axios.post(`${URL_DEV}${url}`, form, { headers: setSingleHeader(at) })
}

export const apiGet = async(url, at) => {
    return await axios.get(`${URL_DEV}${url}`, { headers: setSingleHeader(at) })
}

// export function apiPostFormData(url, data, at){
//     return axios.post(`${URL_DEV}${url}`, data, { headers: setFormHeader(at) })
// }

export const catchErrors = (error, flag) => {
    let storing = store.getState();
    const { user } = storing.authUser
    if(flag === false){
        errorAlert(`Ocurrió un error desconocido, intenta refrescando la página`)
    }
    console.error(error, 'error')
    if(process.env.NODE_ENV === 'production'){
        axios.post(`https://hooks.zapier.com/hooks/catch/6874908/bhr9ezu/`,
            encodeForm({
                'error': error,
                'user': user.name,
                'date': new Date(),
                'url': window.location.href
            }), {headers: {'Accept': 'application/json'}}
        ).then(
            (response) => {
                console.error(`RESPONSE: `, response)
            }, (e) => {
                console.error(`Error: `, e)
            }
        )
    }
}

const encodeForm = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}