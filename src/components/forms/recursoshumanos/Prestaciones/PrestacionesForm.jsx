import React, { Component } from 'react'
import { Form, Col } from 'react-bootstrap'
import { apiPostForm, apiPutForm, catchErrors } from '../../../../functions/api'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert } from '../../../../functions/alert'
import { Button, InputNumberGray, InputGray, ReactSelectSearchGray, InputMoneyGray } from '../../../form-components'
class PrestacionesForm extends Component{

    state = {
        form: {
            nombre: '',
            periodo: '',
            proveedor: '',
            pago: '',
            descripcion:'',
            date: new Date(),
            fecha_pago:''
        },
        array:[
            ['1','2','3','4','5','6','7'], 
            ['8','9','10','11','12','13','14'], 
            ['15','16','17','18','19','20','21'], 
            ['22','23','24','25','26','27','28'], 
            ['29','30','31'], 
        ],
        activeDay: '',
    }

    componentDidMount(){
        const { prestacion, title, options } = this.props
        const { form } = this.state
        let aux = null
        if(title === 'Editar prestación'){
            if(prestacion.proveedor_id){
                let proveedor = options.proveedores.find((tipo) => {
                    return tipo.value === prestacion.proveedor_id.toString()
                })
                form.proveedor = proveedor
            }
            form.nombre = prestacion.nombre
            form.periodo = prestacion.periodo
            form.pago = prestacion.pago_por_empleado
            form.descripcion = prestacion.descripcion
            form.fecha_pago = prestacion.dia_pago
            aux = prestacion.dia_pago.toString()
        }
        this.setState({ ...this.state, form, activeDay: aux })
    }

    onSubmit = async() => {
        const { title } = this.props
        waitAlert()
        if(title === 'Nueva prestación'){
            this.addPrestacionesAxios()
        }else{
            this.uploadPrestacionesAxios()
        }
    }

    addPrestacionesAxios = async() => {
        const { at, refresh } = this.props
        const { form } = this.state
        apiPostForm(`v1/rh/prestaciones`, form, at).then( (response) => {
            doneAlert(`Prestación generada con éxito`, () => { refresh() })
        }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    uploadPrestacionesAxios = async () => {
        const { at, refresh, prestacion } = this.props
        const { form } = this.state
        apiPutForm(`v1/rh/prestaciones/${prestacion.id}`, form, at).then(
            (response) => {
                doneAlert(`Prestación editada con éxito`, () => { refresh() })
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
    handleActive = active => {
        const { array, form } = this.state
        let aux = ''
        array.forEach((element1, key1) => {
            array[key1].forEach((element2, key2) => {
                if (element2 === active) {
                    aux = active
                }
            })
        })
        form.fecha_pago = aux
        this.setState({
            activeDay: aux,
            form
        })
    }
    render(){
        const { form, array, activeDay } = this.state
        const { options } = this.props
        return(
            <Form id = 'form-prestaciones'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-prestaciones') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="12" className="align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='nombre' iconclass="las la-file-alt icon-xl" placeholder='NOMBRE DE LA PRESTACIÓN'onChange={this.onChange} 
                                    value={form.nombre} messageinc="Ingresa el nombre de la prestación." />
                            </div>
                            <div className="col-md-6">
                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={1}
                                    withformgroup={0} name='periodo' placeholder='PERIODO (MESES)' value={form.periodo}
                                    onChange={this.onChange} iconclass="las la-hourglass-start icon-xl" messageinc="Ingresa el periodo."/>
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-6">
                                <InputMoneyGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1}
                                    formeditado={0} thousandseparator={true} prefix='$' name="pago" value={form.pago} onChange={this.onChange}
                                    placeholder="PAGO POR EMPLEADO" iconclass='las la-coins' messageinc="Ingresa el pago por empleado." />
                            </div>
                            <div className="col-md-6">
                                <ReactSelectSearchGray placeholder = 'Proveedor' defaultvalue = { form.proveedor } 
                                    iconclass = 'las la-user icon-xl' requirevalidation={1} options = { options.proveedores } 
                                    onChange = { ( value ) => this.updateSelect(value, 'proveedor') } messageinc = 'Selecciona el proveedor.'/>
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12">
                                <InputGray
                                    withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0} requirevalidation={0}
                                    as="textarea" placeholder="DESCRIPCIÓN" rows="3" value={form.descripcion} name="descripcion" onChange={this.onChange}
                                    customclass="px-2" messageinc="Incorrecto. Ingresa la descripción." />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12 text-center">
                                <div className="calendar-container">
                                    <table className="calendar table_calendar">
                                        <thead>
                                            <th colspan="7">
                                                FECHA DE PAGO
                                            </th>
                                        </thead>
                                        <tbody>
                                            {
                                                array.map((arr, key) => {
                                                    return (
                                                        <tr key={key} >
                                                            {
                                                                array[key].map((arr2, key1) => {
                                                                    return (
                                                                        <td key={key1} className={activeDay === arr2 ? 'current-day' : ''} 
                                                                            onClick={() => this.handleActive(arr2)}>
                                                                            {arr2}
                                                                        </td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                        {
                                            form.fecha_pago === ''?
                                                <tfoot>
                                                    <tr>
                                                        <td colspan="7" className="text-center">
                                                            <div className="form-text font-weight-light text-danger">
                                                                SELECCIONA EL INICIO DEL PAGO
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            :
                                                <></>
                                        }
                                    </table>
                                </div>
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

export default PrestacionesForm