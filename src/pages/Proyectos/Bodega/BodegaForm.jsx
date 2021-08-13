import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout';
import { URL_DEV } from '../../../constants';
import { deleteAlert, doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert';
import { setOptions } from '../../../functions/setters';
import axios from 'axios'
import { BodegaForm as BodegaFormulario } from '../../../components/forms'
import { setFormHeader, setSingleHeader } from '../../../functions/routers';
class BodegaForm extends Component {
    state = {
        title: 'Nuevo material',
        formeditado: 0,
        options: {
            partidas:[],
            proyectos: [],
            unidades:[]
        },
        form: {
            partida:'',
            proyecto: '',
            unidad:'',
            nombre: '',
            cantidad:'',
            descripcion: '',
            adjuntos: {
                fotografia: {
                    value: '',
                    placeholder: 'Fotografía',
                    files: []
                }
            },
            ubicacion:''
        },
        bodega: '',
        tipo:''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const remisiones = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        let queryString = this.props.history.location.search
        let tipo = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let type = params.get("type")
            if (type) {
                tipo = type
            }
        }
        this.getOptionsAxios()
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: `${tipo==='materiales'?'Nuevo material':'Nueva herramienta'}`,
                    formeditado: 0,
                    tipo:tipo
                })
                break;
            case 'edit':
                if (state) {
                    if (state.bodega) {
                        const { form } = this.state
                        const { bodega } = state
                        form.nombre = bodega.nombre
                        form.descripcion = bodega.descripcion
                        if(bodega.partida)
                            form.partida = bodega.partida.id.toString()
                        if(bodega.unidad)
                            form.unidad = bodega.unidad.id.toString()
                        form.cantidad = bodega.cantidad
                        form.ubicacion = bodega.ubicacion
                        if (bodega.adjuntos) {
                            let aux = []
                            bodega.adjuntos.forEach((adjunto) => { aux.push({ name: adjunto.name, url: adjunto.url, id: adjunto.id }) })
                            form.adjuntos.fotografia.files = aux
                        }
                        this.setState({
                            ...this.state,
                            formeditado: 1,
                            bodega: bodega,
                            tipo:state.tipo,
                            title: `${state.tipo==='materiales'?'Editar material':'Editar herramienta'}`,
                            form
                        })
                    }
                    else
                        history.push('/proyectos/bodega')
                } else
                    history.push('/proyectos/bodega')
                break;
            default:
                break;
        }
        if (!remisiones)
            history.push('/')
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        switch (name) {
            case 'cantidad':
                form[name] = value.replace(/[,]/gi, '')
                break;
            default:
                break;
        }
        this.setState({ ...this.state, form })
    }

    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.forEach((adj) => { aux.push({ name: adj.name, url: adj.url, id: adj.id }) })
        form.adjuntos.fotografia.files = aux
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        const { form, bodega } = this.state
        let aux = []
        if(bodega)
            bodega.adjuntos.forEach((adjunto) => { aux.push(adjunto) })
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
        this.setState({ ...this.state, form })
    }

    deleteFile = element => { deleteAlert('¿DESEAS ELIMINAR EL ARCHIVO?', '', () => this.deleteAdjuntoAxios(element.id)) }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar material' || title === 'Editar herramienta' )
            this.editBodega()
        else
            this.createBodegaAxios()
    }

    getOptionsAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'herramientas/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos, partidas, unidades } = response.data
                const { options, form } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                this.setState({ ...this.state, options, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    createBodegaAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tipo } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        form.adjuntos.fotografia.files.forEach((file) => { data.append(`files[]`, file.file) })
        await axios.post(`${URL_DEV}v1/proyectos/bodegas?tipo=${tipo}`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { history } = this.props
                history.push({ pathname: '/proyectos/bodega' });
                doneAlert(`Se creo con éxito ${tipo==='materiales'?'el material':'la herramienta'}`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    editBodega = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tipo, bodega } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        form.adjuntos.fotografia.files.forEach((file) => { 
            if(file.id === undefined)
                data.append(`files[]`, file.file) 
        })
        await axios.post(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}?tipo=${tipo}&_method=PUT`, data, { headers: setFormHeader(access_token) }).then(
            (response) => {
                const { history } = this.props
                history.push({ pathname: '/proyectos/bodega' });
                doneAlert(`Se edito con éxito ${tipo==='materiales'?'el material':'la herramienta'}`)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    deleteAdjuntoAxios = async (id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { bodega } = this.state
        await axios.delete(`${URL_DEV}v1/proyectos/bodegas/${bodega.id}/adjunto/${id}`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { bodega } = response.data
                this.setAdjuntos(bodega.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { title, form, formeditado, options, tipo } = this.state
        return (
            <Layout active='proyectos' {...this.props} >
                <Card>
                    <Card.Header>
                        <div className="card-custom">
                            <h3 className="card-label" >
                                {title}
                            </h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <BodegaFormulario
                            onChange={this.onChange}
                            form={form}
                            formeditado={formeditado}
                            options={options}
                            onSubmit={this.onSubmit}
                            handleChange={this.handleChange}
                            deleteFile={this.deleteFile}
                            tipo={tipo}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(BodegaForm)