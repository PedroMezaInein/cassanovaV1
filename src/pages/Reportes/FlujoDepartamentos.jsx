import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { FlujosReportes, TablaReportesDepartamento } from '../../components/forms'
import { setOptions, setMoneyTableSinSmall} from '../../functions/setters'
import { waitAlert, errorAlert, printResponseErrorAlert } from '../../functions/alert'
import { URL_DEV } from '../../constants'

class FlujoDepartamentos extends Component {

    state = {
        suma:'',
        departamentos:[],
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            empresas: [],
            empresa: '',
        },
        options: {
            empresas: [],
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const flujo_departamentos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!flujo_departamentos)
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
            console.error(error, 'error')
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
            this.getReporteFlujosProyectosAxios()
        }
    }

    async getReporteFlujosProyectosAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'reportes/flujo-departamentos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { suma, departamentos} = response.data

                this.setState({
                    ...this.state,
                    departamentos: departamentos,
                    suma:suma
                })
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
        const { form, options, departamentos, suma} = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">FLUJO DE DEPARTAMENTOS</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div id="id-row" className="row">
                            <div id="col-calendar" className={form.empresa ? 'col-lg-5' : 'col-lg-12'}>
                                <div className={form.empresa ? '' : 'row mx-0 justify-content-center'}>
                                    <div className={form.empresa ? '' : 'col-md-6'}>
                                        <FlujosReportes
                                            form={form}
                                            options={options}
                                            onChangeRange = { this.onChangeRange }
                                            onChange={this.onChange}
                                            className="mb-3"
                                        />
                                    </div>
                                </div>
                                
                            </div> 
                            <div id="col-table" className='col-lg-7 align-self-center'>
                                {
                                    form.empresa ? 
                                    <>
                                        <div className="d-flex justify-content-center">
                                            <TablaReportesDepartamento    
                                                departamentos={departamentos}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <div className="d-flex flex-column mt-2">
                                                <div className="d-flex align-items-center justify-content-between flex-grow-1 mt-5">
                                                    <div className="mr-2">
                                                        <div className="text-right font-weight-bolder font-size-h6">CUENTAS POR COBRAR:</div>
                                                    </div>
                                                    <div className="font-weight-boldest font-size-h6 text-primary ml-2">{setMoneyTableSinSmall(suma)}</div>
                                                </div>
                                            </div>
                                        </div>  
                                    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(FlujoDepartamentos)