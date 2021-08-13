import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ImssForm as ImssFormulario } from '../../../components/forms'
import Swal from 'sweetalert2'
import { setOptions } from '../../../functions/setters'
import { URL_DEV } from '../../../constants'
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'

class ImssForm extends Component {

    state = {
        title: 'Documento IMSS nuevo',
        formeditado: 0,
        options:{
            empresas: []
        },
        form:{
            empresa: '',
            fecha: new Date(),
            adjuntos:{
                adjuntos:{
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        },
        imss: ''
    }

    componentDidMount(){
        const { authUser: { user : { permisos  } } } = this.props
        const { history : { location: { pathname } } } = this.props
        const { match : { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Documento IMSS nuevo',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.imss)
                    {
                        const { form } = this.state
                        const { imss } = state
                        let aux = []
                        if(imss.adjuntos)
                            imss.adjuntos.map( (adj) => {
                                aux.push({
                                    id: adj.id,
                                    name: adj.name,
                                    url: adj.url
                                })
                                return false
                            })
                        if(imss.empresa)
                            form.empresa = imss.empresa.id.toString()
                        form.adjuntos.adjuntos.files = aux
                        form.fecha = new Date(imss.fecha)
                        this.setState({
                            ...this.state,
                            title: 'Editar documento IMSS',
                            formeditado:1,
                            form,
                            imss: imss
                        })
                    }
                    else
                        history.push('/rh/imss')
                }else
                    history.push('/rh/imss')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.map( (adj) => {
            aux.push({
                name: adj.name,
                url: adj.url,
                id: adj.id
            })
            return false
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ...this.state,
            form
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
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
            ...this.state,
            form
        })
    }

    deleteFile = element => {
        deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id))
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if(title === 'Editar documento IMSS')
            this.editImssAxios()
        else
            this.createImssAxios()
    }

    async createImssAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })

        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        
        await axios.post(URL_DEV + 'imss', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/rh/imss'
                });
                doneAlert('Documento del IMSS credo con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async editImssAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, imss } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })

        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'imss/' + imss.id, data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/rh/imss'
                });
                doneAlert('Documento del IMSS editado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get( URL_DEV + 'imss/options', { headers: { Authorization: `Bearer ${access_token}` } } ).then(
            ( response ) => {
                Swal.close()
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')

                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch( (error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id){
        waitAlert()
        const { access_token } = this.props.authUser
        const { imss } = this.state
        await axios.delete(URL_DEV + 'imss/' + imss.id + '/adjuntos/' +id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { imss } = response.data
                this.setAdjuntos(imss.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { title, form, options, formeditado } = this.state
        return (
            <Layout active = 'rh' {...this.props}>
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label">
                                { title }
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ImssFormulario
                            form = { form }
                            formeditado = { formeditado }
                            options = { options }
                            onChange = { this.onChange }
                            handleChange = { this.handleChange }
                            deleteFile = { this.deleteFile }
                            onSubmit = { this.onSubmit }
                            />
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

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ImssForm)