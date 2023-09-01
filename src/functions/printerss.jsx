import moment from 'moment'
import React from 'react'
 
const printContactCount = (contactos) => {
    
    let sizeContactado = 0
    let sizeNoContactado = 0
    
    contactos.forEach((contacto) => {
        if(contacto.success){ sizeContactado++ }
        else{ sizeNoContactado++ }
    })
    
    return(
        <div className="w-auto d-flex flex-column mx-auto mb-8">
            <div className="bg-light-warning p-4 rounded-xl flex-grow-1 align-self-center">
                <div className="d-flex align-items-center justify-content-center font-size-lg font-weight-light mb-2">
                    TOTAL DE CONTACTOS:<span className="font-weight-boldest ml-2"><u>{contactos.length}</u></span>
                </div>
                <div id="symbol-total-contactos">
                    <span>
                        <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                            <span className="symbol-label">
                                <i className="fas fa-user-check text-success font-size-13px"></i>
                            </span>
                        </span>
                        <span className="font-size-sm font-weight-bolder">
                            <span className="font-size-lg">{sizeContactado}</span>
                            <span className="ml-2 font-weight-light">{sizeContactado <= 1 ? 'Contacto' : 'Contactados'}</span>
                        </span>
                    </span>
                    <span className="ml-4">
                        <span className="symbol symbol-circle symbol-white symbol-30 flex-shrink-0 mr-2">
                            <span className="symbol-label">
                                <i className="fas fa-user-times text-danger font-size-13px"></i>
                            </span>
                        </span>
                        <span className="font-size-sm font-weight-bolder">
                            <span className="font-size-lg">{sizeNoContactado}</span>
                            <span className="ml-2 font-weight-light">Sin respuesta</span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    )
}

const printDates = (fecha1, fecha2) => {
    let fechaInicio = ''
    let fechaFin = ''
    if(fecha2 === null){
        fechaInicio = moment(fecha1);
        fechaFin = moment(fecha1);
    }else{
        fechaInicio = moment(fecha1);
        fechaFin = moment(fecha2);
    }
    let diffFechas = fechaFin.diff(fechaInicio, 'days')
    if(diffFechas === 0)
        return(
            <span>
                {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}
            </span>
        )
    else
        return(
            <span>
                {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}  - {fechaFin.format('D')}/{fechaFin.format('MM')}/{fechaFin.format('YYYY')}
            </span>
        )
}

const printDireccion = (dato) => {
    let texto = ''
    if(dato.calle){
        texto += dato.calle
        if(dato.colonia)
            texto += ` ${dato.colonia}`
        if(dato.municipio)
            texto += `, ${dato.municipio}`
        if(dato.estado)
            texto += ` ${dato.estado}`
        if(dato.cp)
            texto += `,cp ${dato.cp}`
        return texto
    } else{
        return 'Sin especificar'
    }
}

export { printContactCount, printDates, printDireccion }