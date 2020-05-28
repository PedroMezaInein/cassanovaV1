import { Small, B } from '../components/texts'
import React, { Component }  from 'react';
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { GOLD } from '../constants';

export function setOptions( arreglo, name, value ){
    let aux = []
    arreglo.map( (element) => {
        if( element.hasOwnProperty('cuentas') ){
            aux.push({ name: element[name], value: element[value].toString(), cuentas: element['cuentas'] } )
        }else
        {
            if(element.hasOwnProperty('subareas')){
                aux.push({ name: element[name], value: element[value].toString(), subareas: element['subareas'] } )
            }else{
                if(element.hasOwnProperty('proyectos')){
                    aux.push({ name: element[name], value: element[value].toString(), proyectos: element['proyectos'] } )
                }else{
                    aux.push({ name: element[name], value: element[value].toString() } )
                }
            }
        }
    })
    return aux
}

export function setSelectOptions(arreglo, name){
    let aux = []
    arreglo.map((element) => {
        aux.push({
            value: element.id,
            text: element[name]
        })
    })
    return aux
}

export function setTextTable( text ){
    return (
        <Small> 
            {text} 
        </Small>
    )

    /* return( */
        
    /* ) */
}

export function setDateTable( date ){
    return (
        <Small>
            <Moment format="DD/MM/YYYY">
                {date}
            </Moment>
        </Small>
    )
}

export function setMoneyTable( value ){
    return (
        <NumberFormat value = { value } displayType = { 'text' } thousandSeparator = { true } prefix = { '$' }
                renderText = { value => <Small> { value } </Small> } />
    )
}

export function setArrayTable( arreglo ){
    return (
        arreglo.map((element) => {
            return(
                <>
                    <Small className = "mr-1" >
                        <B color = "gold">
                            {
                                element.name
                            }:
                        </B>
                    </Small>
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

export function setFacturaTable( data ){
    if(data.factura){
        return(
            <Small>
                {
                    data.facturas ? 
                        data.facturas.xml
                        && <a href={data.facturas.xml.url} target="_blank">
                            <Small>
                                <FontAwesomeIcon color = { GOLD } icon = { faFileAlt } className="mr-2" />
                                Factura.xml
                                <br/>
                            </Small>
                            </a>
                        : ''
                }
                {
                    data.facturas ? 
                        data.facturas.pdf
                        && <a href={data.facturas.pdf.url} target="_blank">
                            <Small>
                                <FontAwesomeIcon color = { GOLD } icon = { faFileAlt } className="mr-2" />
                                Factura.pdf
                            </Small>
                            <br />
                        </a>
                        : ''
                }
            </Small>
        )
    }
    else{
        return(
            <Small>
                Sin factura
            </Small>
        )
    }
}

export function setAdjuntosList(list){
    let aux = true
    return (
        
        list.map((element, key) => {
            if(element !== '')
            {    
                aux = false
                return(
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
            if(element === '' && key === list.length - 1 && aux)
            {
                return(
                    <Small color="gold">
                        Sin adjuntos
                    </Small>
                )
            }
        })
    )
}