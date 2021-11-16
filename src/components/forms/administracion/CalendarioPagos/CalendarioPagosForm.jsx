import React, { Component } from 'react'
import { Button, InputMoneyGray, InputGray, ReactSelectSearchGray, CalendarDay } from '../../../form-components'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert } from '../../../../functions/alert'
import { apiPostForm, apiPutForm, catchErrors } from '../../../../functions/api'
import { optionsPeriodoPagos } from '../../../../functions/options'
import { Form, Col } from 'react-bootstrap'
class CalendarioPagos extends Component{
    state = {
        form: {
            proveedor: '',
            nombre: '',
            periodo: '',
            monto: '',
            fecha: new Date(),
        },
        options:{
            tipos:[]
        }
    }

    componentDidMount(){
        const { pago, title, options } = this.props
        const { form } = this.state
        if(title === 'Editar registro de pago'){
            // if(pago.proveedor){
            //     let aux = options.proveedores.find((proveedor) => {
            //         return proveedor.label === pago.proveedor.razon_social
            //     })
            //     form.proveedor = aux
            // }
            // form.nombre = pago.nombre
            // form.periodo = pago.periodo 
            let date = new Date(pago.fecha);
            form.fecha = date.setDate(date.getDate() + 1);
            form.monto = pago.costo
        }
        this.setState({ ...this.state, form })
    }

    onSubmit = async() => {
        const { title } = this.props
        waitAlert()
        if(title === 'Agregar nuevo pago'){
            this.addPagoAxios()
        }else{
            this.uploadPagoAxios()
        }
    }

    addPagoAxios = async() => {
        const { at, refresh } = this.props
        const { form } = this.state
        apiPostForm(`v1/administracion/dario-pagos`, form, at).then( (response) => {
            doneAlert(`Pago registrado con éxito`, () => { refresh() })
        }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    uploadPagoAxios = async () => {
        const { at, refresh, pago } = this.props
        const { form } = this.state
        apiPutForm(`v1/administracion/dario-pagos/${pago.id}`, form, at).then(
            (response) => {
                doneAlert(`Pago editado con éxito`, () => { refresh() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    updateSelect = ( value, name) => {
        if (value === null) {
            value = []
        }
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    render(){
        const { form } = this.state
        const { options } = this.props
        return(
            <Form 
                id = 'form-calendario-pagos'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-calendario-pagos') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="12" className="align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'Selecciona el proveedor' defaultvalue = { form.proveedor } 
                                    iconclass = 'las la-user icon-xl' requirevalidation={1} options = { options.proveedores } 
                                    onChange = { ( value ) => this.updateSelect(value, 'proveedor') } messageinc = 'Selecciona el proveedor.'/>
                            </div>
                            <div className="col-md-6">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='nombre' iconclass="las la-tools icon-xl" placeholder='NOMBRE DEL SERVICIO' onChange={this.onChange} 
                                    value={form.nombre} messageinc="Ingresa el nombre del servicio." />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'Periodo de pago' defaultvalue = { form.periodo } 
                                    iconclass = 'las la-clock icon-xl' requirevalidation={1} options = { optionsPeriodoPagos() } 
                                    onChange = { ( value ) => this.updateSelect(value, 'periodo') } messageinc = 'Selecciona el periodo.'/>
                            </div>
                            <div className="col-md-6">
                                <InputMoneyGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } withformgroup = { 0 } 
                                    requirevalidation = { 1 } formeditado = { 0 } thousandseparator = { true } prefix = '$' name = "monto" 
                                    value = { form.monto } onChange = { this.onChange } placeholder = "MONTO" iconclass = 'las la-coins icon-xl'  messageinc = 'Ingresa el monto del pago.' />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12 text-center">
                                <div className="d-flex justify-content-center pt-5" style={{ height: '1px' }}>
                                    <label className="text-center font-weight-bolder">Fecha del pago</label>
                                </div>
                                <CalendarDay value = { form.fecha } name = 'fecha' onChange = { this.onChange } date = { form.fecha } withformgroup = { 1 } requirevalidation = { 1 } />
                            </div>
                        </div>
                    </Col>
                </div>
                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                    <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type = 'submit' text="ENVIAR" />
                </div>
            </Form>
            
        )
    }
}

export default CalendarioPagos