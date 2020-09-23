import React, { Component } from 'react';
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import axios from 'axios'
import { URL_DEV } from '../../../constants';
import { Card } from 'react-bootstrap';
import { CuentaForm as CuentaFormulario } from '../../../components/forms'
import swal from 'sweetalert';
import { setOptions, setSelectOptions } from '../../../functions/setters';

class CuentaForm extends Component {

    state = {
        title: 'Nueva cuenta',
        formeditado: 0,
        options: {
            empresas: [],
            bancos: [],
            estatus: [],
            tipos: []
        },
        tipo: '',
        form:{
            nombre: '',
            numero: '',
            estatus: 0,
            tipo: '',
            banco: '',
            empresa_principal: '',
            empresa: '',
            empresas: [],
            descripcion: ''
        }
    }

    componentDidMount(){
        let queryString = this.props.history.location.search
        let tipo = ''
        if(queryString){
            let params = new URLSearchParams(queryString)
            let type = params.get("type")
            if(type){
                tipo = type
            }
        }
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const modulo = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        if(!modulo)
            history.push('/')
        this.getOptionsAxios(tipo)
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nueva cuenta',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.cuenta)
                    {

                        const { form, options } = this.state
                        const { cuenta } = state

                        form.nombre = cuenta.nombre
                        form.numero = cuenta.numero
                        if(cuenta.estatus)
                            form.estatus = cuenta.estatus.id
                        if(cuenta.tipo)
                            form.tipo = cuenta.tipo.id.toString()
                        if(cuenta.empresa_principal_id)
                            form.empresa_principal = cuenta.empresa_principal_id.toString()
                        
                        if(cuenta.empresa)
                            cuenta.empresa.map((emp)=>{
                                this.onChange({ target: { value: emp.id.toString(), name: 'empresa' } })
                                form.empresas.push({
                                    id: emp.id,
                                    text: emp.name
                                })
                            })
                        form.descripcion = cuenta.descripcion

                        this.setState({
                            /* ... this.state, */
                            title: 'Editar cuenta',
                            formeditado:1,
                            form,
                            cuenta: cuenta
                        })
                    }
                    else
                        history.push('/bancos/cuentas')
                }else
                    history.push('/bancos/cuentas')
                break;
            default:
                break;
        }
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        const { title } = this.state
        if(title === 'Editar cuenta')
            this.editCuentaAxios()
        else
            this.addCuentaAxios()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form, options } = this.state
        if(name === 'empresa'){
            options.empresas.map( (empresa) => {
                if(value.toString() === empresa.value){
                    let aux = true
                    form.empresas.map( (element)=>{
                        if(value.toString() === element.id.toString())
                            aux = false
                    })
                    if(aux)
                        form.empresas.push({
                            text: empresa.name,
                            id: empresa.value
                        })
                }
            })
        }
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    removeEmpresa = empresa => {
        const { form } = this.state
        let aux = []
        form.empresas.map( (element) => {
            if(element !== empresa)
                aux.push(element)
        })
        form.empresas = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async getOptionsAxios(tipo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { bancos, estatus, tipos, empresas } = response.data
                const { options, cuenta } = this.state
                let aux = []
                if(tipo === 'bancos'){
                    bancos.map((banco) => {
                        if (banco.nombre !== 'CAJA CHICA')
                            aux.push(banco)
                    })
                }
                if(tipo === 'cajas'){
                    bancos.map((banco) => {
                        if (banco.nombre === 'CAJA CHICA'){
                            aux.push(banco)
                            this.onChange({ target: { value: banco.id.toString(), name: 'banco' } })
                        }
                    })
                    tipos.map( (element) => {
                        if(element.tipo === 'EFECTIVO'){
                            this.onChange({ target: { value: element.id.toString(), name: 'tipo' } })
                        }
                    })
                }
                if(cuenta){
                    if(cuenta.banco){
                        if(cuenta.banco.nombre === 'CAJA CHICA'){
                            tipo = 'cajas'
                            bancos.map((banco) => {
                                if (banco.nombre === 'CAJA CHICA'){
                                    aux.push(banco)
                                    this.onChange({ target: { value: banco.id.toString(), name: 'banco' } })
                                }
                            })
                        }else{
                            tipo = 'bancos'
                            bancos.map((banco) => {
                                if (banco.nombre !== 'CAJA CHICA')
                                    aux.push(banco)
                            })
                            this.onChange({ target: { value: cuenta.banco.id.toString(), name: 'banco' } })
                        }
                    }
                }

                if(aux.length === 0)
                    aux = bancos
                options.bancos = setOptions(aux, 'nombre', 'id')
                options.tipos = setOptions(tipos, 'tipo', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                options.estatus = setSelectOptions(estatus, 'estatus')
                this.setState({
                    ... this.state,
                    options,
                    tipo: tipo
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addCuentaAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        const { tipo } = this.state
        form.tipoBanco = tipo === 'cajas' ? 'Caja chica' : ''
        await axios.post(URL_DEV + 'cuentas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { history } = this.props
                history.push({
                    pathname: '/bancos/cuentas'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta agregada con éxito.')
                
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.put(URL_DEV + 'cuentas/' + cuenta.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { history } = this.props
                history.push({
                    pathname: '/bancos/cuentas'
                });

                doneAlert(response.data.message !== undefined ? response.data.message : 'Cuenta editada con éxito.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { title, tipo, options, form, formeditado } = this.state
        return (
            <Layout active = 'bancos' { ...this.props }>
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label">
                                { title }
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <CuentaFormulario options = { options }
                            formeditado = { formeditado }
                            form = { form } onChange = { this.onChange } 
                            removeEmpresa = { this.removeEmpresa } 
                            onSubmit = { this.onSubmit } 
                            tipo = { tipo } />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return { authUser: state.authUser }   
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CuentaForm)