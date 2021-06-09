import moment from 'moment'
import React from 'react'
import { replaceAll } from './functions'

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
            return 'EDITAR EL MONTO'
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
        case 'contacto':
            return 'EDITAR EL CONTACTO'
        case 'status':
            return 'EDITAR EL ESTATUS'
        case 'tipo':
            return 'EDITAR EL TIPO'
        case 'origen':
            return 'EDITAR EL ORIGEN'
        case 'servicio':
            return 'EDITAR EL SERVICIO'
        case 'area':
            return 'EDITAR EL ÁREA'
        case 'partida':
            return 'EDITAR LA PARTIDA'
        case 'subarea':
            return 'EDITAR EL SUBÁREA'
        case 'factura':
            return '¿LLEVA FACTURA?'
        case 'puesto':
            return 'EDITAR EL PUESTO'
        case 'vacaciones_disponibles':
            return 'EDITAR VACACIONES DISPONIBLES'
        case 'nombre_emergencia':
            return 'EDITAR CONTACTO DE EMERGENCIA'
        case 'color':
            return 'EDITAR EL COLOR'
        case 'plataforma':
            return 'EDITAR EL NOMBRE DE LA PLATAFORMA'
        case 'usuario_contraseña':
            return 'EDITAR EL USUARIO Y CONTRASEÑA'
        case 'correo_telefono':
            return 'EDITAR EL CORREO Y TELÉFONO'
        case 'nss':
            return 'EDITAR NSS'
        default:
            return ''
    }
}

export const printDate = (date) => {
    let fecha = moment(date)
    let meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE']
    return fecha.format('D') + ' ' + meses[parseInt(fecha.format('M') - 1)] + ' ' + fecha.format('YYYY');
}

export const printDateMes = (date) => {
    let fecha = moment(date)
    let meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
    return fecha.format('DD') + ' ' + meses[parseInt(fecha.format('MM') - 1)] + ' ' + fecha.format('YYYY');
}

export const indexSubcadena = (cadena, prefixA, prefixB) => {
    let indiceA = cadena.indexOf(prefixA)
    let indiceB = cadena.indexOf(prefixB)
    if(indiceA === indiceB === -1)
        return -1
    if(indiceA === -1)
        return indiceB
    if(indiceB === -1)
        return indiceA
    if(indiceA < indiceB)
        return indiceA
    return indiceB
    
}

export const setLink = (texto,proyectos) => {
    let value = proyectos.find( (elemento) => {
        return elemento.display.trim() === texto.trim()
    })
    let liga = '/proyectos/proyectos'
    if(value)
        liga = `${liga}?id=${value.id}&name=${value.name}`
    return liga
}

export const printComentario = (texto, proyectos) => {
    let indice = indexSubcadena(texto, '___', '***')
    let arrayAux = [];
    if(indice === -1)        
        return(
            <span>
                {texto}
            </span>
        )
    let subcadena = texto
    let final = 0
    let inicio = indice + 3
    let flag = ''
    let prefix = ''
    while(indice !== -1){
        inicio = indice + 3
        switch(indexSubcadena(subcadena, '___', '***')){
            case subcadena.indexOf('___'):
                flag = 'black';
                break
            case subcadena.indexOf('***'):
                flag = 'info';
                break
            case -1:
                flag = 'none'
                break
            default: break;
        }
        if(flag !== 'none'){
            prefix = flag === 'black' ? '___' : '***'
            arrayAux.push({
                texto: replaceAll(subcadena.substring(final, inicio), prefix, ''),
                tipo: 'normal'
            })
            final = subcadena.indexOf(prefix, inicio)
            arrayAux.push({
                texto: subcadena.substring(inicio, final),
                tipo: flag
            })
            subcadena = subcadena.substring(final+3)
            indice = indexSubcadena(subcadena, '___', '***')
            final = 0
        }
    }
    if(subcadena)
        arrayAux.push({
            texto: subcadena,
            tipo: 'normal'
        })
    return arrayAux.map((elemento, index) => {
        if(elemento.tipo === 'info'){
            return(
                <span className = 'font-weight-bolder text-info' key = { index }>
                    <a rel="noreferrer" href = {setLink(elemento.texto, proyectos)} className = 'font-weight-bolder text-info' target = '_blank'>
                        {elemento.texto}
                    </a>
                </span>
            )
        }
        return (
            <span key = { index } className = {` ${elemento.tipo ==='black' ? 'font-weight-bolder text-success' : ''}`}>
                { elemento.texto }
            </span>
        )
    })
}