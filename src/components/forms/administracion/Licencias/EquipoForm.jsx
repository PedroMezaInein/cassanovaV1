import React, { Component } from 'react'
import { Button,  InputGray,  SelectSearch } from '../../../form-components'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert } from '../../../../functions/alert'
import { apiPostForm, apiPutForm, apiGet, catchErrors } from '../../../../functions/api'
import { setOptions } from '../../../../functions/setters'

import { Form, Col } from 'react-bootstrap'

class EquiposForm extends Component{

    state = {
        form: {
            formeditado: 0,
            empleado_id: '',
            equipo: '',
            modelo: '',
            marca: '',
            serie: '',
            descripcion:''
        },
        options:{
            empleados:[]
        }
    }

    componentDidMount(){
        const { licencia, title } = this.props
        const { form } = this.state
        const { at } = this.props

        apiGet('v1/administracion/equipos/empleado',  at).then(
            ( response ) => {
                const { empleados } = response.data
                const { options } = this.state
                options.empleados = setOptions(empleados, 'nombre', 'id')
                if(title === 'Editar equipo'){
                    form.empleado_id = licencia.empleado_id.toString()
                    form.equipo = licencia.equipo
                    form.modelo = licencia.modelo
                    form.marca = licencia.marca
                    form.serie = licencia.serie
                    form.descripcion = licencia.descripcion

                }
                this.setState({ ...this.state, form })
               
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => { catchErrors(error) })

    }

    updateEmpleado = value => {
        this.onChange({ target: { value: value, name: 'empleado_id' } })
    }

    onSubmit = async() => {
        const { title } = this.props
        waitAlert()
        console.log(title)
        if(title === 'Nuevo Equipo'){
            this.addEquiposAxios()
        }else{
            this.uploadEquiposAxios()
        }
    }

    addEquiposAxios = async() => {
        const { at, refresh } = this.props
        const { form } = this.state
        console.log(form)
        apiPostForm(`v1/administracion/equipos`, form, at).then( (response) => {
            this.setState({ ...this.state, form })
            doneAlert(`Licencia generada con éxito`, () => { refresh() })
        }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    uploadEquiposAxios = async () => {
        const { at, refresh, licencia } = this.props
        const { form } = this.state
        
        console.log(form)
        apiPutForm(`v1/administracion/equipos/${licencia.id}`, form, at).then(
            (response) => {
                doneAlert(`Equipo editado con éxito`, () => { refresh() })
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

    isMultiplo(numero){
        const { form } = this.state
        if(( numero % 4 ) === 0 && form.codigos.length !== numero){
            return true
        }else{
            return false
        }
    }

    render(){
        const { form, options, formeditado } = this.state
        return(
            <Form 
                id = 'form-ventas-solicitud-factura'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-ventas-solicitud-factura') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="12" className="align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-3">
                                <SelectSearch options = { options.empleados } placeholder = "SELECCIONA EL EMPLEADO"
                                        name = "empleado" value = { form.empleado_id } onChange = { this.updateEmpleado }
                                        iconclass = "fas fa-layer-group" formeditado = { formeditado }
                                        messageinc = "Incorrecto. Selecciona el empleado"
                                        />
                            </div>
                            <div className="col-md-3">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='equipo' iconclass="far fa-address-card icon-lg text-dark-50" placeholder='NOMBRE DEL EQUIPO'onChange={this.onChange} 
                                    value={form.equipo} messageinc="Ingresa el nombre del equipo." />
                            </div>
                            <div className="col-md-3">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='modelo' iconclass="las la-lock icon-xl" placeholder='Modelo'onChange={this.onChange} 
                                    value={form.modelo} messageinc="Ingresa el modelo." />
                            </div>
                            <div className="col-md-3">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='marca' iconclass="far fa-file-alt icon-lg text-dark-50" placeholder='MARCA'onChange={this.onChange} 
                                    value={form.marca} messageinc="Ingresa la marca." />
                            </div>
                            <div className="col-md-3">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='serie' iconclass="las la-lock icon-xl" placeholder='SERIE'onChange={this.onChange} 
                                    value={form.serie} messageinc="Ingresa la serie." />
                            </div>
                            <div className="col-md-6">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='descripcion' placeholder='DESCRIPCION'onChange={this.onChange} 
                                    value={form.descripcion} messageinc="Ingresa una descripcion." />
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

export default EquiposForm