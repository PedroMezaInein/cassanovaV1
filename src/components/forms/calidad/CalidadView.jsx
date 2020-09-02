import React, { Component } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import ItemSlider from '../../singles/ItemSlider';
class CalidadView extends Component {

    getIniciales = nombre => {
        let aux = nombre.split(' ');
        let iniciales = ''
        aux.map((element) => {
            if (element !== '-')
                iniciales = iniciales + element.charAt(0) + ' '
        })
        return iniciales
    }

    render() {

        const { data, changeEstatus } = this.props
        return (
            <>
                <div className="card card-custom gutter-b">
                    <div className="card-body">
                        <div className="d-flex">
                            <div className="mr-4" id="symbol_calidad">
                                <div className="symbol symbol-50 symbol-lg-120 symbol-light-primary">
                                    <span className="font-size-h6 symbol-label font-weight-boldest ">
                                        {
                                            data ?
                                                data.proyecto ?
                                                    this.getIniciales(data.proyecto.nombre)
                                                : ''
                                            : ''
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="flex-grow-1">
                                <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
                                    <div className="mr-3">
                                        <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                                            {
                                                data ?
                                                    data.proyecto ?
                                                        data.proyecto.nombre
                                                    : ''
                                                : ''
                                            }
                                        </div>
                                        <div className="d-flex flex-wrap mt-2">
                                            <div className="text-muted font-weight-bold my-2">
                                                <i className="far fa-user-circle icon-md mr-2"></i>
                                                {
                                                    data ?
                                                        data.usuario ?
                                                            data.usuario.name
                                                        : ''
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                    {
                                        data ?
                                            data.estatus_ticket ?
                                                <span className="label label-lg bg- label-inline font-weight-bold py-2" 
                                                    style={{
                                                        color: `${data.estatus_ticket.letra}`,
                                                        backgroundColor: `${data.estatus_ticket.fondo}`,
                                                        fontSize:"11.7px"
                                                    }} >
                                                    {data.estatus_ticket.estatus}
                                                </span>
                                            :''
                                        :''
                                    }
                                    </div>
                                </div>

                                <div className="d-flex align-items-start flex-wrap justify-content-between">
                                    <div className="font-weight-bold text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
                                        {
                                            data ?
                                                data.descripcion
                                            : ''
                                        }
                                    </div>
                                    {
                                        data ?
                                            data.estatus_ticket ?
                                                data.estatus_ticket.estatus === 'En revisión' ?   
                                                    <>
                                                        <OverlayTrigger overlay={<Tooltip>Aceptar</Tooltip>}>
                                                            <a onClick={() => { changeEstatus('Aceptado') }} className="btn btn-icon btn-light-success success2 btn-sm mr-2 ml-auto"><i className="flaticon2-check-mark icon-sm"></i></a>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger overlay={<Tooltip>Rechazar</Tooltip>}>
                                                            <a onClick={() => { changeEstatus('Rechazado') }} className="btn btn-icon  btn-light-danger btn-sm pulse pulse-danger"><i className="flaticon2-cross icon-sm"></i></a>
                                                        </OverlayTrigger>
                                                    </>
                                                : ''
                                            : ''
                                        : '' 
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        <div className="separator separator-solid my-4"></div>
                        <div className="row row-paddingless">
                            <div className = { data ? data.fotos ? data.fotos.length === 0 ? 'col-md-12' : 'col-md-5' : 'col-md-12' : 'col-md-12'} >
                                <div className={ data ? data.fotos ? data.fotos.length ? "d-block" : "row row-paddingless" : "row row-paddingless" : "row row-paddingless" }>
                                    <div className="col-md-4">
                                        <div className={ data ? data.fotos ? data.fotos.length ? "d-flex justify-content-start" : "d-flex justify-content-center" : "d-flex justify-content-center" : "d-flex justify-content-center"}>
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/document.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    {
                                                        data ?
                                                            data.partida ?
                                                                data.partida.nombre
                                                            : ''
                                                        : ''
                                                    }
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">PARTIDA</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className={ data ? data.fotos ? data.fotos.length ? "d-flex justify-content-start" : "d-flex justify-content-center" : "d-flex justify-content-center" : "d-flex justify-content-center"}>
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/trabajo.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    {
                                                        data ?
                                                            data.tipo_trabajo ?
                                                                data.tipo_trabajo.tipo
                                                            : ''
                                                        : ''
                                                    }
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE TRABAJO</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className={ data ? data.fotos ? data.fotos.length ? "d-flex justify-content-start" : "d-flex justify-content-center" : "d-flex justify-content-center" : "d-flex justify-content-center"}>
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                <div className="symbol-label">
                                                    <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                        <SVG src={toAbsoluteUrl('/images/svg/archivero.svg')} />
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                    {
                                                        data ?
                                                            data.updated_at ?
                                                                <Moment format="DD/MM/YYYY">
                                                                    {data.created_at}
                                                                </Moment>
                                                            : ''
                                                        : ''
                                                    }
                                                </div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className = { data ? data.fotos ? data.fotos.length ? 'col-md-7' : 'd-none' : 'd-none' : 'd-none'} >
                                {
                                    data ?
                                        data.fotos ?
                                            <ItemSlider items={data.fotos} item={'fotos'} /> 
                                        : ''
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default CalidadView