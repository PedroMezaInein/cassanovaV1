import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux'
import swal from 'sweetalert';
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import axios from 'axios'
import { setOptions } from '../../../functions/setters';
import { TraspasoForm as TraspasosFormulario } from '../../../components/forms'

class TraspasosForm extends Component {

    state = {
        title: 'Traspaso nuevo',
        formeditado: 0,
        form:{
            origen: '',
            destino: '',
            cantidad: 0,
            fecha: new Date(),
            comentario: '',
            adjuntos:{
                adjuntos:{
                    files: [],
                    value: ''
                }
            }
        },
        options:{
            cuentas: []
        }
    }

    componentDidMount(){
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
        this.getOptionsAxios()
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Traspaso nuevo',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.traspaso)
                    {

                        const { form } = this.state
                        const { traspaso } = state

                        form.cantidad = traspaso.cantidad
                        form.fecha = new Date(traspaso.created_at)
                        form.comentario = traspaso.comentario
                        let aux = []
                        if(traspaso.adjunto)
                            aux.push(traspaso.adjunto)
                        form.adjuntos.adjuntos.files = aux

                        if(traspaso)
                        {
                            if(traspaso.origen)
                                form.origen = traspaso.origen.numero
                            if(traspaso.destino)
                                form.destino = traspaso.destino.numero
                        }

                        this.setState({
                            ... this.state,
                            title: 'Editar traspaso',
                            formeditado: 1,
                            traspaso: traspaso,
                            form
                        })
                    }
                    else
                        history.push('/bancos/traspasos')
                }else
                    history.push('/bancos/traspasos')
                break;
            default:
                break;
        }
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    deleteFile = element => {
        deleteAlert('¿Deseas eliminar el archivo?', () => this.deleteAdjuntoAxios(element.id))
    }

    onSubmit = e => {
        e.preventDefault()
        const { origen, destino } = this.state.form
        const { title } = this.state
        if(origen === destino){
            swal({
                title: '¡Error!',
                text: 'La cuenta destino y origen son la misma',
                icon: 'error'
            })
            
        }else{
            if(title === 'Editar traspaso')
                this.editTraspasosAxios()
            else
                this.addTraspasosAxios()
        }
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'traspasos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { cuentas } = response.data
                const { options, traspaso, form } = this.state
                options.cuentas = setOptions(cuentas, 'nombre', 'numero')
                
                this.setState({
                    ... this.state,
                    options,
                    form
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

    async addTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        await axios.post(URL_DEV + 'traspasos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                
                const { history } = this.props
                history.push({
                    pathname: '/bancos/traspasos'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async editTraspasosAxios(){
        const { access_token } = this.props.authUser
        const { form, traspaso } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        await axios.post(URL_DEV + 'traspasos/' + traspaso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`, } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/bancos/traspasos'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, traspaso } = this.state
        await axios.delete(URL_DEV + 'traspasos/' + traspaso.id + '/adjuntos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { documento } = response.data
                const { form } = this.state
                form.adjuntos.adjuntos.files = []
                form.adjuntos.adjuntos.aux = ''
                this.setState({
                    ... this.state,
                    form
                })
                doneAlert('Adjunto eliminado con éxito')
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
        const { title, options, form } = this.state
        return (
            <Layout active = 'bancos' { ... this.props}>
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label">
                                { title }
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <TraspasosFormulario options = { options } 
                            onChange = { this.onChange }
                            form = { form } handleChange = { this.handleChange } 
                            deleteFile = { this.deleteFile } 
                            onSubmit = { this.onSubmit } />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = ({})

export default connect(mapStateToProps, mapDispatchToProps)(TraspasosForm)