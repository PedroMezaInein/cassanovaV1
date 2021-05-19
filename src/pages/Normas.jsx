import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../constants'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { Card } from 'react-bootstrap'
import { TreeGrid } from '../components/form-components'
import { FormEstadoResultados } from '../components/forms'
import { waitAlert, errorAlert, printResponseErrorAlert } from '../functions/alert'
import { setOptions } from '../functions/setters'
class Normas extends Component {

    state = {
        title: '',
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            empresas: [],
            empresa: '',
        },
        options: {
            empresas: [],
        },
        accordion: [
            {
                nombre: 'Acordeón 1',
                // icono: 'flaticon2-paper',
                tipo: 1,
                isActive: false,
            },
            {
                nombre: 'Acordeón 2',
                icono: 'flaticon2-calendar-5',
                tipo: 2,
                isActive: false,
            },
            {
                nombre: 'Acordeón 3',
                icono: 'flaticon2-wifi',
                tipo: 3,
                isActive: false,
            }
        ]
    };
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const estado_resultado = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!estado_resultado)
            history.push('/')
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'reportes/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
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
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getReporteEstadosResultadosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'reportes/estado-resultados', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { egresos,compras, ingresos, ventas } = response.data
                this.setState({
                    ...this.state,
                    egresos: egresos,
                    compras: compras,
                    ingresos: ingresos,
                    ventas: ventas,
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
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteEstadosResultadosAxios()
        }
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

        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteEstadosResultadosAxios()
        }
    }
    taskName = () => {
        return (
            <div className="bg-danger">
                <b>Task Name 3434</b>
            </div>
        )
    }
    constructor() {
        super(...arguments);
        this.customAttributes = { class: 'customcss' };
        
    }
    render() {
        const { form, options, ventas, ingresos, compras, egresos} = this.state
        return (
            <Layout {...this.props}>
                <div className="row">
                    <div className="col-lg-4">
                        <Card className="card-custom card-stretch gutter-b">
                            <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">ESTADO DE RESULTADOS</h3>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <FormEstadoResultados
                                    form={ form }
                                    options = { options } 
                                    onChangeRange = { this.onChangeRange }
                                    onChange={this.onChange}
                                />
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-lg-8">
                        <Card className="card-custom card-stretch gutter-b">
                        <Card.Header>
                                <div className="card-title">
                                    <h3 className="card-label">Resultados</h3>
                                </div>
                                </Card.Header>
                            <Card.Body>
                                {/* {
                                    form.empresa && */}
                                    <TreeGrid/>
                                {/* } */}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Layout >
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

export default connect(mapStateToProps, mapDispatchToProps)(Normas);