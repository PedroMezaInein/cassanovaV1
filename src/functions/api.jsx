import axios from 'axios'
import { URL_DEV } from '../constants'
import { setSingleHeader } from './routers'
import { errorAlert } from './alert'

export function apiDelete(url, at){
    return axios.delete(`${URL_DEV}${url}`, { headers: setSingleHeader(at) })
}

export async function apiOptions(url, at){
    return await axios.options(`${URL_DEV}${url}`, { headers: setSingleHeader(at) })
}

export function catchErrors(error, flag){
    if(flag === false){
        errorAlert(`Ocurrió un error desconocido, intenta refrescando la página`)
    }
    console.error(error, 'error')
    if(process.env.NODE_ENV === 'production' || true){
        axios.post(`https://hooks.zapier.com/hooks/catch/6874908/bhr9ezu/`,
        encodeForm({
            'error': error,
            'date': new Date(),
            'url': window.location.href
        }), {headers: {'Accept': 'application/json'}}
            ).then(
            (response) => {
                console.log(`RESPONSE: `, response)
            }, (e) => {
                console.log(`Error: `, e)
            }
        )
    }
}

const encodeForm = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}