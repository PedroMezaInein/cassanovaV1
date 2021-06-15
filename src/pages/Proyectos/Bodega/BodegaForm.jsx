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
                        form.serie = bodega.serie
                        form.modelo = bodega.modelo
                        form.descripcion = bodega.descripcion
                        form.fecha = new Date(bodega.created_at)
                        if (bodega.adjuntos) {
                            let aux = []
                            bodega.adjuntos.map((adjunto) => {
                                aux.push({
                                    name: adjunto.name,
                                    url: adjunto.url,
                                    id: adjunto.id
                                })
                                return false
                            })
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
        this.getOptionsAxios()
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
        this.setState({
            ...this.state,
            form
        })
    }
    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.map((adj) => {
            aux.push({
                name: adj.name,
                url: adj.url,
                id: adj.id
            })
            return false
        })
        form.adjuntos.fotografia.files = aux
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
        if (title === 'Editar material' || title === 'Editar herramienta' )
            this.editBodega()
        else
            this.createBodegaAxios()
    }
    async getOptionsAxios() {
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
                this.setState({
                    ...this.state,
                    options,
                    form
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async createBodegaAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tipo } = this.state
        const data = new FormData();

        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'herramientas', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/bodega'
                });
                doneAlert(`Se creo con éxito ${tipo==='materiales'?'el material':'la herramienta'}`)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async editBodega() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, bodega, tipo } = this.state
        console.log(tipo)
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
            return false
        })
        await axios.post(URL_DEV + 'herramientas/' + bodega.id, data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/bodega'
                });
                doneAlert(`Se edito con éxito ${tipo==='materiales'?'el material':'la herramienta'}`)
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteAdjuntoAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        const { bodega } = this.state
        await axios.delete(URL_DEV + 'herramientas/' + bodega.id + '/adjuntos/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { herramienta } = response.data
                this.setAdjuntos(herramienta.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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