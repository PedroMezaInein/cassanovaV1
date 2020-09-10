import React, { Component } from 'react';
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import { FlujoDepartamentosForm, TablaReportes } from '../../components/forms'
import { URL_DEV } from '../../constants'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { setOptions } from '../../functions/setters'

class FlujoDepartamentos extends Component {

    state = {
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date,
            empresas: [],
            empresa: 0,
        },
        options: {
            empresas: [],
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const flujo_departamentos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
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
        this.setState({
            ... this.state,
            form
        })
    }

    render() {
        const { form, options} = this.state
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
                            <div id="col-calendar" className="col-lg-5">
                                <FlujoDepartamentosForm
                                    onChange={this.onChange}
                                    form={form}
                                    options = { options } 
                                />
                            </div>
                            <div id="col-table"  className="col-lg-7">
                                <TablaReportes />
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