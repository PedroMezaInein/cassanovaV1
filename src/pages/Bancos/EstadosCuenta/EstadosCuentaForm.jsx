import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Button, SelectSearch, Calendar } from '../../../components/form-components'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { Form } from 'react-bootstrap'
import { waitAlert, doneAlert, errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { Card } from 'react-bootstrap'
class EstadosCuentaForm extends Component {
    state = {
        title:'Nuevo estado de cuenta',
        adjunto: '',
        adjuntoName: '',
        adjuntoFile: '',
        cuentas: [],
        cuenta: '',
        fecha: new Date(),
        estados: [],
        data: {
            estados: []
        }
    }
    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const estados = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo estado de cuenta',
                    formeditado:0
                })
                break;
            default:
                break;
        }
        if (!estados)
            history.push('/')
    }
    onChangeAdjunto = (e) => {
        this.setState({
            ... this.state,
            adjuntoFile: e.target.files[0],
            adjunto: e.target.value,
            adjuntoName: e.target.files[0].name
        })
    }
    deleteAdjunto = () => {
        this.setState({
            ... this.state,
            adjuntoFile: '',
            adjunto: '',
            adjuntoName: ''
        })
    }
    updateCuenta = value => {
        this.setState({
            ... this.state,
            cuenta: value
        })
    }
    submitForm = e => {
        e.preventDefault();
        const { adjunto } = this.state
        if (adjunto) {
            waitAlert()
            this.addEstadoAxios()
        }
    }
    handleChangeDate = date => {
        this.setState({
            ... this.state,
            fecha: date
        })
    }
    async getEstadosCuenta() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'estados-cuentas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados, cuentas } = response.data
                const { data } = this.state
                data.estados = estados
                this.setEstados(estados)
                let aux = []
                cuentas.map((element, key) => {
                    aux.push({ value: element.numero, name: element.nombre })
                })
                this.setState({
                    ... this.state,
                    cuentas: aux
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
    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { adjuntoName, adjuntoFile, cuenta, fecha } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('cuenta', cuenta)
        data.append('fecha', (new Date(fecha)).toDateString())
        await axios.post(URL_DEV + 'estados-cuentas', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { estados } = response.data
                const { data } = this.state
                data.estados = estados
                this.setEstados(estados)
                this.setState({
                    ... this.state,
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    cuenta: '',
                    data
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Estado de cuenta agregado con éxito.')
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
        const { adjunto, adjuntoName, cuentas, cuenta, fecha, title } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={this.submitForm}>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-8">
                                    <SelectSearch
                                        options={cuentas}
                                        placeholder="SELECCIONA LA CUENTA"
                                        name="cuenta"
                                        value={cuenta}
                                        onChange={this.updateCuenta}
                                        iconclass={"far fa-credit-card"}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Calendar
                                        onChangeCalendar={this.handleChangeDate}
                                        placeholder="FECHA"
                                        name="fecha"
                                        value={fecha}
                                        iconclass={"far fa-calendar-alt"}
                                    />
                                </div>
                            </div>
                            <div className="separator separator-dashed mt-1 mb-2 pt-2"></div>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-4 mt-3">
                                    <div className="px-2 d-flex align-items-center">
                                        <div className="image-upload d-flex align-items-center">
                                            <div className="no-label">
                                                <input
                                                    onChange={this.onChangeAdjunto}
                                                    value={adjunto}
                                                    name="adjunto"
                                                    type="file"
                                                    id="adjunto"
                                                    accept="application/pdf"
                                                    className={"mr-3"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    adjuntoName &&
                                    <div className="col-md-8">
                                        <div className="tagify form-control p-1" tabIndex="-1" style={{ borderWidth: "0px" }}>
                                            <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                <div
                                                    title="Borrar archivo"
                                                    className="tagify__tag__removeBtn"
                                                    role="button"
                                                    aria-label="remove tag"
                                                    onClick={(e) => { e.preventDefault(); this.deleteAdjunto() }}
                                                >
                                                </div>
                                                <div><span className="tagify__tag-text p-1 white-space">{adjuntoName}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="row mx-0">
                                <div className="col-md-12 text-center mt-3">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                </div>
                            </div>
                        </Form>
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
export default connect(mapStateToProps, mapDispatchToProps)(EstadosCuentaForm);