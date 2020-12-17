import swal from 'sweetalert'
import { Sending } from '../components/Lottie/'
import { Done } from '../components/Lottie/'
import ReactDOM from 'react-dom';
import React from 'react'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

let wrapperSending = document.createElement('div');
ReactDOM.render(<Sending />, wrapperSending);
let sending = wrapperSending.firstChild;

let wrapperDone = document.createElement('div');
ReactDOM.render(<Done />, wrapperDone);
let done = wrapperDone.firstChild;

export async function waitAlert() {
    /* swal({
        title: '¡UN MOMENTO!',
        text: 'LA INFORMACIÓN ESTÁ SIENDO PROCESADA.',
        buttons: false,
        content: sending
    }) */
    MySwal.fire({
        title: '¡UN MOMENTO!',
        html:
            <div>
                <p>
                    LA INFORMACIÓN ESTÁ SIENDO PROCESADA
                </p>
                <Sending />
            </div>,
        customClass: {
            actions: 'd-none'
        }
    })
}

export async function doneAlert(texto) {
    MySwal.fire({
        title: '¡FELICIDADES!',
        html:
            <div>
                <p>
                    {texto}
                </p>
                <Done />
            </div>,
        customClass: {
            actions: 'd-none'
        },
        timer: 2500,
    })
    /* swal({
        title: '¡FELICIDADES!',
        text: texto,
        buttons: false,
        timer: 2500,
        content: done
    }) */
}

export function errorAlert(text) {
    Swal.fire({
        title: '¡UPS!',
        text: text,
        icon: 'error',
        customClass: {
            actions: 'd-none'
        }
    })
}

export function deleteAlert(text, action) {
    MySwal.fire({
        title: text,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        customClass: {
            content: 'd-none',
            confirmButton: 'btn-light-danger-sweetalert2',
            cancelButton:'btn-light-gray-sweetalert2'
        }
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function createAlert(title, text, action) {
    MySwal.fire({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
        customClass: {
            content: text?text:'d-none',
            confirmButton: 'btn-light-success-sweetalert2',
            cancelButton:'btn-light-gray-sweetalert2'
        }
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function createAlertSA2(title, text, action) {
    MySwal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function createAlertSA2WithClose(title, text, action, history, ruta) {
    MySwal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
    }).then((result) => {
        if(result.dismiss)
            history.push({pathname: ruta})
        else
            if (result.value) {
                action()
            }
    })
}

export function createAlertSA2Parametro(title, text, action, parametro) {
    MySwal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action(parametro)
        }
    })
}

export function deleteAlertSA2Parametro(title, text, action, parametro) {
    MySwal.fire({
        title: title,
        text: text,
        icon: 'delete',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action(parametro)
        }
    })
}

export function questionAlert(title, text, action) {
    MySwal.fire({
        title: title,
        text: text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ENVIAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function questionAlertY(title, text, action) {
    MySwal.fire({
        title: title,
        text: text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function questionAlert2(title, text, action, html) {
    MySwal.fire({
        title: title,
        text: text,
        icon: "question",
        html: html,
        showCancelButton: true,
        confirmButtonText: "ENVIAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function errorAdjuntos(title, text, html) {
    MySwal.fire({
        title: title,
        icon: "error",
        html: text+':</br></br><div class="text-center"><b>'+html+'</b></div>',
        showCancelButton: false,
        showConfirmButton: true,
        reverseButtons: false,
        timer: 5000
    });
}

export function forbiddenAccessAlert() {
    Swal.fire({
        title: '¡UPS 😕!',
        text: 'PARECE QUE NO HAS INICIADO SESIÓN',
        icon: 'warning',
        showConfirmButton: false,
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'INICIAR SESIÓN',
        customClass: {
            cancelButton: 'btn btn-light-danger',
            closeButton: 'd-none'
        }
    })
}

export function validateAlert(success, e, name) {
    var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
    if (elementsInvalid.length === 0) {
        success(e)
    } else {
        Swal.fire({
            title: '¡LO SENTIMOS!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            customClass: {
                actions: 'd-none'
            },
            timer: 2500,
        })
    }
}

export function messageAlert(text) {
    MySwal.fire({
        title: text,
        text:'VUELVE A INTENTARLO',
        icon: "warning",
        confirmButtonColor:'#B5B5C3'
    })
}
