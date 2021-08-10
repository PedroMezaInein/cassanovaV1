import React from 'react';
import Moment from 'react-moment'
import NumberFormat from 'react-number-format';
import { isMobile } from 'react-device-detect';
import { questionAlert } from './alert';
import { SingleTagify } from '../components/singles';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap'
import $ from "jquery";
import moment from 'moment'
import 'moment/locale/es' 

function compare( a, b ) {
    if ( a.name < b.name ){
        return -1;
    }
    if ( a.name > b.name ){
        return 1;
    }
    return 0;
}

export const transformarOptions = (options) => {
    options = options ? options : []
    options.map((value)=>{
        value.label = value.name 
        return ''
    } );
    return options
}
function setHiddenPassword(pwd){
    let aux = ''
    for (let i = 0; i < pwd.length; i++)
        aux += '*'
    return(
        <OverlayTrigger overlay={<Tooltip>{pwd}</Tooltip>}>
            <span>{aux}</span>
        </OverlayTrigger>
    ) 
}
function substrCadena( cadena ) {
    let pantalla = $(window).width()
    let aux = ''
    if (pantalla < 1400) {
        if (cadena.length > 15) {
            aux = cadena.substr(0, 15) + "..."
            return(
                <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                    <span>{aux}</span>
                </OverlayTrigger>
            )
        } else {
            aux = cadena
            return(
                <span>{aux}</span>
            )
        }
    } else {
        if (cadena.length > 29) {
            aux = cadena.substr(0, 29) + "..."
            return(
                <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                    <span>{aux}</span>
                </OverlayTrigger>
            )
        } else {
            aux = cadena
            return(
                <span>{aux}</span>
            )
        }
    }
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
            text: element[name],
            label: element[name]
        })
        return false
    })
    return aux
}

export function setDireccion (cliente) {
    return (
        <div className="font-size-11px text-justify min-width-180px">
            {cliente.calle ? cliente.calle + ', colonia ': ''}
            {cliente.colonia ? cliente.colonia + ', ' : ''}
            {cliente.municipio ? cliente.municipio + ', ' : ''}
            {cliente.estado ? cliente.estado : '' }
            {cliente.cp ?  ', CP: ' + cliente.cp:''}
        </div>
    )
}

export function setTextTable(text, minwidth) {
    return (
        <div className="font-size-11px" style={{minWidth:minwidth}}>
            {text}
        </div>
    )
}

export function setTextTableCenter(text, minwidth) {
    return (
        <div className="font-size-11px text-center" style={{minWidth:minwidth}}>
            {text}
        </div>
    )
}

export function setTextTableReactDom(text, doubleClick, data, tipo, style){
    return(
        <div className = {`text-hover ${style} ${(text === '' ? 'm-5 p-5' : '')}`} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } > 
            <span className="font-size-11px line-height-xl"> {text} </span> 
        </div>
    )
}

export function setCustomeDescripcionReactDom(text, doubleClick, data, tipo, style){
    if(text === null)
            return ''
    let valor = text.split("\n")
    let arreglo = valor.map((element) => {
        if(element.length > 0){
            return (
                <div className = 'font-size-11px line-height-xl mb-3'> {element} </div>
            )
        }
        return <></>
    })
    return(
        <div className = {`text-hover custom-td-descripcion ${style} ${(text === '' ? 'm-5 p-5' : '')}`} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } > 
            { arreglo }
        </div>
    )
}

export function setColorTableReactDom(text, doubleClick, data, tipo) {
    return (
        <div className={`dot mx-auto ${(text === '' ? 'm-5 p-5' : '')}`} style={{backgroundColor: `${text}`}} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
        onClick = { (e) => { 
            e.preventDefault(); 
            if(isMobile){
                doubleClick(data, tipo)
            }
        } }></div>
    )
}
export function setMoneyTableReactDom(text, doubleClick, data, tipo){
    let cantidad = 0
    cantidad = parseFloat(text).toFixed(2)
    return(
        <div className = {`text-hover text-center ${(text === '' ? 'm-5 p-5' : 'm-2')}`} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } > 
            <NumberFormat value={cantidad} displayType='text' thousandSeparator={true} prefix='$'
                renderText={cantidad => <span className="font-size-11px "> {cantidad} </span>} />
        </div>
    )
}
export function setDateTableReactDom(date, doubleClick, data, tipo, style) {
    let seconds = new Date(date);
    seconds = seconds.getTime() / 1000;
    return (
        <div className = {`text-hover ${style} font-size-11px ${(date === '' ? 'm-5 p-5' : '')}`} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                /* e.preventDefault();  */
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } >
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
        </div>
    )
}

export function setListTableReactDom(arreglo, nombre, minwidth, doubleClick, data, tipo, style) {
    return (
        <div className = {`${style} font-size-11px ${(arreglo === '' ? 'm-5 p-5' : '')}`} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } >
            <div className="setListTable" style={{minWidth:minwidth}}>
                {
                    arreglo.map((element,  key ) => {
                        return (
                            <>
                                <span key = { key }>&#8226; {element[nombre]}</span><br/>
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}

export function setTagLabelReactDom (data, arreglo, tipo, deleteElement, style){
    return (
        <div className={`${style} ${(tipo==='departamento_empleado') || (tipo==='empresa_acceso') || (tipo==='departamento_acceso') || (tipo==='responsables_acceso') ? 'tr-hover text-center-webkit':'tr-hover w-max-content'}`}>
            {
                arreglo.map((element, index) => {
                    let textAlert =''
                    switch(tipo){
                        case 'proyecto':
                            textAlert = `ELIMINARÁS ${element.nombre} DEL USUARIO ${data.name}`
                            break
                        case 'departamento':
                            textAlert = `ELIMINARÁS ${element.nombre} DEL USUARIO ${data.name}`
                            break
                        case 'departamento_empleado':
                            textAlert = `ELIMINARÁS ${element.nombre} DEL EMPLEADO ${data.nombre}`
                            break
                        case 'subareas':
                            textAlert = `ELIMINARÁS ${element.nombre} DEL ÁREA ${data.nombre}`
                            break
                        case 'subpartidas':
                            textAlert = `ELIMINARÁS ${element.nombre} DE LA PARTIDA ${data.nombre}`
                            break
                        case 'empresa':
                            textAlert = `ELIMINARÁS ${element.name} DE LA CUENTA ${data.nombre}`
                            break
                        case 'empresa_acceso':
                            textAlert = `ELIMINARÁS LA EMPRESA ${element.name} DE LA PLATAFORMA ${data.plataforma}`
                            break
                        case 'departamento_acceso':
                            textAlert = `ELIMINARÁS EL DEPARTAMENTO ${element.nombre} DE LA PLATAFORMA ${data.plataforma}`
                            break
                        case 'responsables_acceso':
                            textAlert = `ELIMINARÁS EL RESPONSABLE ${element.name} DE LA PLATAFORMA ${data.plataforma}`
                            break
                        case 'departamento_empresa':
                            textAlert = `ELIMINARÁS EL DEPARTAMENTO ${element.nombre} DE LA EMPRESA ${data.name}`
                            break
                        default:
                            textAlert =''
                            break
                    }
                    return(
                        <div key = { index } className={`d-table ${(tipo==='departamento_empleado') || (tipo==='empresa_acceso') || (tipo==='departamento_acceso') || (tipo==='responsables_acceso') ? 'mb-1 ' : 'mb-2'}`}>
                            <SingleTagify element = { element } color = { index % 2 ? 'success' : 'primary' } 
                                onClick = { (e) => { 
                                    questionAlert(
                                        '¿ESTÁS SEGURO?', 
                                        `${textAlert}`,
                                        () => deleteElement(data, element, tipo)
                                    ) } } tipo={tipo} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export function setTagLabelAreaReactDom (data, arreglo, tipo, deleteElement){
    return (
        <div className="tr-hover w-max-content">
            {
                arreglo.map((element, index) => {
                    return(
                        <div key = { index } className="d-table mb-2">
                            <SingleTagify element = { element } color = { index % 2 ? 'success' : 'primary' } 
                                onClick = { (e) => {  deleteElement(data, element, tipo) } }/>
                        </div>
                    )
                })
            }
        </div>
    )
}
export function setTagLabelProyectoReactDom (proyecto, arreglo, tipo, deleteElement, nombre){
    return (
        <div className="">
            {
                arreglo.map((element, index) => {
                    return(
                        <div className="tagify align-items-center border-0 d-inline-block" key = { index } >
                            <div className = {`d-flex flex-row-reverse align-items-center tagify__tag tagify__tag--${index % 2 ? 'primary' : 'dark-75'} tagify__tag__newtable px-3px border-radius-3px m-0`}>
                                <div className="tagify__tag__removeBtn ml-0 px-0 mx-1" aria-label = 'remove tag' onClick = { (e) => { questionAlert( '¿ESTÁS SEGURO?', `ELIMINARÁS ${element.nombre} DEL PROYECTO ${proyecto.nombre}`, () => deleteElement(proyecto, element, tipo) ) } }/>
                                <div style={{padding:'1px'}}>
                                    <span className="tagify__tag-text p-1 white-space font-weight-bold letter-spacing-0-4 font-size-11px text-center">
                                        { nombre ? element[nombre] : element.nombre }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export function setTagLabelClienteReactDom (cliente, arreglo, tipo, deleteElement){

    // {
    //     arreglo.map((element,  key ) => { 
    //         return (
    //             <>
    //                 <div key={key} className="font-size-11px text-center font-weight-bold white-space-nowrap">
    //                     &#8226;&nbsp;
    //                     <a href={'/mi-proyecto?id='+element.id} className="text-primary">
    //                             { element[nombre] }
    //                         </a>
    //                         {
    //                             element.estatus ?
    //                                 <>
    //                                     &nbsp;-&nbsp;<span style={{ color: `${element.estatus.letra}` }}>
    //                                         {element.estatus.estatus}
    //                                     </span>
    //                                 </>
    //                             :''
    //                         }
    //                 </div>
    //                 <br/>
    //             </>
    //         )
    //     })
    // }
    return (
        <div className="">
            {
                arreglo.map((element, index) => {
                    return(
                        <div key = { index } >
                            <div className="container px-0 font-size-11px mb-3">
                                <div className="container-fluid px-0">
                                    <div className="row mx-0 row-paddingless">
                                        <span className="w-100">
                                            <span className="text-hover"  onClick = { (e) => { 
                                                questionAlert(
                                                    '¿ESTÁS SEGURO?', 
                                                    `ELIMINARÁS ${element.nombre} DEL CLIENTE ${cliente.nombre}`,
                                                    () => deleteElement(cliente, element, tipo)
                                                ) } }>
                                                <span className="bg-gray-100 text-center py-1">
                                                    <i className="flaticon2-delete icon-xs text-dark-50 text-hover-danger mx-2"></i>
                                                </span>
                                            </span>
                                            <span className="text-truncate py-1 ">
                                                <span className="bg-gray-100 pr-2 py-1 font-weight-bolder text-dark-50 letter-spacing-0-4 ">
                                                    { element.nombre } &nbsp;-
                                                </span>
                                                {
                                                    element.estatus ?
                                                        <>
                                                            <span style={{
                                                                backgroundColor: element.estatus.fondo, color: element.estatus.letra, border: 'transparent', padding: '0.29rem 0.3rem',
                                                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px',
                                                                fontWeight: 600
                                                            }} className="font-weight-bolder letter-spacing-0-4 ">
                                                                {element.estatus.estatus}
                                                            </span>
                                                        </>
                                                    :''
                                                }
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export function setClipboardArrayTableReactDom (arreglo, minwidth, doubleClick, data, tipo) {
    
    return (
        <div className = {`text-hover ${(arreglo === '' ? 'm-5 p-5' : '')}`}  style={{minWidth:minwidth}} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } > 
            {
                arreglo.map((element, key) => {
                    if(element.text !== '-')
                        return (
                            <div key = { key } className={`mb-2 ${minwidth?'':'center-td'}`}>
                                {
                                    element.name ?
                                        <span className="mr-1 font-size-12px" >
                                            <span className="font-weight-bold" onClick={() => { navigator.clipboard.writeText(element.name) }}>
                                                { element.lista ? element.name + '.' : element.name + ':' }
                                            </span>
                                        </span>
                                        : ''
                                }
                                {
                                    element.url ?
                                        <a href={element.url} target="_blank" rel="noopener noreferrer">
                                            <span className="font-size-11px"  onClick={() => { navigator.clipboard.writeText(element.text) }}>
                                                { element.text }
                                            </span>
                                        </a>
                                    :
                                        <span className={`font-size-11px  ${(element.name === 'CONTRASEÑA' || element.name === 'USUARIO' || element.name === 'CORREO' ? 'text-transform-none' : '')}`} onClick={() => { navigator.clipboard.writeText(element.text) }}>
                                            {
                                                element.name === 'CONTRASEÑA'?
                                                    setHiddenPassword(element.text)
                                                : element.name === 'CORREO' ?
                                                    substrCadena(element.text)
                                                : element.text
                                            }
                                        </span>
                                }
                            </div>
                        )
                    else return <></>
                })
            }
        </div>
    )
}
export function setArrayTableReactDom (arreglo, minwidth, doubleClick, data, tipo) {
    return (
        <div className = {`text-hover ${(arreglo === '' ? 'm-5 p-5' : '')}`}  style={{minWidth:minwidth}} onDoubleClick = { (e) => { e.preventDefault(); doubleClick(data, tipo)} }
            onClick = { (e) => { 
                e.preventDefault(); 
                if(isMobile){
                    doubleClick(data, tipo)
                }
            } } > 
            {
                arreglo.map((element, key) => {
                    return (
                        <div key = { key } className={`mb-2 ${minwidth?'':'center-td'}`}>
                            {
                                element.name ?
                                    <span className="mr-1 font-size-12px" >
                                        <span className="font-weight-bold">
                                            {
                                                element.lista ?
                                                    element.name + '.'
                                                : element.name + ':'
                                            }
                                        </span>
                                    </span>
                                    : ''
                            }
                            {
                                element.url ?
                                    <a href={element.url} target="_blank" rel="noopener noreferrer">
                                        <span className="font-size-11px">
                                            {
                                                element.text
                                            }
                                        </span>
                                    </a>
                                    :
                                    <span className="font-size-11px">
                                        {
                                            element.text
                                        }
                                    </span>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}
export function setLabelTableReactDom (data, changeEstatus) {
    return (
        data ?
            data.estatus ?
                <Dropdown className="text-center">
                    <Dropdown.Toggle
                        style={
                            {
                                backgroundColor: data.estatus.fondo, color: data.estatus.letra, border: 'transparent', padding: '0.3rem 0.6rem',
                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px',
                                fontWeight: 600
                            }}>
                        {data.estatus.estatus.toUpperCase()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0" >
                        <Dropdown.Header>
                            <span className="font-size-11px">Elige una opción</span>
                        </Dropdown.Header>
                        <Dropdown.Item className="p-0" onClick={() => { changeEstatus('Detenido', data) }} >
                            <span className="navi-link w-100">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline label-light-danger rounded-0 w-100 font-size-12px">DETENIDO</span>
                                </span>
                            </span>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-0" onClick={() => { changeEstatus('Terminado', data) }} >
                            <span className="navi-link w-100">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline label-light-primary rounded-0 w-100 font-size-12px">TERMINADO</span>
                                </span>
                            </span>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-0" onClick={() => { changeEstatus('En proceso', data) }} >
                            <span className="navi-link w-100">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline label-light-success rounded-0 w-100 font-size-12px">EN PROCESO</span>
                                </span>
                            </span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            : ''
        : ''
    )
}
export function setEstatusBancoTableReactDom (data, changeEstatus) {
    let estatus =  data.estatus? data.estatus.estatus !== undefined ? data.estatus.estatus : data.estatus_empleado:data.estatus_empleado
    let text = {}
    if ( estatus === "Activo" ) {
        text.letra = '#388E3C'
        text.fondo = '#E8F5E9'
        text.estatus = 'Activo'
    } else {
        text.letra = '#F64E60'
        text.fondo = '#FFE2E5'
        text.estatus = 'Inactivo'
    }
    return (
        data ?
            (data.estatus) || (data.estatus_empleado) ?
                <Dropdown className="text-center">
                    <Dropdown.Toggle
                        style={
                            {
                                backgroundColor: text.fondo, color: text.letra, border: 'transparent', padding: '0.3rem 0.6rem',
                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px',
                                fontWeight: 600
                            }}>
                        {text.estatus.toUpperCase()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-0" >
                        <Dropdown.Header>
                            <span className="font-size-11px">Elige una opción</span>
                        </Dropdown.Header>
                        <Dropdown.Item className="p-0" onClick={() => { changeEstatus('Activo', data) }} >
                            <span className="navi-link w-100">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline label-light-success rounded-0 w-100 font-size-12px">ACTIVO</span>
                                </span>
                            </span>
                        </Dropdown.Item>
                        <Dropdown.Item className="p-0" onClick={() => { changeEstatus('Inactivo', data) }} >
                            <span className="navi-link w-100">
                                <span className="navi-text">
                                    <span className="label label-xl label-inline label-light-danger rounded-0 w-100 font-size-12px">INACTIVO</span>
                                </span>
                            </span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            : ''
        : ''
    )
}

export function setColor(text) {
    return (
        <div className="dot mx-auto" style={{backgroundColor: `${text}`}} ></div>
    )
}
export function setLabelTable(text) {
    return (
        <div className="text-center white-space-nowrap">
            <div className="d-none">
                {text.estatus}
            </div>
            <span style={{
                backgroundColor:`${text.fondo}`,
                color: `${text.letra}`,
                border: 'transparent', padding: '0.3rem 0.6rem',
                width:text.estatus==='Respuesta pendiente'?'min-content':'auto', 
                margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '8.5px',
                fontWeight: 500, borderRadius:'0.42rem'
            }} >
                {text.estatus}
            </span>
        </div>
    )
}
export function setLabelVentas(text) {
    return (
        <>
            <div className="d-none">
                {text.estatus}
            </div>
            <span className="label label-md label-light-success label-inline font-weight-bold font-size-sm" style={{
                color: `${text.letra}`,
                backgroundColor: `${text.fondo}`
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
        <div className="font-size-11px text-center">
            {
                date !== null?
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
                :'-'
            }
        </div>
    )
}
export function setAdjuntoDocumento (adjunto){
    return (
        <div className="text-center">
            {
                adjunto.adjuntos.map((element) => {
                    return (
                        <>
                            <a href={element.url} target="_blank" rel="noopener noreferrer">
                                <span className="font-size-11px">
                                    Adjunto
                                </span>
                            </a>
                            <br/>
                        </>
                    )
                })
            }
        </div>
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
            renderText={cantidad => <div className="font-size-11px text-center"> {cantidad} </div>} />
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
            renderText={cantidad => <div className="font-size-11px text-center"> {cantidad} %</div>} />
    )
}

export function setListTable(arreglo, nombre, minwidth) {
    return (
        <div className="setListTable" style={{minWidth:minwidth}}>
            {
                arreglo.map((element,  key ) => {
                    return (
                        <>
                            <span key = { key }>&#8226; {element[nombre]}</span><br/>
                        </>
                    )
                })
            }
        </div>
    )
}

export function setListTableLinkProyecto(arreglo, nombre) {
    return (
        <>
            {
                arreglo.map((element,  key ) => { 
                    return (
                        <>
                            <div key={key} className="font-size-11px text-center font-weight-bold white-space-nowrap">
                                &#8226;&nbsp;
                                <a href={'/mi-proyecto?id='+element.id} className="text-primary">
                                        { element[nombre] }
                                    </a>
                                    {
                                        element.estatus ?
                                            <>
                                                &nbsp;-&nbsp;<span style={{ color: `${element.estatus.letra}` }}>
                                                    {element.estatus.estatus}
                                                </span>
                                            </>
                                        :''
                                    }
                            </div>
                            <br/>
                        </>
                    )
                })
            }
        </>
    )
}

export function setArrayTable(arreglo, minwidth) {
    return (
        <div style={{minWidth:minwidth}}>
            {
                arreglo.map((element, id) => {
                    return (
                        <div key = { id } className={`mb-2 ${minwidth?'':'center-td'}`}>
                            {
                                element.name ?
                                    <span className="mr-1 font-size-12px" >
                                        <span className="font-weight-bold">
                                            {
                                                element.lista ?
                                                    element.name + '.'
                                                : element.name + ':'
                                            }
                                        </span>
                                    </span>
                                    : ''
                            }
                            {
                                element.url ?
                                    <a href={element.url} target="_blank" rel="noopener noreferrer">
                                        <span className="font-size-11px">
                                            {
                                                element.text
                                            }
                                        </span>
                                    </a>
                                    :
                                    <span className="font-size-11px">
                                        {
                                            element.text
                                        }
                                    </span>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export function setFacturaTable(data) {
    if (data.factura) {
        return (
            <span className="font-size-11px">
                {
                    data.facturas ?
                        data.facturas.xml
                        && <a href={data.facturas.xml.url} target="_blank" rel="noopener noreferrer">
                                Factura.xml
                            <br />
                        </a>
                        : ''
                }
                {
                    data.facturas ?
                        data.facturas.pdf
                        && <a href={data.facturas.pdf.url} target="_blank" rel="noopener noreferrer">
                                Factura.pdf
                            <br />
                        </a>
                        : ''
                }
            </span>
        )
    }
    else {
        return (
            <span className="font-size-11px">
                Sin factura
            </span>
        )
    }
}

export function setAdjuntoTable(adjunto) {
    return (
        <div className="text-center">
            <a href = { adjunto.url } target = "_blank" rel = "noopener noreferrer">
                <span className="font-size-11px">{ adjunto.name } </span>
            </a>
        </div>
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
                            <span className="font-size-11px">
                                {
                                    element.name
                                }
                            </span>
                        </a>
                    </li>
                )
            }
            if (element === '' && key === list.length - 1 && aux) {
                return (
                    <span className="font-size-11px">
                        Sin adjuntos
                    </span>
                )
            }
            return false
        })
    )
}

export function setContactoTable(contacto) {
    return (
        <div className="font-size-11px">
            {
                contacto.nombre ?
                    <span className="text-dark-75 text-hover-primary">
                        <i className="las la-user-alt icon-md mr-2"></i>
                        { contacto.nombre }
                    </span>
                    : ''
            }
            {
                contacto.telefono &&
                <div className="my-2">
                    <a target="_blank" href={`tel:+${contacto.telefono}`} rel="noopener noreferrer">
                        <span className="text-dark-75 text-hover-primary">
                            <i className="las la-phone icon-md mr-2"></i>
                            {contacto.telefono}
                        </span>
                    </a>
                </div>
            }
            {
                contacto.email &&
                <div className="my-2">
                    <a target="_blank" href={`mailto:+${contacto.email}`} rel="noopener noreferrer">
                        <span className="text-dark-75 text-hover-primary">
                            <i className="las la-envelope icon-md mr-2"></i>
                            {contacto.email}
                        </span>
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
export function getQuincena(){
    return [
        { name: '1', value: '1' },
        { name: '2', value: '2' }
    ]
}
export function getMeses(){
    return [
        { name: 'Enero', value: 'Enero', label: 'Enero' },
        {  name: 'Febrero', value: 'Febrero', label: 'Febrero' },
        { name: 'Marzo', value: 'Marzo', label: 'Marzo' },
        { name: 'Abril', value: 'Abril', label: 'Abril' },
        { name: 'Mayo', value: 'Mayo', label: 'Mayo' },
        { name: 'Junio', value: 'Junio', label: 'Junio' },
        { name: 'Julio', value: 'Julio', label: 'Julio' },
        { name: 'Agosto', value: 'Agosto', label: 'Agosto' },
        { name: 'Septiembre', value: 'Septiembre', label: 'Septiembre' },
        { name: 'Octubre', value: 'Octubre', label: 'Octubre' },
        { name: 'Noviembre', value: 'Noviembre', label: 'Noviembre' },
        { name: 'Diciembre', value: 'Diciembre', label: 'Diciembre' }
    ]
}
export function getFases(){
    return [
        { name: 'Fase 1', value: '1', label: 'Fase 1' },
        { name: 'Fase 2', value: '2', label: 'Fase 2' },
        { name: 'Fase 3', value: '3', label: 'Fase 3' },
        { name: 'Todas', value: 'todas', label: 'Todas' }
    ]
}
export const getAños = () => {
    let fecha = new Date().getFullYear()
    let mes = new Date().getMonth()
    let arreglo = [];
    let limite = mes > 9 ? 4 : 5
    for (let i = mes > 9 ? -1 : 0; i < limite; i++)
        arreglo.push(
            {
                name: (fecha - i).toString(),
                value: (fecha - i).toString()
            }
        );
    return arreglo
}

export function getEstados (){
    return [
        { name: "Aguascalientes", value: "Aguascalientes" },
        { name: "Baja California", value: "Baja California" },
        { name: "Baja California Sur", value: "Baja California Sur" },
        { name: "Campeche", value: "Campeche" },
        { name: "Chiapas", value: "Chiapas" },
        { name: "Chihuahua", value: "Chihuahua" },
        { name: "Ciudad de México", value: "Ciudad de México" },
        { name: "Coahuila", value: "Coahuila" },
        { name: "Colima", value: "Colima" },
        { name: "Durango", value: "Durango" },
        { name: "Estado de México", value: "Estado de México" },
        { name: "Guanajuato", value: "Guanajuato" },
        { name: "Guerrero", value: "Guerrero" },
        { name: "Hidalgo", value: "Hidalgo" },
        { name: "Jalisco", value: "Jalisco" },
        { name: "Michoacán", value: "Michoacán" },
        { name: "Morelos", value: "Morelos" },
        { name: "Nayarit", value: "Nayarit" },
        { name: "Nuevo León", value: "Nuevo León" },
        { name: "Oaxaca", value: "Oaxaca" },
        { name: "Puebla", value: "Puebla" },
        { name: "Querétaro", value: "Querétaro" },
        { name: "Quintana Roo", value: "Quintana Roo" },
        { name: "San Luis Potosí", value: "San Luis Potosí" },
        { name: "Sinaloa", value: "Sinaloa" },
        { name: "Sonora", value: "Sonora" },
        { name: "Tabasco", value: "Tabasco" },
        { name: "Tamaulipas", value: "Tamaulipas" },
        { name: "Tlaxcala", value: "Tlaxcala" },
        { name: "Veracruz", value: "Veracruz" },
        { name: "Yucatán", value: "Yucatán" },
        { name: "Zacatecas", value: "Zacatecas" },
    ]
}

export function setEmpresaLogo(lead) {
    if(lead)
        if(lead.empresa)
            if(lead.empresa.logo_principal)
                if(lead.empresa.logo_principal.length)
                    return lead.empresa.logo_principal[0].url
    return ''
}

export function dayDMY (fecha){
    let fecha_moment = moment(fecha);
    let format = fecha_moment.locale('es').format("DD MMM YYYY");
    return format.replace('.', '');
}

export function setDateText(dato){
    let fecha = new Date(moment(dato))
    let day = fecha.getDate()
    let anio = fecha.getFullYear()
    let mes = fecha.getMonth()
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
    return `${day} ${meses[mes]} ${anio}`
}