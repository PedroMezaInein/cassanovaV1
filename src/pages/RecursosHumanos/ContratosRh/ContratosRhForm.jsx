import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setOptions} from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { ContratoFormRH } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { setSingleHeader } from '../../../functions/routers'
import moment from 'moment'

class ContratosRhForm extends Component {
    state = {
        formeditado: 0,
        title: 'Nuevo contrato administrativo',
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
            empleados: [],
            empleadosObra:[]
        },
        tipo: 'administrativo',
        contrato:''
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
                    if (state.contrato) {
                        const { form, options} = this.state
                        const { contrato, tipo } = state
                        form.empleado = contrato.empleado.id.toString()
                        form.fechaInicio = contrato.fecha_inicio !== null ? new Date(moment(contrato.fecha_inicio)):''
                        form.fechaFin = contrato.fecha_fin !== null ? new Date(moment(contrato.fecha_fin)):''
                        form.periodo = contrato.indefinido === 1?false:true
                        form.dias = contrato.dias
                        form.periodo_pago = contrato.periodo_pago
                        form.ubicacion_obra = contrato.ubicacion_obra
                        form.pagos_hr_extra = contrato.pagos_hr_extra
                        form.total_obra = contrato.total_obra
                        form.dias_laborables = contrato.dias_laborables
                        this.setState({
                            ...this.state,
                            form,
                            options,
                            tipo: tipo,
                            title: 'Renovar contrato '+tipo,
                            formeditado: 1,
                            contrato:contrato
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
                const { empleados, empleadosObra } = response.data
                const { options } = this.state
                options.empleadosObra = setOptions(empleadosObra, 'nombre', 'id')
                empleados.map((empleado) => {
                    options.empleados.push({
                        name: empleado.nombre,
                        value: empleado.id.toString(),
                        fecha_inicio: empleado.fecha_inicio,
                        fecha_fin: empleado.fecha_fin,
                        contratos:empleado.contratos
                    })
                    return ''
                })
                options.empleados.sort(this.compare)

                Swal.close()
                this.setState({ ...this.state, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    compare( a, b ) {
        if ( a.name < b.name ){
            return -1;
        }
        if ( a.name > b.name ){
            return 1;
        }
        return 0;
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
        if (title === 'Renovar contrato administrativo' || title === "Renovar contrato obra")
            this.renovarContratoAxios()
        else
            this.generarContratoAxios()
    }
    onChangeContrato= e => {
        const { name, value, type } = e.target
        const { form, options } = this.state
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
                break;
            case 'empleado':
                options.empleados.map((empleado)=>{
                    if(empleado.value === form.empleado){
                        console.log(empleado)
                        if (empleado.contratos.length === 0) {
                            form.fechaInicio = new Date(moment(empleado.fecha_inicio))
                        } else {
                            let aux = []
                            empleado.contratos.map((contrato) => {
                                if (contrato.fecha_fin) {
                                    aux.push(contrato.fecha_fin)
                                }
                                return false
                            })
                            aux.sort(function (a, b) {
                                return new Date(b) - new Date(a);
                            });
                            form.fechaInicio = new Date(moment(aux[0]))
                        }
                    }
                })
                break;
            default:
                break;
        }
        console.log(form)
        this.setState({ 
            ...this.state,
            form
        })
    }
    onChangeContratoDate= e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
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
    renovarContratoAxios = async() => {
        waitAlert()
        const { contrato, form, tipo } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/${form.empleado}/contratos/renovar?tipo_contrato=${tipo}`, form, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { contrato } = response.data
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrado fue generado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/rh/contratos-rrhh' });
                
                var win = window.open(contrato.contrato, '_blank');
                if(contrato.carta)
                    window.open(contrato.carta, '_blank');
                win.focus();
                this.setState({ ...this.state, contrato: contrato,})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    generarContratoAxios = async() => {
        waitAlert()
        const { form, tipo } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/empleados/${form.empleado}/contratos/generar?tipo_contrato=${tipo}`, form, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { contrato } = response.data

                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrado fue generado con éxito.')
                const { history } = this.props
                history.push({ pathname: '/rh/contratos-rrhh' });

                var win = window.open(contrato.contrato, '_blank');
                if(contrato.carta)
                    window.open(contrato.carta, '_blank');
                win.focus();
                this.setState({ ...this.state, contrato: contrato })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
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
                            title={title}
                            onChangeContrato={this.onChangeContrato}
                            onChangeRange={this.onChangeRange}
                            onSubmit={this.onSubmit}
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