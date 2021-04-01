import moment from 'moment'
import React from 'react'

export function printDates(fecha1, fecha2){
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