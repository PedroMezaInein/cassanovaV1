import React, { Component } from 'react'
import { Card, Modal, Form } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import { apiGet, catchErrors, apiPostFormResponseBlob} from '../../../functions/api'
import { printResponseErrorAlert, validateAlert ,waitAlert, doneAlert} from '../../../functions/alert'
import SVG from "react-inlinesvg"
import { InputGray,InputNumberGray } from '../../form-components'
import { setSingleHeader } from '../../../functions/routers'
import { diffCommentDate, replaceAll } from '../../../functions/functions'

import { toAbsoluteUrl } from "../../../functions/routers"
import TextField from '@material-ui/core/TextField';

class InfoCotizacionAceptada extends Component {
    state = {
        lead: '',
        modal: {
            orden_compra:false,
            modal_recibo: false

        },
        form:{
            total: 0.0,
            fecha: new Date(),
            descripcion: '',
            diviza_pesos:'',
        }
    }
    componentDidMount = () => {
        const { lead } = this.props
        this.getLead(lead)
    }
    getLead = async ( lead )  => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${lead.id}/presupuesto/aceptado`, at).then((response) => {
            const { lead } = response.data
            this.setState({ ...this.state, lead: lead })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }
    hasPresupuesto = (lead) => {
        let flag = false
        if (lead.presupuesto_diseño)
            if (lead.presupuesto_diseño.pdfs)
            flag = true
        return flag
    }

    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.modal_recibo = false
        form.adjunto = ''
        form.numero_orden = ''
        this.setState({ ...this.state, modal, form })
    }

    onSubmitOrden = async () => {
        const { form, lead } = this.state
        const { at } = this.props
        // const { access_token } = this.props.authUser
        waitAlert();

        apiPostFormResponseBlob(`ticket-pdf/lead/pdf/${lead.id}`, form, at ).then(
            (response) => {
                console.log(response.data)
                const nombre = 'Recibo.pdf'
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                link.setAttribute('download', nombre );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'el pdf fue descargado con éxito.'
                )
  
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    onClickOrden = () => {
        const { modal } = this.state
        modal.modal_recibo = true
        this.setState({
            ...this.state,
            modal,
        })
    }

    onChange = (value, name) => {
        const { form } = this.state
        console.log(value)
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onChangee = (e) => {
        if(e){
            let { name, value } = e.target
            let { form } = this.state
            form[name] = value
            
            this.setState({
                ...this.state,
                form
            })
        }
        
    }

    onChangePresupuesto = e => {
        const { name, value, type, checked } = e.target
        const { form, data } = this.state
        form[name] = value
        form[name] = replaceAll(value.toString(), ',', '')
        form[name] = replaceAll(form[name], '$', '')
        
        this.setState({ ...this.state, form })
    }
    handleChangeDate = date => {
        const { onChangeFecha } = this.props
        ({ target: { value: date, name: 'fecha' } })
    }
    onChangeFecha = fecha => {
        const { form } = this.state

        form.fecha = fecha.target.value
        this.setState({ form })
    }

     handleChange = (event) => {
        // name son los diferentes tipos de atributos (departamento, fecha...)
        
        let name = event.target.name;
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
    };

    onChangePresupuesto = e => {
        const { name, value, type, checked } = e.target
        const { form, data } = this.state
        form[name] = value
      
        if (type === 'radio') {
            form[name] = value === "true" ? true : false
        }
        this.setState({ ...this.state, form })
    }

    render() {
        const { lead, modal,form ,onChange,onChangePresupuesto} = this.state
        return (
            <>
            <Card className='card card-custom gutter-b'>
                <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                    <div className="font-weight-bold font-size-h4 text-dark">COTIZACIÓN ACEPTADA</div>
                    <div className="card-toolbar">
                        <button type="button" className="btn btn-sm btn-flex btn-light-success font-weight-bolder align-items-center px-2 py-1" 
                        onClick={(e) => { e.preventDefault(); this.onClickOrden(); }} >
                            <span className="las la-user-tie icon-xl"></span><div> Generar recibo</div>
                        </button>
                    </div>
                </Card.Header>
              
                <Card.Body className='pt-0'>
                    {
                        this.hasPresupuesto(lead)?
                        <ItemSlider items={[{ url: lead.presupuesto_diseño.pdfs[0].url, name: lead.presupuesto_diseño.pdfs[0].name }]}/>
                        :<></>
                    }
                </Card.Body>
            </Card>
            <Modal show={modal.modal_recibo} onHide={this.handleCloseOrden} centered contentClassName='swal2-popup d-flex w-28rem'>
              <Modal.Header className="border-0 justify-content-center text-center font-size-h4 p-0 mt-3 font-weight-bold text-dark">
                        Recibo de pago
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        <Form id="form-orden" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12 mt-6">
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                              <InputNumberGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={0}
                                                    requirevalidation={0}
                                                    placeholder="TOTAL"
                                                    value={form.total}
                                                    iconclass={"fas fa-dollar-sign"}
                                                    thousandseparator={true}
                                                    onChange={this.onChangePresupuesto}
                                                    name="total"
                                                />
                                        </div>
                                    </div>
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="form-group row form-group-marginless mt-5 mb-0">
                                            <div className="col-md-12 text-justify p-0">
                                                <div>
                                                    <label className="col-form-label text-dark-75 font-weight-bold font-size-lg">Tipo de cambio</label>
                                                    <div className="radio-inline">
                                                        <label className="radio">
                                                            <input type="radio" name='diviza_pesos' value={true} onChange={this.onChangePresupuesto} checked={form.diviza_pesos === true ? true : false} />MXN
                                                            <span></span>
                                                        </label>
                                                        <label className="radio">
                                                            <input type="radio" name='diviza_pesos' value={false} onChange={this.onChangePresupuesto} checked={form.diviza_pesos === false ? true : false} />USD
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                            <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={this.onChangee}
                                                    name="descripcion" type="text" value={form.descripcion} placeholder="CONCEPTO" messageinc="Incorrecto. Ingresa la descripccion."
                                            />
                                        </div>

                                        <div className="col-md-12">
                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} onChange={this.onChangeFecha} name="fecha"
                                            type="date" value={form.fecha} placeholder="Fecha" iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha." />
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
                            DESCARGAR
                        </button>
                    </Modal.Footer>
            </Modal> 

            </>

        )
    }
}

export default InfoCotizacionAceptada