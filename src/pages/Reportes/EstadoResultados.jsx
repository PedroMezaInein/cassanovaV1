import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import { FlujosReportes, AccordionEstadosResultados } from '../../components/forms'
import { setOptions } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { URL_DEV } from '../../constants'

class EstadoResultados extends Component {

    state = {
        egresos:[],
        compras:[],
        ingresos:[],
        ventas:[],
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date,
            empresas: [],
            empresa: '',
        },
        options: {
            empresas: [],
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const estado_resultado = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
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
                swal.close()
                const { empresas } = response.data
                const { options } = this.state

                options.empresas = setOptions(empresas, 'name', 'id')

                this.setState({
                    ... this.state,
                    options
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

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteEstadosResultadosAxios()
        }
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })

        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteEstadosResultadosAxios()
        }
    }

    async getReporteEstadosResultadosAxios(){
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'reportes/estado-resultados', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { egresos,compras, ingresos, ventas, suma} = response.data
                this.setState({
                    ... this.state,
                    egresos: egresos,
                    compras: compras,
                    ingresos: ingresos,
                    ventas: ventas,
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

    render() {
        const { form, options, ventas, ingresos, compras, egresos} = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">ESTADO DE RESULTADOS</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div id="id-row" className="row">
                            <div id="col-calendar" className={form.empresa ? 'col-lg-6' : 'col-lg-12'}>
                                <div className={form.empresa ? '' : 'row mx-0 justify-content-center'}>
                                    <div className={form.empresa ? '' : 'col-md-6'}>
                                        <FlujosReportes
                                            form={ form }
                                            options = { options } 
                                            onChangeRange = { this.onChangeRange }
                                            onChange={this.onChange}
                                        />
                                    </div>
                                </div>
                                
                            </div>
                            <div id="col-table"  className="col-md-6 align-self-center d-flex justify-content-center">
                                {
                                    form.empresa ?
                                    <AccordionEstadosResultados
                                        egresos = { egresos }
                                        compras = { compras }
                                        ingresos = { ingresos }
                                        ventas = { ventas }
                                    />
                                    : ''
                                } 
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EstadoResultados)