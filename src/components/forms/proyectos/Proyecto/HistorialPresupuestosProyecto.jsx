import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import SVG from 'react-inlinesvg'
import Modal from '../../../singles/Modal'
import { URL_DEV } from '../../../../constants'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { toAbsoluteUrl, setSingleHeader } from '../../../../functions/routers'
import { setNaviIcon } from '../../../../functions/setters'
import { FormSolicitudFactura, HistorialSolicitudesFacturaProyectos} from '../..'
import { setDateTableLG, setMoneyText, setOptions } from '../../../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert } from '../../../../functions/alert'
export default class HistorialPresupuestosProyecto extends Component {
    state = {
        solicitudes: [],
        modal: {
            factura: false
        },
        options: {
            clientes: [],
            estatusFactura: [],
            formasPago: [],
            metodosPago: [],
            tiposPago: [],
        },
        pdf_solicitud: [],
        navHistorial: 'ver-pdfs',
    }

    async getOptionsAxios() {
        const { proyecto, at } = this.props
        waitAlert()
        await axios.options(`${URL_DEV}v3/proyectos/proyectos/${proyecto.id}/solicitud-factura`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { options } = this.state
                const { clientes, formasPago, metodosPago, estatusFactura, tiposPago } = response.data
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.estatusFactura = setOptions(estatusFactura, 'estatus', 'id')
                options.formasPago = setOptions(formasPago, 'nombre', 'id')
                options.metodosPago = setOptions(metodosPago, 'nombre', 'id')
                options.tiposPago = setOptions(tiposPago, 'tipo', 'id')
                Swal.close()
                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    openModal = (pdf, active) => {
        this.getOptionsAxios()
        const { modal } = this.state
        modal.factura = true
        this.setState({ ...this.state, modal, pdf_solicitud: pdf, navHistorial: active })
    }

    handleClose = () => {
        const { modal } = this.state
        modal.factura = false
        this.setState({ ...this.state, modal })
    }
    typeSymbol(pdf) {
        if (pdf.pivot.motivo_cancelacion !== null) {
            return (
                <span className="svg-icon svg-icon-danger svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/Deleted-file.svg')} />
                </span>
            )
        } else if (pdf.pivot.url) {
            return (
                <span className="svg-icon svg-icon-success svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/File-done.svg')} />
                </span>
            )
        } else {
            return (
                <span className="svg-icon svg-icon-primary svg-icon-lg">
                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                </span>
            )
        }
    }
    acceptPptoAddModifyOrden = (pdf) => {
        const { onClickOrden } = this.props
        const { navHistorial } = this.state
        if (pdf.pivot.enviado) {
            if (pdf.pivot.motivo_cancelacion === null) {
                if (pdf.pivot.url === null) {
                    // ACEPTAR PRESUPUESTO Y AGREGAR ORDEN DE COMPRA
                    return (
                        <div className="d-flex align-items-center bg-light-primary2 rounded p-1 cursor-pointer" onClick={(e) => { e.preventDefault(); onClickOrden('add-orden', pdf); }} >
                            <span className="svg-icon svg-icon-primary2 mr-1">
                                <span className="svg-icon svg-icon-md">
                                    <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                                </span>
                            </span>
                            <div className="d-flex font-weight-bolder text-primary2 font-size-sm">
                                Estatus presupuesto
                            </div>
                        </div>
                    )
                } else {
                    // MODIFICAR ORDEN DE COMPRA
                    return (
                        <>
                            <DropdownButton title={<i className="las la-angle-down icon-md p-0 text-success"></i>} className="dropdown-historial-presupuestos">
                                <Dropdown.Item className="item-contratados" onClick={(e) => { e.preventDefault(); this.navHistorial('modify-orden'); onClickOrden('modify-orden', pdf); }} >
                                    {setNaviIcon(`las la-pencil-alt icon-xl`, 'MODIFICAR ORDEN DE COMPRA')}
                                </Dropdown.Item>
                                <Dropdown.Item className="item-contratados" onClick={() => { this.openModal(pdf, 'modal-solicitudes') }}>
                                    {setNaviIcon(`las la-plus icon-xl`, 'AGREGAR SOLICITUD DE FACTURA')}
                                </Dropdown.Item>
                                <Dropdown.Item className="item-contratados" onClick={() => { this.navHistorial('historial-solicitudes') }}>
                                    {setNaviIcon(`las la-pencil-alt icon-xl`, 'HISTORIAL DE SOLICITUDES DE FACTURA')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </>
                    )
                }
            }
        }
    }
    hasMontos = () => {
        const { presupuesto } = this.props
        let flag = false
        presupuesto.pdfs.forEach((pdf) => {
            if (pdf.pivot.hasOwnProperty('monto'))
                flag = true
        })
        return flag
    }
    pdfPresupuesto = ( pdf ) => {
        return (
            <div className="d-flex align-items-center border border-dashed border-gray-300 rounded p-3 w-fit-content bg-hover-light border-hover-light">
                <div className="d-flex flex-aligns-center align-items-center">
                    <span className="svg-icon svg-icon-2x">
                        <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                    </span>
                    <div className="ml-2">
                        <u><a rel="noopener noreferrer" target="_blank" href={pdf.url} className="font-size-sm text-hover-primary font-weight-bolder text-dark-75">{pdf.name}</a></u>
                    </div>
                </div>
            </div>
        )
    }
    pdfOrdenCompra = ( pdf ) => {
        if(pdf.pivot.url !== null){
            return (
                <div className="d-flex align-items-center border border-dashed border-gray-300 rounded p-3 w-fit-content bg-hover-light border-hover-light ml-5">
                    <div className="d-flex flex-aligns-center align-items-center">
                        <span className="svg-icon svg-icon-2x">
                            <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />
                        </span>
                        <div className="ml-2">
                            <u><a rel="noopener noreferrer" target="_blank" href={pdf.pivot.url} className="font-size-sm text-hover-primary font-weight-bolder text-dark-75">ORDEN DE COMPRA</a></u>
                        </div>
                    </div>
                </div>
            )
        }
    }
    hasOrdenCompra = (pdf) => {
        const { navHistorial } = this.state
        const { at, presupuesto, proyecto, getPresupuestos } = this.props
        if (pdf.pivot.numero_orden !== null) {
            return (
                <>
                    <div className="d-flex mt-5">
                        {this.pdfPresupuesto(pdf)}
                        {this.pdfOrdenCompra(pdf)}
                    </div>
                    {
                        navHistorial === 'historial-solicitudes' ?
                            <div className="mt-5">
                                <HistorialSolicitudesFacturaProyectos at={at} proyecto={proyecto} presupuesto={presupuesto} getPresupuestos={getPresupuestos} />
                            </div>
                        : <></>
                    }
                </>
            )
        } else {
            return (
                <>
                    {this.pdfPresupuesto(pdf)}
                    {this.pdfOrdenCompra(pdf)}
                </>
            )
        }
    }
    navHistorial = (type) => { 
        this.setState({ ...this.state, navHistorial: type }) 
    }
    render() {
        const { presupuesto, proyecto, at, getPresupuestos } = this.props
        const { modal, options, pdf_solicitud } = this.state
        return (
            <>
                <div className="timeline mt-9">
                    {
                        presupuesto ?
                            presupuesto.pdfs.map((pdf, index) => {
                                return (
                                    <div className="timeline-item-dashed" key={index}>
                                        <div className="timeline-line-dashed w-40px"></div>
                                        <div className="timeline-icon-dashed symbol symbol-30 symbol-lg-40 symbol-circle">
                                            <div className="symbol-label bg-light">
                                                {this.typeSymbol(pdf)}
                                            </div>
                                        </div>
                                        <div className={`timeline-content-dashed mt-n1 ${index === presupuesto.pdfs.length - 1 ? 'mb-0' : 'mb-15'}`}>
                                            <div className="mb-5 pt-3">
                                                <div className="font-size-h6 font-weight-bold text-dark-75 d-flex justify-content-between">
                                                    <div className="align-self-center">Identificador {pdf.pivot.identificador}</div>
                                                    {this.acceptPptoAddModifyOrden(pdf)}
                                                </div>
                                                <span className="text-dark-75 font-weight-bolder d-block my-3">
                                                    FECHA: <span className="text-dark-75 font-weight-normal font-size-sm">{setDateTableLG(pdf.created_at)}</span>
                                                    {this.hasMontos() ? <span className="ml-3">MONTO: <span className="text-dark-75 font-weight-normal font-size-sm">{setMoneyText(pdf.pivot.monto)}</span></span> : <></>}
                                                    <span className={`ml-3 ${pdf.pivot.enviado ? 'text-success' : 'text-red'}`}>PRESUPUESTO {pdf.pivot.enviado ? 'Enviado' : 'No enviado'}</span>
                                                </span>
                                                {
                                                    pdf.pivot.motivo_cancelacion !== null ?
                                                        <div className="d-flex align-items-center mt-1">
                                                            <div className="text-muted text-justify">{pdf.pivot.motivo_cancelacion}</div>
                                                        </div>
                                                        : <></>
                                                }
                                            </div>
                                            <div className="mt-8">
                                                {this.hasOrdenCompra(pdf)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : <></>
                    }
                </div>
                <Modal size='xl' show={modal.factura} title='Nueva solicitud de factura' handleClose={this.handleClose} >
                    {
                        modal.factura ?
                            <FormSolicitudFactura options={options} presupuesto={presupuesto} at={at} getPresupuestos={getPresupuestos} pdf_solicitud={pdf_solicitud} proyecto={proyecto} />
                            : <></>
                    }
                </Modal>
            </>
        );
    }
}