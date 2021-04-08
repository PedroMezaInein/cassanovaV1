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

export function printSwalHeader(tipo){
    switch(tipo){
        case 'estatusCompra':
            return 'EDITAR EL ESTATUS DE COMPRA'
        case 'tipoPago':
            return 'EDITAR EL TIPO DE PAGO'
        case 'tipoImpuesto':
            return 'EDITAR EL IMPUESTO'
        case 'descripcion':
            return 'EDITAR LA DESCRIPCIÓN'
        case 'fecha':
            return 'EDITAR LA FECHA'
        case 'proyecto':
            return 'EDITAR EL PROYECTO'
        case 'nombre':
            return 'EDITAR EL NOMBRE'
        case 'cliente':
            return 'EDITAR EL CLIENTE'
        case 'empresa':
            return 'EDITAR LA EMPRESA'
        case 'monto':
            return 'EDITAR EL MONTO CON IVA'
        case 'tipo_contrato':
            return 'EDITAR EL TIPO DE CONTRATO'
        case 'fecha_inicio':
            return 'EDITAR LA FECHA DE INCIO'
        case 'fecha_fin':
            return 'EDITAR LA FECHA FINAL'
        case 'proveedor':
            return 'EDITAR EL PROVEEDOR'
        case 'subpartida':
            return 'EDITAR LA SUBPARTIDA'
        case 'unidad':
            return 'EDITAR LA UNIDAD'
        case 'costo':
            return 'EDITAR EL COSTO'
        case 'materiales':
            return 'EDITAR EL MATERIAL'
        case 'rendimiento':
            return 'EDITAR EL RENDIMIENTO'
        case 'modelo':
            return 'EDITAR EL MODELO'
        case 'serie':
            return 'EDITAR LA SERIE'
        case 'name':
            return 'EDITAR EL NOMBRE'
        case 'razonSocial':
            return 'EDITAR LA RAZÓN SOCIAL'
        case 'rfc':
            return 'EDITAR EL RFC'
        default:
            return ''
    }
}