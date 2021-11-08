import React, { Component } from 'react'
import { Button, InputNumberGray, InputGray, ReactSelectSearchGray } from '../../../form-components'
import { printResponseErrorAlert, waitAlert, validateAlert, doneAlert } from '../../../../functions/alert'
import { apiPostForm, apiPutForm, catchErrors } from '../../../../functions/api'
import { optionsTipoLicencias } from '../../../../functions/options'
import { Form, Col } from 'react-bootstrap'
class LicenciasForm extends Component{

    state = {
        form: {
            tipo: '',
            nombre: '',
            duracion: '',
            cantidad: '',
            codigos:[{
                id: '', codigo: ''
            }]
        },
        options:{
            tipos:[]
        }
    }

    componentDidMount(){
        const { licencia, title } = this.props
        const { form, options } = this.state
        options.tipos = optionsTipoLicencias()
        if(title === 'Editar licencia'){
            if(licencia.tipo){
                let tipo = options.tipos.find((tipo) => {
                    return tipo.label === licencia.tipo
                })
                form.tipo = tipo
            }
            form.nombre = licencia.nombre
            form.duracion = licencia.duracion
            form.cantidad = licencia.cantidad
            let codes = JSON.parse(licencia.codigos)
            let aux = []
            if(codes.length === licencia.cantidad){
                for(let i = 0; i < codes.length; i++){
                    aux.push( {
                        id: i + 1,
                        codigo: codes[i].token,
                        flag: codes[i].flag
                    } )
                }   
            }
            form.codigos = aux
        }
        this.setState({ ...this.state, form })
    }

    onSubmit = async() => {
        const { title } = this.props
        waitAlert()
        if(title === 'Nueva licencia'){
            this.addLicenciaAxios()
        }else{
            this.uploadLicenciaAxios()
        }
    }

    addLicenciaAxios = async() => {
        const { at, refresh } = this.props
        const { form } = this.state
        let formulario = {}
        var arrayCodigos = form.codigos.map(function (obj) {
            return obj.codigo;
        });
        let tipo = form.tipo.label
        formulario.codigos = arrayCodigos
        formulario.tipo = tipo
        formulario.nombre = form.nombre
        formulario.duracion = form.duracion
        formulario.cantidad = form.cantidad
        apiPostForm(`v1/administracion/licencias`, formulario, at).then( (response) => {
            doneAlert(`Licencia generada con éxito`, () => { refresh() })
        }, (error) => {  printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    uploadLicenciaAxios = async () => {
        const { at, refresh, licencia } = this.props
        const { form } = this.state
        var arrayCodigos = form.codigos.map(function (obj) {
            return obj.codigo;
        });
        let tipo = form.tipo.label
        let formulario = {}
        formulario.codigos = arrayCodigos
        formulario.tipo = tipo
        formulario.nombre = form.nombre
        formulario.duracion = form.duracion
        formulario.cantidad = form.cantidad
        apiPutForm(`v1/administracion/licencias/${licencia.id}`, formulario, at).then(
            (response) => {
                doneAlert(`Licencia editada con éxito`, () => { refresh() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        const { licencia } = this.props
        form[name] = value
        if ( name === 'cantidad'){
            var aux = [];
            let codigos = JSON.parse(licencia.codigos)
            for(let i = 0; i < parseInt(value); i++){
                if(codigos.length > i ){
                    aux.push( { id: i+1, codigo: codigos[i].token, flag: codigos[i].flag } );
                }else{
                    aux.push( { id: i+1, codigo: '', flag: false } );
                }
            }
            form.codigos = aux
        }
        this.setState({ ...this.state, form })
    }
    
    onChangeCodigos = (e, index) => {
        const { name, value } = e.target
        const { form } = this.state
        form.codigos[index][name] = value
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
        const { form, options } = this.state
        return(
            <Form 
                id = 'form-ventas-solicitud-factura'
                onSubmit = { (e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-ventas-solicitud-factura') } }>
                <div className = 'row mx-0 mt-5'>
                    <Col md="12" className="align-self-center">
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-3">
                                <ReactSelectSearchGray placeholder = 'Tipo de licencia' defaultvalue = { form.tipo } 
                                    iconclass = 'las la-shield-alt icon-xl' requirevalidation={1} options = { options.tipos } 
                                    onChange = { ( value ) => this.updateSelect(value, 'tipo') } messageinc = 'Selecciona el tipo de licencia.'/>
                            </div>
                            <div className="col-md-3">
                                <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} withformgroup={0} requirevalidation={1} 
                                    name='nombre' iconclass="las la-lock icon-xl" placeholder='NOMBRE DE LA LICENCIA'onChange={this.onChange} 
                                    value={form.nombre} messageinc="Ingresa el nombre de la licencia." />
                            </div>
                            <div className="col-md-3">
                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={1}
                                    withformgroup={0} name='duracion' placeholder='DURACIÓN (MESES)' value={form.duracion}
                                    onChange={this.onChange} iconclass="las la-hourglass-start icon-xl" messageinc="Ingresa la duración de la licencia."/>
                            </div>
                            <div className="col-md-3">
                                <InputNumberGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={1}
                                    withformgroup={0} name='cantidad' placeholder='CANTIDAD DE LICENCIAS' value={form.cantidad}
                                    onChange={this.onChange} iconclass="las la-hashtag icon-xl" messageinc="Ingresa la cantidad de licencias."/>
                            </div>
                        </div>
                        {
                            form.cantidad ?
                                <div>
                                    <div className="separator separator-dashed mt-1 mb-2"></div>
                                    <div className="form-group row form-group-marginless">
                                        {
                                            form.codigos.map((codigo, index) => {
                                                return (
                                                    <>
                                                        <div className="col-md-3" key={index}>
                                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 } 
                                                                withformgroup = { 0 } requirevalidation = { 1 } name = 'codigo' 
                                                                placeholder = { `CÓDIGO ${codigo.id}` } onChange = { (e) => 
                                                                    { this.onChangeCodigos(e, index) }
                                                                } value = { codigo.codigo } messageinc = "Ingresa el código." 
                                                                iconclass = 'las la-key icon-xl'  letterCase = { false } 
                                                                disabled = { codigo.flag ? true : false } />
                                                        </div>
                                                        <div className={this.isMultiplo(index+1)? "col-md-12" : "d-none"}>
                                                            <div className="separator separator-dashed my-3" />
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            :<></>
                        }
                    </Col>
                </div>
                <div className="d-flex justify-content-end border-top mt-3 pt-3">
                    <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type = 'submit' text="ENVIAR" />
                </div>
            </Form>
            
        )
    }
}

export default LicenciasForm