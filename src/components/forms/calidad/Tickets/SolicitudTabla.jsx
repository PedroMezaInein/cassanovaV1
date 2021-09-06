import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { setDateText } from '../../../../functions/setters';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { deleteAlert } from '../../../../functions/alert';
export default class SolicitudesTabla extends Component {

    printEmptyTable = columns => {
        return(
            <tr className = 'text-center'>
                <td colSpan = { columns }  className="text-dark font-weight-light font-size-sm">
                    <b>No hay datos que mostrar</b>
                </td>
            </tr>
        )
    }

    setDescripcion = desc => {
        if(desc === null || desc === undefined)
            return ''
        let valor = desc.split("\n")
        return valor.map((element) => {
            if(element.length > 0){
                return (
                    <div className = 'mb-3'> {element} </div>
                )
            }
            return <></>
        })
    }

    render() {
        const { type, title, btn_title, openModalAdd, deleteSolicitud, solicitudes } = this.props
        return (
            <Card className="card-custom gutter-b card-stretch">
                <Card.Header className="border-0 pt-8 pt-md-0">
                    <Card.Title className="m-0">
                        <div className="font-weight-bold font-size-h5">{title}</div>
                    </Card.Title>
                    <div className="card-toolbar">
                        <button type="button" className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info btn-text-solicitud font-weight-bolder font-size-13px" onClick = { (e) => { e.preventDefault(); openModalAdd(); } }>
                            <i className="flaticon2-plus icon-nm mr-2 px-0"></i>{btn_title}
                        </button>
                    </div>
                </Card.Header>
                <Card.Body className="p-9 pt-0">
                    <div className="table-responsive rounded-top">
                        <table className="table table-vertical-center table-sol-fact">
                            <thead>
                                <tr className="white-space-nowrap bg-header">
                                    <th style={{minWidth:'50px'}}></th>
                                    <th>Fecha</th>
                                    <th>Área</th>
                                    <th>Sub área</th>
                                    <th style={{minWidth:'300px'}}>Descripción</th>
                                    { type === 'compra' ? <th style={{minWidth:'200px'}}>Notas</th> : <></> }
                                    <th>Estatus de {type}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    solicitudes ?
                                        solicitudes.length === 0 ?
                                            this.printEmptyTable(7)
                                        :
                                            solicitudes.map((sol) => {
                                                return(
                                                    <tr key = { sol.id } className = 'font-weight-light'>
                                                        <td className="white-space-nowrap text-center">
                                                            <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>ELIMINAR</span></Tooltip>}>
                                                                <div className="btn btn-icon btn-sm btn-bg-white btn-text-solicitud btn-hover-light-danger btn-circle"
                                                                    onClick = { (e) => { e.preventDefault(); 
                                                                        deleteAlert(`¿DESEAS ELIMINAR LA SOLICITUD DE ${type.toUpperCase()}?`, '', () => deleteSolicitud(sol.id, type))  } } >
                                                                    <i className="las la-trash-alt icon-xl" />
                                                                </div>
                                                            </OverlayTrigger>
                                                        </td>
                                                        <td className="text-dark text-center font-size-sm">
                                                            <div className="w-max-content mx-auto">
                                                                { setDateText(sol.created_at) }
                                                            </div>
                                                        </td>
                                                        <td className="text-dark text-center font-size-sm">
                                                            { sol.subarea ? sol.subarea.area ? sol.subarea.area.nombre : '' : ''}
                                                        </td>
                                                        <td className="text-dark text-center font-size-sm">
                                                            { sol.subarea ? sol.subarea.nombre : ''}
                                                        </td>
                                                        <td className="text-dark font-size-sm text-justify">
                                                            { this.setDescripcion(sol.descripcion) }
                                                        </td>
                                                        {
                                                            type === 'compra' ?
                                                                <td className="font-size-sm text-center">
                                                                    <div className="text-dark-75">{ sol.notas ? sol.notas : <div className="text-center">Sin notas</div> } </div>
                                                                </td>
                                                            : <></>
                                                        }
                                                        <td className="text-dark font-weight-light font-size-sm text-center">
                                                            <div className="w-max-content mx-auto d-block align-items-center">
                                                                { 
                                                                    sol[type] ?  
                                                                        <a className="font-weight-bold text-success text-hover-primary" href = { `/proyectos/${type}s?id=${sol[type].id}` } > 
                                                                            <i className="flaticon2-shopping-cart icon-lg text-success d-block"></i>
                                                                                <u> {`${type} realizada`} </u> 
                                                                        </a>
                                                                    :
                                                                        <>
                                                                            <i className="flaticon2-shopping-cart-1 icon-lg text-orange d-block"></i>
                                                                            <span className="text-orange">{`${type} pendiente`} </span>
                                                                        </>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    : 
                                        this.printEmptyTable(7)
                                }
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        );
    }
}