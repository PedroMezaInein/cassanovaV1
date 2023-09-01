import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Card, Modal, Form } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import { InputGray } from '../../form-components'
import { apiGet, catchErrors, apiPostFormData } from '../../../functions/api'
import { printResponseErrorAlert, validateAlert, waitAlert, doneAlert } from '../../../functions/alert'
class ModificarOrdenCompra extends Component {
    state = {
        lead: '',
        modal: {
            orden_compra:false
        },
        form:{
            adjunto: '',
            numero_orden: ''
        }
    }
    componentDidMount = () => {
        const { lead } = this.props
        this.getLead(lead)
    }
    getLead = async (lead) => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${lead.id}/presupuesto/aceptado`, at).then((response) => {
            const { lead } = response.data
            this.setState({ ...this.state, lead: lead })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    hasOrdenCompra = (lead) => {
        let flag = false
        if (lead.presupuesto_diseño)
            if (lead.presupuesto_diseño.pdfs)
                flag = true
        return flag
    }

    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.orden_compra = false
        form.adjunto = ''
        form.numero_orden = ''
        this.setState({ ...this.state, modal, form })
    }
    onSubmitOrden = async () => {
        const { form, lead } = this.state
        const { at } = this.props
        waitAlert();
        let data = new FormData()
        data.append(`file`, form.adjunto)
        data.append(`orden_compra`, form.numero_orden)
        apiPostFormData(`v3/leads/crm/${lead.id}/orden-compra?_method=PUT`, data, at).then(
            (response) => {
                doneAlert('La orden de compra fue modificada con éxito.', () => { this.handleCloseOrden(); this.getLead(lead); })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onClickOrden = () => {
        const { modal } = this.state
        modal.orden_compra = true
        this.setState({
            ...this.state,
            modal,
        })
    }
    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    changeNameFile(id) {
        var pdrs = document.getElementById(id).files[0].name;
        document.getElementById('info').innerHTML = pdrs;
    }
    render() {
        const { lead, modal, form } = this.state
        return (
            <>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">ORDEN DE COMPRA</div>
                        <div className="card-toolbar">
                            <button type="button" className="btn btn-sm btn-flex btn-light-success font-weight-bolder align-items-center px-2 py-1" onClick={(e) => { e.preventDefault(); this.onClickOrden(); }} >
                                <span className="svg-icon svg-icon-md"><SVG src={toAbsoluteUrl('/images/svg/Edit.svg')} /></span><div>Modificar orden de compra</div>
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body className='pt-0'>
                        {
                            this.hasOrdenCompra(lead) ?
                                <ItemSlider items={[{ url: lead.presupuesto_diseño.pdfs[0].pivot.visto_bueno, name: 'orden_compra.pdf' }]} />
                                : <></>
                        }
                    </Card.Body>
                </Card>
                <Modal show={modal.orden_compra} onHide={this.handleCloseOrden} centered contentClassName='swal2-popup d-flex w-28rem'>
                    <Modal.Header className="border-0 justify-content-center text-center font-size-h4 p-0 mt-3 font-weight-bold text-dark">
                        MODIFICAR ORDEN DE COMPRA
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        <Form id="form-orden" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12 mt-6">
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                            <InputGray
                                                withtaglabel={0}
                                                withtextlabel={0}
                                                withplaceholder={1}
                                                withicon={1}
                                                iconclass='las la-shopping-cart icon-xl'
                                                requirevalidation={0}
                                                value={form.numero_orden}
                                                name='numero_orden'
                                                onChange={(e) => { this.onChange(e.target.value, 'numero_orden') }}
                                                swal={true}
                                                placeholder='NÚMERO DE ORDEN DE COMPRA'
                                            />
                                        </div>
                                    </div>
                                    <div className="separator separator-dashed mt-5 mb-2"></div>
                                    <div className="form-group row form-group-marginless mt-5 mb-0">
                                        <div className="col-md-12 p-0">
                                            <label htmlFor="adjunto" className="drop-files col-md-11">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { this.onChange(e.target.files[0], 'adjunto'); this.changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2 col-11 pl-0 text-truncate" id="info">Subir orden de compra (PDF)</div>
                                            </label>
                                            {
                                                form.adjunto === '' ?
                                                    <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                    : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='border-0 justify-content-center pb-3 pt-8'>
                        <button type="button" className="btn btn-md d-flex place-items-center btn-light font-weight-bold mt-0"
                            onClick={this.handleCloseOrden}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn btn-md d-flex place-items-center btn-primary2 font-weight-bold mt-0"
                            onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }} >
                            MODIFICAR
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModificarOrdenCompra