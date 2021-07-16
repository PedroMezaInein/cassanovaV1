import { Message, Done, Sending, Robot404, UserWarning, CommonLottie } from '../components/Lottie/'
import React from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { QuestionBoy, UploadingFile } from '../assets/animate'
import { ItemSlider } from '../components/singles'

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
        }
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

export function deleteAlert(title,text,action, text_button) {
    MySwal.fire({
        title: title,
        text:text,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: text_button? text_button: 'ELIMINAR',
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

export function createAlertSA2WithCloseAndHtml(html, action, cancel) {
    MySwal.fire({
        html: html,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ACEPTAR',
        cancelButtonText: 'CANCELAR',
        reverseButtons: true,
    }).then((result) => {
        if(result.dismiss)
            cancel()
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

export function confirmarCita(title, form, lead, action, e, name) {
    let fecha = new Date(form.fecha)
    let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    let days = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18','19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
    fecha = days[fecha.getDate()]  + "/" + months[fecha.getMonth()] + "/" + fecha.getFullYear()
    
    function reunion(){
        switch (form.lugar) {
            case 'presencial':
                switch (form.cita_empresa) {
                    case 'si_empresa':
                        return lead?lead.empresa.name:""
                    case 'no_empresa':
                        return form.ubicacion
                    default:
                        break;
                }
            break;
            case 'remota':
                return form.url
            default:
            break;
        }
    }
    
    function reunionPR(){
        switch (form.lugar) {
            case 'presencial':
                return 'LA CITA ES PRESENCIAL EN:'
            case 'remota':
                return 'URL DE LA CITA REMOTA:'
            default:
            break;
        }
    }
    function correos(){
        var temp = "";
        var array = form.correos
        if(array.length ===0){
            temp='-'
        }else{
            for(var i= 0; i < array.length; i++) {
                if(array.length === 1){
                    temp += array[i];
                }else{
                    temp += '&#8226 ' + array[i] + '<br>';
                }
            }
        }
        return temp
    }

    MySwal.fire({
        title: title,
        html:  `
                ${form.agendarCita ? 
                    `
                    <div class="px-4 font-size-13px">
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2 mt-3">
                            <div class="col-md-6 font-weight-bold pr-1">NOMBRE DE LA REUNIÓN:</div>
                            <div class="col-md-6 font-weight-light pl-1">${form.titulo?form.titulo:'-'}</div>
                        </div>
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2">
                            <div class="col-md-6 font-weight-bold pr-1">${reunionPR()}</div>
                            <div class="col-md-6 font-weight-light pl-1">${reunion()}</div>
                        </div>
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2">
                            <div class="col-md-6 font-weight-bold pr-1">FECHAL:</div>
                            <div class="col-md-6 font-weight-light pl-1">${fecha}</div>
                        </div>
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2">
                            <div class="col-md-6 font-weight-bold pr-1">HORA DE INICIO:</div>
                            <div class="col-md-6 font-weight-light pl-1">${form.hora_inicio}:${form.minuto_inicio}</div>
                        </div>
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2">
                            <div class="col-md-6 font-weight-bold pr-1">HORA FINAL:</div>
                            <div class="col-md-6 font-weight-light pl-1">${form.hora_final}:${form.minuto_final}</div>
                        </div>
                        <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center">
                            <div class="col-md-6 font-weight-bold pr-1">Correo(s):</div>
                            <div class="col-md-6 font-weight-light pl-1">${correos()}</div>
                        </div>
                    </div>
                    `
                    :
                        (form.agendarLlamada ? 
                            `
                            <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2 mt-3 font-size-13px">
                                <div class="col-md-4 font-weight-bold pr-1">FECHAL:</div>
                                <div class="col-md-3 font-weight-light pl-1 text-center">${fecha}</div>
                            </div>
                            <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2 font-size-13px">
                                <div class="col-md-4 font-weight-bold pr-1">HORA DE INICIO:</div>
                                <div class="col-md-3 font-weight-light pl-1 text-center">${form.hora_inicio}:${form.minuto_inicio}</div>
                            </div>
                            <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center font-size-13px">
                                <div class="col-md-4 font-weight-bold pr-1">HORA FINAL:</div>
                                <div class="col-md-3 font-weight-light pl-1 text-center">${form.hora_final}:${form.minuto_final}</div>
                            </div>
                            `
                        :
                            `
                            <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2 mt-3 font-size-13px">
                                <div class="col-md-4 font-weight-bold pr-1">FECHAL:</div>
                                <div class="col-md-3 font-weight-light pl-1 text-center">${fecha}</div>
                            </div>
                            <div class="row row-paddingless form-group-marginless text-left d-flex justify-content-center mb-2 font-size-13px">
                                <div class="col-md-4 font-weight-bold pr-1">HORA:</div>
                                <div class="col-md-3 font-weight-light pl-1 text-center">${form.hora}:${form.minuto}</div>
                            </div>
                            `
                        )
                }
            `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ENVIAR",
        cancelButtonText: "CANCELAR",
        reverseButtons: true,
    }).then((result) => {
        var elementsInvalid = document.getElementById(name).getElementsByClassName("is-invalid");
        if (elementsInvalid.length === 0) {
            if (result.value) {
                action()
            }
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
    })
}

export function questionAlertY(title, text, action, cancel) {
    MySwal.fire({
        title: title,
        text: text,
        //icon: "question",
        //iconHtml: <CommonLottie animationData = { QuestionBoy } />,
        html: <div>
            <div className="row mx-0 justify-content-center">
                <div className="col-md-8">
                    <CommonLottie animationData = { QuestionBoy } />
                </div>
            </div>
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
            cancelButton:'btn-light-gray-sweetalert2'
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
            cancelButton: 'bg-transparent bg-hover-danger text-danger text-hover-white', 
            confirmButton: 'bg-transparent bg-hover-primary text-primary text-hover-white',
            actions: 'd-flex justify-content-between px-0 mt-0'
        }
    }).then((result) => {
        if(result.dismiss)
            cancel()
        else
            if(result.value)
                success()
    })
}

export function steps(action) {
    const steps = ['1', '2']
    const textQuestion = ['¿EL FORMULARIO SE LLENÓ POR MEDIO DE UNA LLAMADA?', '¿DESEAS ENVIAR EL CUESTIONARIO DE PROYECTO?']
    const swalQueueStep = Swal.mixin({
        confirmButtonText: 'SIGUIENTE',
        cancelButtonText: 'REGRESAR',
        progressSteps: steps,
        input: 'radio',
        inputOptions: {
            SI: 'SI',
            NO: 'NO'
        },
        inputAttributes: {
            required: true
        },    
        reverseButtons: true,
        customClass: {
            validationMessage:'width-content-validation',
            title:'mt-4'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'NECESITAS ELEGIR UNA OPCIÓN'
            }
        }
    })
    async function backAndForth () {
        const values = []
        let currentStep
        for (currentStep = 0; currentStep < steps.length;) {
            const result = await swalQueueStep.fire({
                title: textQuestion[currentStep],
                inputValue: values[currentStep],
                showCancelButton: currentStep > 0,
                currentProgressStep: currentStep
            })
            if (result.value) {
                values[currentStep] = result.value
                currentStep++
            } else if (result.dismiss === 'cancel') {
                currentStep--
            } else {
            break
            }
        }
        if (currentStep === steps.length) {
            Swal.fire({
                title: '¿ESTÁS SEGURO DE TUS RESPUESTAS?',
                html: `
                    <div class="form-group row row-paddingless form-group-marginless mt-4">
                        <div class="col-md-12 font-weight-light text-center font-size-lg">
                            ¿EL FORMULARIO SE LLENÓ POR MEDIO DE UNA LLAMADA?
                            <div class="font-weight-boldest">${values[0]}</div>
                        </div>
                    </div>
                    <div class="row row-paddingless form-group-marginless">
                        <div class="col-md-12 font-weight-light text-center font-size-lg">
                            ¿DESEAS ENVIAR EL CUESTIONARIO DE PROYECTO?
                            <div class="font-weight-boldest">${values[1]}</div>
                        </div>
                    </div>
                `,
                confirmButtonText: 'ENVIAR'
            }).then((result) => {
                if (result.value) {
                    action(values)
                }
            })
        }
        
    }
    backAndForth()
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

export const printResponseErrorAlert = (error) => {
    if(error.message === 'Network Error')
        errorAlert('Ocurrió un error en el servidor, vuelve a intentar en 5 minutos.')
    else{
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
}