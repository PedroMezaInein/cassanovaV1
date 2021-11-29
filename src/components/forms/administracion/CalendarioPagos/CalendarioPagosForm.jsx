import React, { Component } from 'react'
import { Button, InputMoneyGray, InputGray, ReactSelectSearchGray, CalendarDay } from '../../../form-components'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert } from '../../../../functions/alert'
import { apiPostForm, apiPutForm, catchErrors } from '../../../../functions/api'
import { optionsPeriodoPagos } from '../../../../functions/options'
import { Form, Col } from 'react-bootstrap'
import moment from 'moment'
class CalendarioPagos extends Component{
    state = {
        form: {
            proveedor: '',
            nombre: '',
            periodo: '',
            monto: '',
            fecha: new Date(),
            area:'',
            subarea:''
        },
        options:{
            tipos:[]
        }
    }

    componentDidMount(){
        const { pago, title, options, setOptions } = this.props
        const { form } = this.state
        if(title === 'Editar registro de pago'){
            let opciones = optionsPeriodoPagos()
            let periodo = opciones.find((elemento) => {
                return elemento.value === pago.periodo
            })
            if(periodo){
                form.periodo = periodo
            }
            form.nombre = pago.servicio
            form.fecha = new Date(moment(pago.fecha_inicio));
            form.monto = pago.monto
            let proveedor = options.proveedores.find((prov) => {
                return prov.value === pago.proveedor_id.toString()
            })
            if(proveedor){
                form.proveedor = proveedor
            }
            if (pago.area !== null) {
                let area = options.areas.find((area) => {
                    return area.value === pago.area_id.toString()
                })
                if (area) {
                    form.area = area
                }
                if (Object.keys(form.area).length) {
                    options.areas.find(function (element) {
                        if (pago.area_id.toString() === element.value.toString()) {
                            setOptions('subareas', element.subareas)
                            return true
                        }
                        return false
                    })
                    let subarea = options.subareas.find((subarea) => {
                        return subarea.value === pago.subarea_id.toString()
                    })
                    if (subarea) {
                        form.subarea = subarea
                    }
                } else {
                    form.area = []
                    form.subarea = []
                    setOptions('subareas', [])
                }
            }
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
        apiPostForm(`v1/administracion/pago`, form, at).then( (response) => {
            doneAlert(`Pago registrado con éxito`, () => { refresh() })
        }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    uploadPagoAxios = async () => {
        const { at, refresh, pago } = this.props
        const { form } = this.state
        apiPutForm(`v1/administracion/pago/${pago.id}`, form, at).then(
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
        const { setOptions, options: { areas} } = this.props
        if(name === 'area'){
            areas.find(function (element, index) {
                if(Object.keys(form.area).length){
                    if (value.value.toString() === element.value.toString()) {
                        setOptions('subareas', element.subareas)
                        return true
                    }
                    return false
                }else{
                    form[name] = []
                    form.subarea = []
                    setOptions('subareas', [])
                }
            })
        }
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
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'Área' defaultvalue = { form.area } 
                                    iconclass = 'las la-window-maximize icon-xl' requirevalidation={1} options = { options.areas } 
                                    onChange = { ( value ) => this.updateSelect(value, 'area') } messageinc = 'Selecciona el área.'/>
                            </div>
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'Subárea' defaultvalue = { form.subarea } 
                                    iconclass = 'las la-window-restore icon-xl' requirevalidation={1} options = { options.subareas } 
                                    onChange = { ( value ) => this.updateSelect(value, 'subarea') } messageinc = 'Selecciona el subárea.'/>
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