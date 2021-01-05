import { Sending } from '../components/Lottie/'
import { Done } from '../components/Lottie/'
import { Message } from '../components/Lottie/'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export async function waitAlert() {
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
    /* let fecha = new Date()
    console.log(fecha.getMonth())
    if(fecha.getMonth() === 11)
        MySwal.fire({
            title: '¡UN MOMENTO!',
            html:
                <div>
                    <p>
                        LA INFORMACIÓN ESTÁ SIENDO PROCESADA
                    </p>
                    <SendingDecember />
                </div>,
            customClass: {
                actions: 'd-none'
            }
        })
    else{
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
    } */
}

export async function commentAlert() {
    MySwal.fire({
        title: '¡UN MOMENTO!',
        html:
            <div>
                <p>
                    SE ESTÁ ENVIANDO TU COMENTARIO
                </p>
                <Message />
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

export function deleteAlert(title,text,action) {
    MySwal.fire({
        title: title,
        text:text,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'ELIMINAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
        customClass: {
            content: text?'':'d-none',
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
