import { Small, B } from '../components/texts'
import React from 'react';
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { GOLD } from '../constants';

export function setOptions(arreglo, name, value) {
    let aux = []
    arreglo.map((element) => {
        if (element.hasOwnProperty('cuentas')) {
            aux.push({ name: element[name], value: element[value].toString(), cuentas: element['cuentas'] })
        } else {
            if (element.hasOwnProperty('subareas')) {
                aux.push({ name: element[name], value: element[value].toString(), subareas: element['subareas'] })
            } else {
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
                        aux.push({ name: element[name], value: element[value].toString() })
                    }

                }
            }
        }
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

export function setDateTable(date) {
    let seconds = new Date(date);
    seconds = seconds.getTime() / 1000; //1440516958
    console.log(date, seconds)
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

export function setMoneyTable(value) {
    let cantidad = 0
    cantidad = parseFloat(value).toFixed(2)
    return (
        <NumberFormat value={cantidad} displayType={'text'} thousandSeparator={true} prefix={'$'}
            renderText={cantidad => <Small> {cantidad} </Small>} />
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
                arreglo.map((element, key) => {
                    return (
                        <>
                            <li key={key}>
                                <Small>
                                    {
                                        element[nombre]
                                    }
                                </Small>
                            </li>
                        </>
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
                                        element.name
                                    }:
                                </B>
                            </Small>
                            : ''
                    }
                    {
                        element.url ?
                            <a href={element.url} target="_blank">
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
                        && <a href={data.facturas.xml.url} target="_blank">
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
                        && <a href={data.facturas.pdf.url} target="_blank">
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

export function setAdjuntosList(list) {
    let aux = true
    return (

        list.map((element, key) => {
            if (element !== '') {
                aux = false
                return (
                    <li>
                        <a href={element.url} target="_blank">
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
                    <a target="_blank" href={`tel:+${contacto.telefono}`}>
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
                    <a target="_blank" href={`mailto:+${contacto.email}`}>
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