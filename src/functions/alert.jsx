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
    swal({
        title: '¡UN MOMENTO!',
        text: 'LA INFORMACIÓN ESTÁ SIENDO PROCESADA.',
        buttons: false,
        content: sending
    })
}

export async function doneAlert(texto) {
    swal({
        title: 'FELICIDADES 🥳!',
        text: texto,
        buttons: false,
        timer: 2500,
        content: done
    })
}

export function errorAlert(text) {
    swal({
        title: 'UPS 😕!',
        text: text,
        icon: 'error',
    })
}

export function deleteAlert(text, action) {
    swal({
        title: text,
        buttons: {
            cancel: {
                text: "CANCELAR",
                value: null,
                visible: true,
                className: "button__green btn-primary cancel",
                closeModal: true,
            },
            confirm: {
                text: "ACEPTAR",
                value: true,
                visible: true,
                className: "button__red btn-primary",
                closeModal: true
            }
        }
    }).then((result) => {
        if (result) {
            action()
        }
    })
}


export function createAlert(title, text, action) {
    swal({
        title: title,
        text: text,
        buttons: {
            cancel: {
                text: "CANCELAR",
                value: null,
                visible: true,
                className: "btn btn-light-danger",
                closeModal: true,
            },
            confirm: {
                text: "ACEPTAR",
                value: true,
                visible: true,
                className: "btn btn-light-primary",
                closeModal: true
            }
        }
    }).then((result) => {
        if (result) {
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
    swal({
        title: '¡Ups 😕!',
        text: 'PARECE QUE NO HAS INICIADO SESIÓN',
        icon: 'warning',
        confirmButtonText: 'INICIA SESIÓN'
    });
}

export function validateAlert(success, e, name) {
    var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
    if (elementsInvalid.length === 0) {
        success(e)
    } else {
        swal({
            title: '¡Lo sentimos!',
            text: 'Llena todos los campos requeridos',
            icon: 'warning',
            timer: 1500,
            buttons: false
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
