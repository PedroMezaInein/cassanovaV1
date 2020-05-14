import swal from 'sweetalert'

export function waitAlert(){
    swal({
        title: '¡Un momento!',
        text: 'La información está siendo procesada.',
        buttons: false
    })
}

export function errorAlert(text){
    swal({
        title: '¡Ups 😕!',
        text: text,
        icon: 'error',
    })
}