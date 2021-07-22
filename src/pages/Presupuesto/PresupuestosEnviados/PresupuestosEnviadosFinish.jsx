import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../../constants"
import { setOptions } from "../../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, questionAlertY } from "../../../functions/alert"
import Layout from "../../../components/layout/layout"
import { UltimoPresupuestoForm } from "../../../components/forms"
import FloatButtons from '../../../components/singles/FloatButtons'
import { save, deleteForm } from '../../../redux/reducers/formulario'
class PresupuestosEnviadosFinish extends Component {
    state = {
        formeditado: 0,
        presupuesto: '',
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: '',
            proveedor: '',
            tiempo_valido: '',
            conceptos: [{
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active: true,
                cantidad: 0,
                importe: 0,
                id: '',
                margen: '',
                precio_unitario: ''
            }],
            fecha_creacion: new Date(),
            fecha_aceptacion: '',
        },
        options: {
            unidades: [],
            partidas: [],
            subpartidas: [],
            proveedores: [],
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
    };

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props;
        const { history: { location: { pathname } } } = this.props;
        const { history, location: { state } } = this.props;
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element;
            return pathname === url + "/finish";
        });
        if (state) {
            if (state.presupuesto) {
                const { presupuesto } = state
                this.getOnePresupuestoAxios(presupuesto.id);
            }
        }
        if (!presupuesto) history.push("/");
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos, areas, partidas, proveedores, unidades, conceptos } = response.data
                const { options, data } = this.state
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => {
                    return aux[concepto.clave] = false
                })
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
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
    async addConceptoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'conceptos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { concepto } = response.data
                this.addConceptoToPresupuestoAxios([concepto])
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async addConceptoToPresupuestoAxios(conceptos) {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        let aux = {
            conceptos: conceptos
        }
        await axios.post(URL_DEV + 'presupuestos/' + presupuesto.id + '/conceptos', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                this.setState({
                    modal: false
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
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    onChangeConceptos = (e) => {
        const { name, value } = e.target;
        const { data, form, presupuesto } = this.state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) 
                        data.subpartidas = partida.subpartidas
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) 
                        data.conceptos = subpartida.conceptos
                    return false
                })
                let array = []
                data.conceptos.map((concepto) => {
                    let aux = false
                    presupuesto.conceptos.map((concepto_form) => {
                        if (concepto) {
                            if (concepto.clave === concepto_form.concepto.clave) {
                                aux = true
                            }
                        }
                        return false
                    })
                    if (!aux) {
                        array.push(concepto)
                    }
                    return false
                })
                break;
            default:
                break;
        }

        form[name] = value;
        this.setState({
            ...this.state,
            form,
            data
        });
    };

    onChange = (key, e, name) => {
        let { value } = e.target
        const { form } = this.state
        if (name === 'margen') {
            value = value.replace('%', '')
        }
        form.conceptos[key][name] = value
        form.conceptos[key].precio_unitario = (form.conceptos[key].costo / (1 - (form.conceptos[key].margen / 100))).toFixed(2)
        form.conceptos[key].importe = (form.conceptos[key].precio_unitario * form.conceptos[key].cantidad).toFixed(2)
        this.setState({
            ...this.state,
            form
        })
    }
    checkButton = (key, e) => {
        const { name, checked } = e.target
        const { form, presupuesto } = this.state
        form.conceptos[key][name] = checked
        if (!checked) {
            let pre = presupuesto.conceptos[key]
            this.onChange(key, { target: { value: pre.descripcion } }, 'descripcion')
            this.onChange(key, { target: { value: pre.costo } }, 'costo')
            this.onChange(key, { target: { value: pre.cantidad_preliminar } }, 'cantidad_preliminar')
            this.onChange(key, { target: { value: '$' + pre.desperdicio } }, 'desperdicio')
        }
        this.setState({
            ...this.state,
            form
        })
    }
    generarPDF = e => {
        e.preventDefault()
        waitAlert()
        this.generarPDFAxios()
    }
    aceptarPresupuesto = e => {
        e.preventDefault()
        waitAlert()
        this.aceptarPresupuestoAxios()
    }
    async aceptarPresupuestoAxios() {
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id + '/aceptar', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/presupuesto'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async getOnePresupuestoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/' + id, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { presupuesto } = response.data
                let aux = []
                let mensajeAux = {}
                presupuesto.conceptos.map((concepto) => {
                    if (concepto.mensaje) {
                        mensajeAux.active = true
                        mensajeAux.mensaje = concepto.mensaje
                    } else {
                        mensajeAux.active = false
                        mensajeAux.mensaje = ''
                    }
                    let precio_unitario = concepto.precio_unitario
                    if (concepto.margen === 0) {
                        precio_unitario = (concepto.costo / (1 - (concepto.margen / 100))).toFixed(2)
                    }
                    let importe = concepto.importe
                    if (precio_unitario !== 0) {
                        importe = (concepto.cantidad * precio_unitario).toFixed(2)
                    }
                    aux.push({
                        descripcion: concepto.descripcion,
                        costo: concepto.costo,
                        margen: concepto.margen,
                        cantidad: concepto.cantidad,
                        precio_unitario: precio_unitario,
                        importe: importe,
                        active: concepto.active ? true : false,
                        id: concepto.id,
                    })
                    return false
                })
                form.conceptos = aux
                this.setState({
                    ...this.state,
                    presupuesto: presupuesto,
                    form,
                    formeditado: 1
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
    async generarPDFAxios() {
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id + '/generar', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/presupuesto'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    save = () => {
        const { form } = this.state
        const { save } = this.props
        let auxObject = {}
        let aux = Object.keys(form)
        aux.map((element) => {
            auxObject[element] = form[element]
            return false
        })
        save({
            form: auxObject,
            page: 'presupuesto/presupuesto/finish'
        })
    }
    recover = () => {
        const { formulario, deleteForm } = this.props
        this.setState({
            ...this.state,
            form: formulario.form
        })
        deleteForm()
    }
    onChangeInput = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    sendPresupuesto = e => {
        e.preventDefault()
        waitAlert()
        questionAlertY(`¿DESEAS ENVIAR EL PRESUPUESTO AL CLIENTE?`, '¡NO PODRÁS REVERTIR ESTO!', () => this.sendPresupuestoAxios())
    }
    async sendPresupuestoAxios() {
        // const { access_token } = this.props.authUser
        // const { form, presupuesto } = this.state
        // await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id + '/generar', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
        //     (response) => {
        //         const { history } = this.props
        //         history.push({
        //             pathname: '/presupuesto/presupuesto'
        //         });
        //     },
        //     (error) => {
        //         printResponseErrorAlert(error)
        //     }
        // ).catch((error) => {
        //     errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
        //     console.log(error, 'error')
        // })
    }
    render() {
        const { form, formeditado, presupuesto } = this.state;
        const { formulario } = this.props
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <UltimoPresupuestoForm
                    formeditado={formeditado}
                    form={form}
                    onChange={this.onChange}
                    checkButton={this.checkButton}
                    generarPDF={this.generarPDF}
                    presupuesto={presupuesto}
                    {...this.props}
                    onChangeInput={this.onChangeInput}
                    // aceptarPresupuesto={this.aceptarPresupuesto}
                    sendPresupuesto={this.sendPresupuesto}
                />
                <FloatButtons
                    save={this.save}
                    recover={this.recover}
                    formulario={formulario}
                    descargar={() => this.generarPDFAxios()}
                    url={'presupuesto/presupuesto/finish'}
                    exportar={true}
                />
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        formulario: state.formulario
    }
}

const mapDispatchToProps = dispatch => ({
    save: payload => dispatch(save(payload)),
    deleteForm: () => dispatch(deleteForm()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestosEnviadosFinish);