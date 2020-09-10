import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import { FlujoProyectosForm, TablaReportes } from '../../components/forms'
import { setOptions } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { URL_DEV } from '../../constants'


class FlujoProyectos extends Component {

    state = {
        proyectos:[],
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
        const flujo_proyectos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!flujo_proyectos)
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
            this.getReporteFlujosProyectosAxios()
        }
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeRange = range => {
        waitAlert()
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })

        if(form.empresa !== '' && form.fechaInicio !== '' && form.fechaFin !==''){
            this.getReporteFlujosProyectosAxios()
        }
    }

    async getReporteFlujosProyectosAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(URL_DEV + 'reportes/flujo-proyectos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa } = response.data
                const { proyectos } = this.state


                this.setState({
                    ... this.state,
                    proyectos: empresa.proyectos ? empresa.proyectos : []
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
        const { form, options, proyectos} = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">FLUJO DE PROYECTOS</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div id="id-row" className="row">
                            <div id="col-calendar" className="col-lg-5">
                                <FlujoProyectosForm
                                    form={form}
                                    options={options}
                                    onChangeRange = { this.onChangeRange }
                                    onChange={this.onChange}
                                />
                            </div>

                            <div id="col-table" className="col-lg-7">
                                <TablaReportes    
                                    proyectos={proyectos}
                                />
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex flex-column mt-5">
                                        <div className="d-flex align-items-center justify-content-between flex-grow-1 mt-5">
                                            <div className="mr-2">
                                                <h5 className="font-weight-bolder">CUENTAS POR COBRAR</h5>
                                                <div className="text-muted font-size-lg mt-2">Total</div>
                                            </div>
                                            <div className="font-weight-boldest font-size-h3 text-primary ml-5">$24,200</div>
                                        </div>
                                    </div>
                                </div>                        
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

export default connect(mapStateToProps, mapDispatchToProps)(FlujoProyectos)