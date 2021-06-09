import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions} from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert } from '../../../functions/alert'
import { ContratoFormRH } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import moment from 'moment'

class ContratosRhForm extends Component {
    state = {
        formeditado: 0,
        title: 'Nuevo contrato',
        form: {
            empleado:'',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            periodo: '',
            dias: '',
            periodo_pago:'',
            ubicacion_obra:'',
            pagos_hr_extra:'',
            total_obra:'',
            dias_laborables:''
        },
        options: {
            empleados: []
        },
        
        tipo: 'Administrativo',
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
        let aux =action
        aux = aux.split('?')
        switch (aux[0]) {
            case 'add':
                this.setState({
                    ...this.state,
                    tipo: tipo_contrato,
                    title: 'Nuevo contrato '+tipo_contrato,
                    formeditado: 0
                })
                break;
            case 'renovar':
                if (state) {
                    console.log(state)
                    if (state.contrato) {
                        const { form, options} = this.state
                        const { contrato, tipo } = state
                        
                        this.setState({
                            ...this.state,
                            form,
                            options,
                            tipo: tipo,
                            title: 'Renovar contrato '+tipo,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/rh/contratos-rrhh')
                } else
                    history.push('/rh/contratos-rrhh')
                break;
            default:
                break;
        }
        if (!contratos)
            history.push('/')
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v1/rh/contratos-rrhh/`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { empleados } = response.data
                console.log(empleados)
                const { options } = this.state
                options.empleados = setOptions(empleados, 'nombre', 'id')
                Swal.close()
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = (e) => {
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
        const { title } = this.state
        if (title === 'Renovar contrato')
            this.updateEmpleadoAxios()
        else
            this.addEmpleadoAxios()
    }
    onChangeContrato= e => {
        const { name, value, type } = e.target
        const { form } = this.state
        form[name] = value

        if(type === 'radio'){
            form.periodo = value === "true" ? true : false
            if(form.periodo === false){
                form.dias = ''
            }
        }
        switch (name) {
            case 'pagos_hr_extra':
            case 'total_obra':
                form[name] = value.replace(/[,]/gi, '')
                break
            default:
                break;
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
        let dias = moment(endDate).diff(moment(startDate), 'days') + 1
        form.dias = dias
        this.setState({
            ...this.state,
            form
        })
    }
    render() {
        const { options, title, form, formeditado, tipo} = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ContratoFormRH
                            form={form}
                            options={options}
                            formeditado={formeditado}
                            tipo={tipo}
                            onChangeContrato={this.onChangeContrato}
                            onChangeRange={this.onChangeRange}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ContratosRhForm);