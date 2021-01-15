import { Small, B } from '../components/texts'
import React from 'react';
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { GOLD } from '../constants';
import { SVG } from 'react-inlinesvg'
import { toAbsoluteUrl } from './routers';

function compare( a, b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}
export function setOptions(arreglo, name, value) {
    let aux = []
    arreglo.map((element) => {
        if (element.hasOwnProperty('cuentas')) {
            aux.push({ name: element[name], value: element[value].toString(), cuentas: element['cuentas'] })
        } else {
            if (element.hasOwnProperty('subareas')) {
                aux.push({ name: element[name], value: element[value].toString(), subareas: element['subareas'] })
            } else {
                if(element.hasOwnProperty('tipos')) {
                    aux.push({ name: element[name], value: element[value].toString(), tipos: element['tipos'] })
                }else{
                    if (element.hasOwnProperty('proyectos')) {
                        if (element.hasOwnProperty('contratos')) {
                            aux.push({ name: element[name], value: element[value].toString(), proyectos: element['proyectos'], contratos: element['contratos'] })
                        } else {
                            aux.push({ name: element[name], value: element[value].toString(), proyectos: element['proyectos'] })
                        }
                    } else {
                        if (element.hasOwnProperty('subpartidas')) {
                            aux.push({ name: element[name], value: element[value].toString(), subpartidas: element['subpartidas'] })
                        } else {
                            if (name==="m2") {
                                aux.push({ name: ""+element[name], value: element[value].toString() })
                            } else {
                                aux.push({ name: element[name], value: element[value].toString() })
                            }
                        }
                    }
                }
            }
        }
        return false
    })
    aux.sort(compare)
    return aux
}

export function setCheckedOptions(arreglo, name) {
    let aux = []
    arreglo.map((element) => {
        aux.push({
            checked: false,
            text: element[name],
            id: element.id
        })
        return false
    })
    return aux
}

export function setSelectOptions(arreglo, name) {
    let aux = []
    arreglo.map((element) => {
        aux.push({
            value: element.id,
            text: element[name]
        })
        return false
    })
    return aux
}

export function setTextTable(text) {
    return (
        <Small>
            {text}
        </Small>
    )
}

export function setLabelTable(text) {
    return (
        <>
            <div className="d-none">
                {text.estatus}
            </div>
            <span style={{
                backgroundColor:`${text.fondo}`,
                color: `${text.letra}`,
                border: 'transparent', padding: '2.8px 5.6px',
                width:text.estatus==='Respuesta pendiente'?'min-content':'auto', 
                margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                fontWeight: 500, borderRadius:'0.42rem'
            }} >
                {text.estatus}
            </span>
        </>
    )
}
export function setLabelVentas(text) {
    return (
        <>
            <div className="d-none">
                {text.estatus}
            </div>
            <span className="label label-md label-light-success label-inline font-weight-bold" style={{
                color: `${text.letra}`,
                backgroundColor: `${text.fondo}`,
                fontSize: '10.7px'
            }} >
                {text.estatus}
            </span>
        </>
    )
}
export function setDateTable(date) {
    let seconds = new Date(date);
    seconds = seconds.getTime() / 1000;
    return (
        <Small>
            <span className="d-none">
                {
                    seconds
                }
            </span>
            <span className="d-none">
                <Moment format="YYYY/MM/DD">
                    {date}
                </Moment>
            </span>

            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        </Small>
    )
}
export function setDateTableLG(date) {
    let seconds = new Date(date);
    seconds = seconds.getTime() / 1000;
    return (
        <>
            <span className="d-none">
                {
                    seconds
                }
            </span>
            <span className="d-none">
                <Moment format="YYYY/MM/DD">
                    {date}
                </Moment>
            </span>

            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        </>
    )
}

export function setMoneyTable(value) {
    let cantidad = 0
    cantidad = parseFloat(value).toFixed(2)
    return (
        <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
            renderText={cantidad => <Small> {cantidad} </Small>} />
    )
}

export function setMoneyTableSinSmall(value) {
    let cantidad = 0
    cantidad = parseFloat(value).toFixed(2)
    return (
        <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
            renderText={cantidad => <div> {cantidad} </div>} />
    )
}

export function setMoneyTableForNominas(value) {
    let cantidad = 0
    cantidad = parseFloat(value).toFixed(2)
    return (
        <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
            renderText={cantidad => <p className="font-weight-bolder mb-0" style={{fontSize: "1.01rem"}}> {cantidad} </p>} />
    )
}

export function setPercentTable(value) {
    let cantidad = 0
    cantidad = parseFloat(value).toFixed(2)
    return (
        <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={false} prefix={''}
            renderText={cantidad => <Small> {cantidad} %</Small>} />
    )
}

export function setListTable(arreglo, nombre) {
    return (
        <ul>
            {
                arreglo.map((element,  key ) => {
                    return (
                        <div  key={key}>
                            <li key={key}>
                                <Small >
                                    {
                                        element[nombre]
                                    }
                                </Small>
                            </li>
                        </div>
                    )
                })
            }
        </ul>
    )
}

export function setListTableLinkProyecto(arreglo, nombre) {
    return (
        <ul className="text-dark-50">
            {
                arreglo.map((element,  key ) => { 
                    return (
                        <div key={key}>
                            <li key={key} className="py-2">
                                <a href={'/mi-proyecto?id='+element.id} className="mr-2" >
                                    <Small >
                                        {
                                            element[nombre]
                                        }
                                    </Small>
                                    
                                </a>
                                {
                                    element.estatus ?
                                        <>
                                            <span className="label label-lg bg- label-inline font-weight-bold p-2" 
                                                style={{
                                                    color: `${element.estatus.letra}`,
                                                    backgroundColor: `${element.estatus.fondo}`,
                                                    fontSize: "75%"
                                                }} >
                                                {element.estatus.estatus}
                                            </span>
                                        </>
                                    :''
                                }
                            </li>
                        </div>
                    )
                })
            }
        </ul>
    )
}

export function setArrayTable(arreglo) {
    return (
        arreglo.map((element) => {
            return (
                <>
                    {
                        element.name ?
                            <Small className="mr-1" >
                                <B color="gold">
                                    {
                                        element.lista ?
                                            element.name + '.'
                                        : element.name + ':'
                                    }
                                </B>
                            </Small>
                            : ''
                    }
                    {
                        element.url ?
                            <a href={element.url} target="_blank" rel="noopener noreferrer">
                                <Small>
                                    {
                                        element.text
                                    }
                                </Small>
                            </a>
                            :
                            <Small>
                                {
                                    element.text
                                }
                            </Small>
                    }
                    <br />
                </>
            )
        })
    )
}

export function setFacturaTable(data) {
    if (data.factura) {
        return (
            <Small>
                {
                    data.facturas ?
                        data.facturas.xml
                        && <a href={data.facturas.xml.url} target="_blank" rel="noopener noreferrer">
                            <Small>
                                <FontAwesomeIcon color={GOLD} icon={faFileAlt} className="mr-2" />
                                Factura.xml
                                <br />
                            </Small>
                        </a>
                        : ''
                }
                {
                    data.facturas ?
                        data.facturas.pdf
                        && <a href={data.facturas.pdf.url} target="_blank" rel="noopener noreferrer">
                            <Small>
                                <FontAwesomeIcon color={GOLD} icon={faFileAlt} className="mr-2" />
                                Factura.pdf
                            </Small>
                            <br />
                        </a>
                        : ''
                }
            </Small>
        )
    }
    else {
        return (
            <Small>
                Sin factura
            </Small>
        )
    }
}

export function setAdjuntoTable(adjunto) {
    return (
        <a href = { adjunto.url } target = "_blank" rel = "noopener noreferrer">
            <Small> { adjunto.name } </Small>
        </a>
    )
}

export function setAdjuntosList(list) {
    let aux = true
    return (

        list.map((element, key) => {
            if (element !== '') {
                aux = false
                return (
                    <li>
                        <a href={element.url} target="_blank" rel="noopener noreferrer">
                            <Small>
                                {
                                    element.name
                                }
                            </Small>
                        </a>
                    </li>
                )
            }
            if (element === '' && key === list.length - 1 && aux) {
                return (
                    <Small color="gold">
                        Sin adjuntos
                    </Small>
                )
            }
            return false
        })
    )
}

export function setContactoTable(contacto) {
    return (
        <div>
            {
                contacto.nombre ?
                    <Small>
                        {
                            contacto.nombre
                        }
                    </Small>
                    : ''
            }
            {
                contacto.telefono &&
                <div className="my-2">
                    <a target="_blank" href={`tel:+${contacto.telefono}`} rel="noopener noreferrer">
                        <Small>
                            <FontAwesomeIcon className="mx-3" icon={faPhone} />
                            {contacto.telefono}
                        </Small>

                    </a>
                </div>
            }
            {
                contacto.email &&
                <div className="my-2">
                    <a target="_blank" href={`mailto:+${contacto.email}`} rel="noopener noreferrer">
                        <Small>
                            <FontAwesomeIcon className="mx-3" icon={faEnvelope} />
                            {contacto.email}
                        </Small>
                    </a>
                </div>
            }
        </div>
    )
}

export function setContactoIcon(contacto){
    if(contacto)
        if(contacto.tipo_contacto)
            if(contacto.tipo_contacto.tipo){
                switch(contacto.tipo_contacto.tipo){
                    case 'Llamada':
                        return(<i className={contacto.success ? "fas fa-phone-volume text-success icon-16px" : "fas fa-phone-volume text-danger icon-16px"} />);
                    case 'Correo':
                        return(<i className={contacto.success ? "fas fa-envelope text-success icon-16px" : "fas fa-envelope text-danger icon-16px"} />);
                    case 'VIDEO LLAMADA':
                        return(<i className={contacto.success ? "fas fa-video text-success icon-16px" : "fas fa-video text-danger icon-16px"} />);
                    case 'Whatsapp':
                        return(<i className={contacto.success ? "socicon-whatsapp text-success icon-16px" : "socicon-whatsapp text-danger icon-16px"} />);
                    case 'TAWK TO ADS':
                        return(<i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"} />);
                    case 'REUNIÓN PRESENCIAL':
                        return(<i className={contacto.success ? "fas fa-users text-success icon-16px" : "fas fa-users text-danger icon-16px"} />);
                    case 'Visita':
                        return(<i className={contacto.success ? "fas fa-house-user text-success icon-16px" : "fas fa-house-user text-danger icon-16px"} />);
                    case 'TAWK TO ORGANICO':
                        return(<i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"} />);
                    default:
                        return(<i className={contacto.success ? "fas fa-mail-bulk text-success icon-16px" : "fas fa-mail-bulk text-danger icon-16px"} />);
                }
            }
    return ''
}