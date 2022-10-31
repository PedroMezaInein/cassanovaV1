import { Message, Done, Sending, Robot404, UserWarning, CommonLottie, PendingPayment } from '../components/Lottie/'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Trash, UploadingFile } from '../assets/animate'
import { ItemSlider } from '../components/singles'
import NumberFormat from 'react-number-format'

const MySwal = withReactContent(Swal)

const userWarningAlert = async(texto, confirmFunction, deniedFunction) => {
    MySwal.fire({
        title: '¡UPS!',
        html: <div>
                <p> {texto} </p>
                <UserWarning />
            </div>,
        showConfirmButton: true,
        confirmButtonText: 'Recargar',
        showDenyButton: true,
        denyButtonText: 'Regresar',
        showCancelButton: true,
        cancelButtonText: 'Continuar'
    }).then((result) => {
        const { isConfirmed, isDenied } = result
        if(isConfirmed)
            confirmFunction()
        if(isDenied)
            deniedFunction()
    })
}

async function waitAlert() {
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
        },
        timer: 4000,
    })
}

const sendFileAlert = ( elemento, action ) => {
    const { files, name } = elemento.target
    let element = files[0]
    MySwal.fire({
        title: '¿DESEAS CONFIRMAR EL ENVÍO DE ARCHIVOS?',
        html: 
            <div className = 'row mx-0 justify-content-center'>
                <div className="col-md-12 text-center py-2">
                    <div className="text-dark-75 font-weight-bolder font-size-lg">
                        Documento Adjuntado:
                    </div>
                    <div>
                        <a className="text-muted font-weight-bold text-hover-primary" target= '_blank' rel="noreferrer" href = {URL.createObjectURL(element)}>
                            {element.name}
                        </a>
                    </div>
                </div>
                <div className = 'col-8'>
                    <CommonLottie animationData = { UploadingFile } />
                </div>
            </div>,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: "SI, ENVIAR",
        cancelButtonText: 'CANCELAR',
    }).then((result) => {
        if (result.value) {
            action({
                target: { name: name, file: element}
            });
        }
    })
}

const showFilesAlert = (files, title) => {
    MySwal.fire({
        title: title,
        html: 
            <div className="row mx-0">
                <div className="col-md-12">
                    <ItemSlider items = { files } />
                </div>
            </div>,
        showCloseButton: true,
        showConfirmButton: false,
        target: 'table',
        customClass: {
            closeButton: 'm-3'
        }
    })
}

export{ userWarningAlert, waitAlert, sendFileAlert, showFilesAlert }

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

export async function doneAlert(texto, cancel) {
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
    }).then((result) => {
        if(result.dismiss){
            if(cancel)
                cancel()
        }
            
    })
}

export function errorAlert(text) {
    let newText = ''
    let cantidad = 0
    cantidad = text.split('\\n').length
    if(cantidad){
        text.split('\\n').forEach((element, index) => {
            newText += element.trim()
            if(index < cantidad - 1)
                newText += '<br />'
        })
    }else{ newText = text }
    MySwal.fire({
        title: '¡UPS!',
        html: newText,
        icon: 'error',
        customClass: { actions: 'd-none' }
    })
}

export function notFoundAlert(){
    MySwal.fire({
        title: '',
        html:
            <div>
                <Robot404 />
                <div className = 'text-center'>
                    <h1>
                        ¡UPS!
                    </h1>
                    <span>
                        Error 404
                    </span>
                </div>
            </div>,
        customClass: {
            actions: 'd-none'
        }
    })
}

export function errorAlertRedirectOnDissmis(text, history, ruta) {
    MySwal.fire({
        title: '¡Ups!',
        text: text,
        icon: 'error',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'CANCELAR',
        confirmButtonText: 'DIRECCIONAR',

    }).then((result) => {
        if(result.value)
            history.push({pathname: ruta})
    })
}

export function deleteAlert(title, text, action, text_button) {
    MySwal.fire({
        html: <div>
            <div className="col-md-8 mx-auto"><CommonLottie animationData = { Trash } /></div>
                
            <div className="col-md-12 font-weight-light text-center font-size-lg">
                {
                    text?
                    <div className="font-weight-bolder mb-3">{text}</div>
                    :<></>
                }
                {title}
            </div>
        </div>,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: text_button? text_button: 'SI, ELIMINAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
        customClass: {
            title:'d-none',
            htmlContainer:'m-0',
            confirmButton:'delete-confirm btn_custom-alert',
            cancelButton:'btn-cancel-alert'
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

export function createAlertSA2WithActionOnClose(title, text, action, closeAction) {
    MySwal.fire({
        title: title,
        text: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
        customClass: {
            content: text?text:'d-none',
            confirmButton: 'btn-light-primary-sweetalert2',
            cancelButton:'btn-light-gray-sweetalert2'
        }
    }).then((result) => {
        if(result.dismiss)
            closeAction()
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
        customClass: {
            content: text?text:'d-none'
        }
    }).then((result) => {
        if (result.value) {
            action()
        }
    })
}

export function questionAlertWithLottie(title, text, lottie, buttons, actions, btn_color, margin, margin_actions){
    MySwal.fire({
        html: <div className="font-family-poppins">
            { lottie ? <div className="col-md-10 mx-auto"><CommonLottie animationData = { lottie } /></div> : <></> }
            <div className={`col-md-12 font-weight-light text-center ${margin?margin:''}`}>
                <div className="font-weight-bolder font-size-h6 mb-5 mt-1">{title}</div>
                <div className="font-size-lg">{text}</div>
            </div>
        </div>,
        showCancelButton: buttons.cancel ? true : false,
        showConfirmButton: buttons.confirm ? true : false,
        confirmButtonText: buttons.confirm,
        cancelButtonText: buttons.cancel,
        reverseButtons: true,
        customClass: {
            icon: 'icono',
            title:'text-uppercase',
            content: text?text:'d-none',
            confirmButton: `btn_custom-alert ${btn_color?btn_color:'bg-success'}`,
            cancelButton:'btn-cancel-alert',
            htmlContainer:'d-contents',
            actions: margin_actions?margin_actions:''
        }
    }).then((result) => {
        if(actions.cancel){
            if(result.dismiss)
                actions.cancel()
        }
        if (result.value) {
            actions.success()
        }
    })
}
// btn-renovar-lic-confirm

export function questionAlertY(title, text, action, cancel) {
    MySwal.fire({
        title: title,
        text: text,
        //icon: "question",
        //iconHtml: <CommonLottie animationData = { QuestionBoy } />,
        html: <div>
            {/* <div className="row mx-0 justify-content-center">
                <div className="col-md-8">
                    <CommonLottie animationData = { QuestionBoy } />
                </div>
            </div> */}
            <div className="row row-paddingless form-group-marginless">
                <div className="col-md-12 font-weight-light text-center font-size-lg font-family-poppins">
                    {text}
                </div>
            </div>
        </div>,
        showCancelButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        reverseButtons: true,
        customClass: {
            icon: 'icono',
            title:'text-uppercase',
            content: text?text:'d-none',
            confirmButton: 'btn-light-success-sweetalert2',
            cancelButton:'btn-light-gray-sweetalert2',
            htmlContainer:'d-contents'
        }
    }).then((result) => {
        if(cancel){
            if(result.dismiss)
                cancel()
        }
        if (result.value) {
            action()
        }
    })
}
export function questionAlert2(title, text, action, html, dismiss) {
    MySwal.fire({
        title: title,
        text: text,
        // icon: "question",
        html: html,
        showCancelButton: true,
        confirmButtonText: "ENVIAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
    }).then((result) => {
        if(result.dismiss){
            if( typeof dismiss === 'function')
                dismiss()
        }
        if (result.value) {
            action()
        }
    })
}
export function customInputAlert(html, iconHtml, success, cancel, htmlClass){
    MySwal.fire({
        title: '',
        iconHtml: iconHtml,
        html: html,
        showCancelButton: true,
        confirmButtonText: "ENVIAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
        customClass: { 
            htmlContainer:`overflow-hidden ${htmlClass} `,
            confirmButton: 'btn-light-success-sweetalert2 p-2 font-size-13px w-90px',
            cancelButton:'btn-light-gray-sweetalert2 p-2 font-size-13px w-90px',
            actions: 'mt-3 mb-0'
        }
    }).then((result) => {
        if(result.dismiss)
            cancel()
        else
            if(result.value)
                success()
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

export function validateAlert2(success, e, name, tipo, enviar) {
    var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
    if (enviar) { 
        if (elementsInvalid.length === 0) {
        success(e, tipo)
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
    } else {
        success(e, tipo)
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

export const printResponseErrorAlert = (error) => {
    Swal.close()
    setTimeout(function(){ 
        if(error.message === 'Network Error'){
            errorAlert('Ocurrió un error en el servidor, vuelve a intentar en 5 minutos.')
        }else{
            switch(error.response.status){
                case 401:
                    forbiddenAccessAlert()
                    break
                case 404:
                    notFoundAlert()
                    break
                default:
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                    break
            }
        }
    }, 50);
}

export function pendingPaymentAlert(title, text) {
    MySwal.fire({
        title: title,
        text:text,
        html: <div>
            <div className="row mx-0 justify-content-center">
                <PendingPayment animationData = { Trash } />
            </div>
            <div className="col-md-12 font-weight-light text-center font-size-lg font-family-poppins mt-6">
                EL PAGO PENDIENTE ES DE
                <NumberFormat
                    value={text}
                    displayType={'text'}
                    thousandSeparator={true}
                    prefix={'$'}
                    renderText={value => <span className="font-weight-bolder" style={{color:'#83b0c3'}}> {value}</span>}
                />
            </div>
        </div>,
        showCancelButton: true,
        cancelButtonText: 'CERRAR',
        customClass: {
            content: 'mt-0',
            actions: 'mb-0',
            confirmButton: 'd-none',
            title:'mt-4 letter-spacing-0-4',
            cancelButton: 'btn-pending-payment-sweetalert2',
        }
    })
}

export function htmlLottieTimer(html) {
    MySwal.fire({
        html: html,
        timer: 8000
    });
}