import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../../../constants'
import { HistorialPresupuestos } from '../../../forms'
import { Modal, Form } from "react-bootstrap"
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, errorAlert } from '../../../../functions/alert'
import { CalendarDaySwal, InputGray } from '../../../../components/form-components'
import { setSingleHeader } from '../../../../functions/routers'

class PresupuestoAnswer extends Component {
    state = {
        modal: { orden_compra: false },
        typeModal: '',
        pdfId: 0,
        form: {
            fechaEvidencia: new Date(),
            adjunto: '',
            numero_orden: ''
        }
    }
    handleCloseOrden = () => {
        const { modal } = this.state
        modal.orden_compra = false
        this.setState({...this.state, modal })
    }
    onClickOrden = (type, pdf) => {
        let { typeModal, pdfId } = this.state
        const { modal } = this.state
        modal.orden_compra = true
        switch(type){
            case 'add-orden':
                typeModal = 'add'
                pdfId = pdf.id
                this.setState({...this.state, typeModal, modal, pdfId})
                break;
            case 'modify-orden':
                typeModal = 'modify'
                pdfId = pdf.id
                this.setState({...this.state, typeModal, modal, pdfId})
                break;
            default: break;
        }
    }
    onSubmitOrden = async () => {
        const { form, modal, pdfId, typeModal } = this.state
        const { at, presupuesto, getPresupuestos } = this.props
        waitAlert();
        if(typeModal === 'modify'){
            if(pdfId){
                let data = new FormData()
                data.append('file', form.adjunto)
                data.append('adjunto', pdfId)
                data.append('orden', form.numero_orden)
                await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/orden-compra?_method=PUT`, data, 
                    { headers: setSingleHeader(at) }).then(
                    (response) => {
                        modal.orden_compra = false
                        this.setState({ ...this.state, modal })
                        doneAlert('La orden de compra fue adjuntada con éxito.', () => { getPresupuestos() })
                    }, (error) => { printResponseErrorAlert(error) }
                ).catch((error) => {
                    errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                    console.error(error, 'error')
                })
            }else{ errorAlert(`No fue posible encontrar el presupuesto`) }
        }else{
            let data = new FormData()
            let formAdd = {
                estatus_final: "Aceptado", 
                fechaEvidencia: form.fechaEvidencia,
                adjuntoEvidencia: form.adjunto,
                motivo_rechazo:'',
                correos_reporte: [],
                ordenCompra: form.numero_orden
            }
            Object.keys(formAdd).forEach((element) => {
                if(element === 'fechaEvidencia'){
                    data.append(element, (new Date(form[element])).toDateString())
                }else{
                    data.append(element, form[element])
                }
            })
            await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/estatus?_method=PUT`, data, 
                { headers: setSingleHeader(at) }).then(
                (response) => {
                    modal.orden_compra = false
                    this.setState({ ...this.state, modal })
                    doneAlert('La orden de compra fue adjuntada con éxito.', () => { getPresupuestos() })
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }
    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }
    changeNameFile(id){
        var pdrs = document.getElementById(id).files[0].name;
        document.getElementById('info').innerHTML = pdrs;
    }
    render() {
        const { presupuesto } = this.props
        const { modal, form, typeModal } = this.state
        return (
            <>
                <HistorialPresupuestos presupuesto={presupuesto} actionsEnable = { false } btnOrden = { true } onClickOrden={this.onClickOrden}/>
                <Modal show = { modal.orden_compra } onHide = { this.handleCloseOrden } centered contentClassName = 'swal2-popup d-flex' >
                    <Modal.Header className = 'border-0 justify-content-center swal2-title text-center font-size-h4'>{typeModal === 'add'?'AGREGAR':'Modificar'} ORDEN DE COMPRA</Modal.Header>
                    <Modal.Body className = 'p-0'>
                        <Form id="form-orden" onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } }>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12 mt-6">
                                    {
                                        typeModal === 'add'?
                                        <>
                                            <div className="form-group row form-group-marginless mb-0">
                                                <div className="col-md-12 text-center">
                                                    <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                        <label className="text-center font-weight-bolder">Fecha de visto bueno</label>
                                                    </div>
                                                    <CalendarDaySwal
                                                        value={form.fechaEvidencia}
                                                        onChange={(e) => { this.onChange(e.target.value, 'fechaEvidencia') }}
                                                        name='fechaEvidencia'
                                                        date={form.fechaEvidencia}
                                                        withformgroup={0}
                                                    />
                                                </div>
                                            </div>
                                            <div className="separator separator-dashed my-5"></div>
                                        </>
                                        :<></>
                                    }
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify">
                                            <InputGray
                                                withtaglabel={0}
                                                withtextlabel={0}
                                                withplaceholder={1}
                                                withicon={1}
                                                iconclass='las la-hashtag icon-xl'
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
                                        <div className="col-md-12">
                                            <label htmlFor="adjunto" className="drop-files">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { this.onChange(e.target.files[0], 'adjunto'); this.changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2" id="info">Subir orden de compra (PDF)</div>
                                            </label>
                                            {
                                                form.adjunto === '' ?
                                                    <span className="form-text text-danger is-invalid font-size-xs text-center"> Adjunta la orden (PDF) </span>
                                                :<></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex" onClick = { this.handleCloseOrden }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex" onClick = { (e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') } } >AGREGAR</button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default PresupuestoAnswer