import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { setOptions } from '../../../functions/setters';
import axios from 'axios'
import { PrestamosForm as PrestamosFormulario } from '../../../components/forms'

class PrestamosForm extends Component {

    state = {
        prestamo: '',
        title: 'Nuevo préstamos',
        formeditado: 0,
        options: {
            empleados: []
        },
        form:{
            empleado: '',
            fecha: new Date(),
            monto: 0.0,
            descripcion: '',
            adjuntos: {
                adjuntos:{
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        }
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo préstamo',
                    formeditado:0
                })
                break;
            case 'edit':
                if(state){
                    if(state.prestamo){
                        const { form } = this.state
                        const { prestamo } = state
                        let aux = []
                        if(prestamo.adjuntos)
                            prestamo.adjuntos.map( (adj) => {
                                aux.push({
                                    id: adj.id,
                                    name: adj.name,
                                    url: adj.url
                                })
                            })
                        if(prestamo.empleado)
                            form.empleado = prestamo.empleado.id.toString()
                        form.fecha = new Date(prestamo.fecha)
                        form.monto = prestamo.monto
                        form.descripcion = prestamo.descripcion
                        form.adjuntos.adjuntos.files = aux
                        this.setState({
                            ... this.state,
                            title: 'Editar préstamo',
                            formeditado: 1,
                            form,
                            prestamo: prestamo
                        })
                    }
                    else
                        history.push('/rh/prestamos')
                }else
                    history.push('/rh/prestamos')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
        this.getOptionsAxios()
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
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
        const { title } = this.state
        waitAlert()
        if(title === 'Editar préstamo')
            this.editPrestamoAxios()
        else
            this.createPrestamoAxios()
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
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async createPrestamoAxios(){
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
        })

        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'prestamos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/rh/prestamos'
                });
                doneAlert('Préstamo generado con éxito')
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

    async editPrestamoAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, prestamo } = this.state
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
        })

        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        await axios.post(URL_DEV + 'prestamos/' + prestamo.id, data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/rh/prestamos'
                });
                doneAlert('Préstamo editado con éxito')
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

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get( URL_DEV + 'prestamos/options', { headers: { Authorization: `Bearer ${access_token}` } } ).then(
            ( response ) => {
                swal.close()
                const { empleados } = response.data
                const { options } = this.state

                options.empleados = setOptions(empleados, 'nombre', 'id')

                this.setState({
                    ... this.state,
                    options
                })
            },
            ( error ) => {
                console.log(error, 'error')
                if(error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch( (error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id){
        waitAlert()
        const { access_token } = this.props.authUser
        const { prestamo } = this.state
        await axios.delete(URL_DEV + 'prestamos/' + prestamo.id + '/adjuntos/' +id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prestamo } = response.data
                this.setAdjuntos(prestamo.adjuntos)
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
        const { title, form, formeditado, options } = this.state
        return (
            <Layout active = 'rh' { ... this.props }>
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label">
                                { title }
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <PrestamosFormulario
                            form = { form }
                            formeditado = { formeditado }
                            options = { options }
                            onChange = { this.onChange }
                            handleChange = { this.handleChange }
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

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(PrestamosForm)