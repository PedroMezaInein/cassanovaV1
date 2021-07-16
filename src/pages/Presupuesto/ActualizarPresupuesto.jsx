import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../constants"
import { setOptions } from "../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from "../../functions/alert"
import Layout from "../../components/layout/layout"
import { ActualizarPresupuestoForm, AgregarConcepto } from "../../components/forms"
import { Modal } from '../../components/singles'
import FloatButtons from '../../components/singles/FloatButtons'
import { save, deleteForm } from '../../redux/reducers/formulario'
class ActualizarPresupuesto extends Component {
    state = {
        key: 'nuevo',
        formeditado: 0,
        modal: false,
        presupuesto: '',
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: '',
            proveedor: '',
            conceptos: [{
                unidad: '',
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active: true,
                cantidad: 0,
                importe: 0,
                id: '',
                mensajes: {
                    active: false,
                    mensaje: ''
                }
            }],
            conceptosNuevos: []
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
    openModal = () => {
        const { options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            options,
            modal: true,
            title: 'Agregar concepto',
            form: this.clearForm(),
            formeditado: 0
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if (element !== 'conceptos' && element !== 'conceptosNuevos')
                form[element] = ''
            return false
        })
        return form
    }
    handleClose = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        this.setState({
            ...this.state,
            modal: !modal,
            options,
            title: 'Agregar concepto',
            concepto: '',
            form: this.clearForm()
        })
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props;
        const { history: { location: { pathname } } } = this.props;
        const { history, location: { state } } = this.props;
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element;
            return pathname === url + "/update";
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
                    aux[concepto.clave] = false
                    return false
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
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
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
                form.conceptosNuevos = []
                array.map((element, key) => {
                    form.conceptosNuevos.push(element)
                    form.conceptosNuevos[key].active = false
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
    checkButtonConceptos = (e, key) => {
        const { checked } = e.target
        const { form } = this.state
        form.conceptosNuevos[key].active = checked
        this.setState({
            ...this.state,
            form
        })
    }
    onChange = (key, e, name) => {
        let { value } = e.target
        const { form, presupuesto } = this.state
        if (name === 'desperdicio') {
            value = value.replace('%', '')
        }
        form['conceptos'][key][name] = value
        let cantidad = form['conceptos'][key]['cantidad_preliminar'] * (1 + (form['conceptos'][key]['desperdicio'] / 100))
        cantidad = cantidad.toFixed(2)
        let importe = cantidad * form['conceptos'][key]['costo']
        importe = importe.toFixed(2)
        form['conceptos'][key]['cantidad'] = cantidad
        form['conceptos'][key]['importe'] = importe
        if (name !== 'mensajes' && name !== 'desperdicio')
            if (presupuesto.conceptos[key][name] !== form.conceptos[key][name]) {
                form.conceptos[key].mensajes.active = true
            } else {
                form.conceptos[key].mensajes.active = false
            }
        if (name === 'desperdicio')
            if (presupuesto.conceptos[key][name].toString() !== form.conceptos[key][name].toString()) {
                form.conceptos[key].mensajes.active = true
                form.conceptos[key].mensajes.mensaje = ('Actualización del desperdicio a un ' + value + '%').toUpperCase()
            } else {
                form.conceptos[key].mensajes.active = false
                form.conceptos[key].mensajes.mensaje = ''
            }
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
            let aux = { active: false, mensaje: '' }
            this.onChange(key, { target: { value: pre.descripcion } }, 'descripcion')
            this.onChange(key, { target: { value: pre.costo } }, 'costo')
            this.onChange(key, { target: { value: pre.cantidad_preliminar } }, 'cantidad_preliminar')
            this.onChange(key, { target: { value: '$' + pre.desperdicio } }, 'desperdicio')
            this.onChange(key, { target: { value: aux } }, 'mensajes')
        }
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.updatePresupuestosAxios()
    }
    onSubmitConcept = e => {
        e.preventDefault()
        const { key, form } = this.state
        waitAlert()
        if (key === 'nuevo')
            this.addConceptoAxios()
        else {
            let aux = []
            form.conceptosNuevos.map((concepto) => {
                if (concepto.active)
                    aux.push(concepto)
                return false
            })
            this.addConceptoToPresupuestoAxios(aux)
        }
    }
    async getOnePresupuestoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/' + id, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { presupuesto } = response.data
                let aux = []
                presupuesto.conceptos.map((concepto) => {
                    let mensajeAux = {}
                    if (concepto.mensaje) {
                        mensajeAux = {
                            active: true,
                            mensaje: concepto.mensaje
                        }
                    } else {
                        mensajeAux = {
                            active: false,
                            mensaje: ''
                        }
                    }
                    let bandera = false
                    form.conceptos.map((elemento) => {
                        if (concepto.id === elemento.id) {
                            bandera = elemento
                        }
                        return false
                    })
                    if (bandera) {
                        aux.push(
                            bandera
                        )
                    } else {
                        aux.push({
                            descripcion: concepto.descripcion,
                            costo: concepto.costo.toFixed(2),
                            cantidad_preliminar: concepto.cantidad_preliminar,
                            desperdicio: concepto.desperdicio,
                            cantidad: (concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))).toFixed(2),
                            importe: ((concepto.cantidad_preliminar * (1 + (concepto.desperdicio / 100))) * concepto.costo).toFixed(2),
                            active: concepto.active ? true : false,
                            id: concepto.id,
                            mensajes: mensajeAux,
                            unidad: concepto ? concepto.concepto ? concepto.concepto.unidad ? concepto.concepto.unidad.nombre : '' : '' : ''
                        })
                    }
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
    async updatePresupuestosAxios() {
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id, form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El presupuesto fue modificado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    controlledTab = value => {
        this.setState({
            ...this.state,
            form: this.clearForm(),
            key: value
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
            page: 'presupuesto/presupuesto/update'
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
    render() {
        const { form, title, options, formeditado, presupuesto, modal, data, key } = this.state;
        const { formulario } = this.props
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <ActualizarPresupuestoForm
                    formeditado={formeditado}
                    form={form}
                    onChange={this.onChange}
                    checkButton={this.checkButton}
                    onSubmit={this.onSubmit}
                    presupuesto={presupuesto}
                    openModal={this.openModal}
                    showInputsCalidad={false}
                    {...this.props}
                />
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose}>
                    <AgregarConcepto
                        options={options}
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChangeConceptos}
                        setOptions={this.setOptions}
                        checkButtonConceptos={this.checkButtonConceptos}
                        data={data}
                        onSelect={this.controlledTab}
                        activeKey={key}
                        onSubmit={this.onSubmitConcept}
                    />
                </Modal>
                <FloatButtons
                    save={this.save}
                    recover={this.recover}
                    formulario={formulario}
                    url={'presupuesto/presupuesto/update'}
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

export default connect(mapStateToProps, mapDispatchToProps)(ActualizarPresupuesto);