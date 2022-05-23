import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions ,setSelectOptions} from '../../../functions/setters'
import { errorAlert, waitAlert, doneAlert, printResponseErrorAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { GeneradorcontratoForm  } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { apiPostFormResponseBlob } from '../../../functions/api'
import { setSingleHeader } from '../../../functions/routers'

class ContratosForm extends Component {
    state = {
        contratos: {
            clientes: [],
            proveedores: []
        },
        data: {
            clientes: [],
            contratos: {
                clientes: [],
                proveedores: []
            },
            adjuntos: []
        },
        formeditado: 0,
        adjuntos: [],
        options: {
            empresas: [],
            clientes: [],
            proveedores: [],
            tiposContratos: [],
            proyectos: [],
            prediseño: [],

        },
        form: {
            cliente: '',
            proveedor: '',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            monto: '',
            descripcion: '',
            tipo: 'cliente',
            tipoContrato: '',
            proyecto: '',
            semanas: '',
            nombre: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        title: 'Nuevo contrato de cliente',
        contrato: '',
        clientes: [],
    }
    componentDidMount() {
        let queryString = this.props.history.location.search
        let tipo = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let type = params.get("tipo")
            if (type) {
                tipo = type
            }
        }
        let tipo_contrato=tipo
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const contratos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        if (!contratos)
            history.push('/')
        this.getOptionsAxios()
        let aux =action
        aux = aux.split('?')
        switch (aux[0]) {
            case 'add':
                this.setState({
                    ...this.state,
                    tipo: tipo_contrato,
                    title: 'Nuevo contrato de '+tipo_contrato,
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.contrato) {
                        const { form } = this.state
                        const { contrato, tipo } = state
                        if (contrato.empresa) {
                            form.empresa = contrato.empresa.id.toString()
                        }
                        if (tipo === 'Cliente') 
                            if (contrato.cliente) {
                                form.cliente = contrato.cliente.id.toString()
                            }
                        if (tipo === 'Proveedor') 
                            if (contrato.proveedor) {
                                form.proveedor = contrato.proveedor.id.toString()
                            }
                        form.fechaInicio = new Date(contrato.fecha_inicio)
                        form.fechaFin = new Date(contrato.fecha_fin)
                        form.descripcion = contrato.descripcion
                        if (contrato.tipo_contrato)
                            form.tipoContrato = contrato.tipo_contrato.id.toString()
                        form.monto = contrato.monto
                        form.nombre = contrato.nombre
                        let aux = []
                        if (contrato.adjuntos)
                            contrato.adjuntos.map((adj) => {
                                aux.push(
                                    {
                                        name: adj.name, url: adj.url
                                    }
                                )
                                return false
                            })
                        form.adjuntos.adjunto.files = aux
                        this.setState({
                            ...this.state,
                            form,
                            contrato: contrato,
                            tipo: tipo,
                            title: 'Editar contrato de '+tipo,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/proyectos/generador-contratos')
                } else
                    history.push('/proyectos/generador-contratos')
                break;
            default:
                break;
        }
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
    onSubmit = e => {
        e.preventDefault()
        const { title, tipo, form } = this.state
        if (tipo === 'Cliente') {
            form.tipo = 'cliente'
        }
        if (tipo === 'Proveedor') {
            form.tipo = 'proveedor'
        }
        this.setState({
            ...this.state,
            form
        })
        waitAlert()
        let aux = title.split(' ');
        if (aux.length) {
            if (aux[0] === 'Editar') {
                this.updateContratoAxios()
            } else {
                this.addContratoAxios()
            }
        }
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'contratos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, clientes, proveedores, tiposContratos, proyectos, presupuestodiseño } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.tiposContratos = setOptions(tiposContratos, 'tipo', 'tipo')
                options.proyectos = setSelectOptions(proyectos, 'nombre', 'id')
                options.prediseño = setSelectOptions(presupuestodiseño, 'identificador', 'id')

                this.setState({
                    ...this.state,
                    options
                })
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async addContratoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                default:
                    data.append(element, form[element])
                    break
            }
            return false
        })

        apiPostFormResponseBlob(`pdf`, data, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const nombre = 'contrato.pdf'
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                link.setAttribute('download', nombre );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                doneAlert(
                    response.data.message !== undefined ? 
                        response.data.message 
                    : 'el pdf fue descargado con éxito.'
                )
  
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            
        // await axios.post(URL_DEV + 'pdf', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
        //     (response) => {
        //         doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
        //         const { history } = this.props
        //         // history.push({
        //         //     pathname: '/proyectos/generador-contratos'
        //         // });
        //         const nombre = 'contrato.pdf'
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;

        //         link.setAttribute('download', nombre );
        //         document.body.appendChild(link);
        //         link.click();
        //         link.parentNode.removeChild(link);
        //         doneAlert(
        //             response.data.message !== undefined ? 
        //                 response.data.message 
        //             : 'el pdf fue descargado con éxito.'
        //         )

        //     }, (error) => {
        //         printResponseErrorAlert(error)
        //     }
        // ).catch((error) => {
        //     errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
        //     console.error(error, 'error')
        })
    }

    async updateContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        await axios.put(URL_DEV + 'contratos/' + contrato.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/generador-contratos'
                });
            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { title, options, form, tipo, formeditado } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <GeneradorcontratoForm
                            tipo={tipo}
                            options={options}
                            form={form}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            formeditado={formeditado}
                            onChangeRange={this.onChangeRange}
                            clearFiles={this.clearFiles}
                            title={title}
                            handleChange={this.handleChange}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ContratosForm);