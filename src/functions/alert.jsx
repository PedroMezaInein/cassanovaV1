import swal from 'sweetalert'
import { Sending } from '../components/Lottie/'
import { Done } from '../components/Lottie/'
import ReactDOM from 'react-dom';
import React, { Component } from 'react'

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
        title: '¡Un momento!',
        text: 'La información está siendo procesada.',
        buttons: false,
        content: sending
    })
}

export async function doneAlert(texto) {
    swal({
        title: '¡Felicidades 🥳!',
        text: texto,
        buttons: false,
        timer: 2500,
        content: done
    })
}

export function errorAlert(text) {
    swal({
        title: '¡Ups 😕!',
        text: text,
        icon: 'error',
    })
}

export function deleteAlert(text, action) {
    swal({
        title: text,
        buttons: {
            cancel: {
                text: "Cancelar",
                value: null,
                visible: true,
                className: "button__green btn-primary cancel",
                closeModal: true,
            },
            confirm: {
                text: "Aceptar",
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
                text: "Cancelar",
                value: null,
                visible: true,
                className: "btn btn-light-danger",
                closeModal: true,
            },
            confirm: {
                text: "Aceptar",
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
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function questionAlert(title, text, action) {
    MySwal.fire({
        title: title,
        text: text,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "CANCELAR",
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
        confirmButtonText: "Enviar",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}


export function forbiddenAccessAlert() {
    swal({
        title: '¡Ups 😕!',
        text: 'Parece que no has iniciado sesión',
        icon: 'warning',
        confirmButtonText: 'Inicia sesión'
    });
}

export function validateAlert(success, e, name) {
    var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
    if (elementsInvalid.length === 0) {
        success(e)
    } else {
        alert("Rellena todos los campos")
    }
}

