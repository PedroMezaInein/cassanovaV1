import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../../constants"
import { setOptions } from "../../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from "../../../functions/alert"
import Layout from "../../../components/layout/layout"
import { UltimoPresupuestoForm } from "../../../components/forms"
import { TagInputGray } from '../../../components/form-components'
import { setSingleHeader } from "../../../functions/routers"
import { Modal } from "react-bootstrap"
class PresupuestosEnviadosFinish extends Component {
    state = {
        modal: false,
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
            correos_presupuesto: []
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
        modalObject: {
            file: {},
        }
    };

    componentDidMount() {
        this.setState({
            ...this.state, modal:false
        })
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

    getOnePresupuestoAxios = async(id) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/${id}`, { headers: setSingleHeader(access_token) }).then(
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
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOptionsAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}presupuestos/options`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos, areas, partidas, proveedores, unidades, conceptos } = response.data
                const { options, data } = this.state
                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => { return aux[concepto.clave] = false })
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
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addConceptoAxios = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}conceptos`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { concepto } = response.data
                this.addConceptoToPresupuestoAxios([concepto])
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addConceptoToPresupuestoAxios = async (conceptos) => {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        let aux = { conceptos: conceptos }
        await axios.post(`${URL_DEV}presupuestos/${presupuesto.id}/conceptos`, aux, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                this.getOnePresupuestoAxios(presupuesto.id)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
                this.setState({ ...this.state, modal: false })
            }, (error) => { printResponseErrorAlert(error) }
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
    
    onChangeInput = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    
    // aceptarPresupuesto = e => {
    //     e.preventDefault()
    //     waitAlert()
    //     this.aceptarPresupuestoAxios()
    // }
    // async aceptarPresupuestoAxios() {
    //     const { access_token } = this.props.authUser
    //     const { form, presupuesto } = this.state
    //     await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id + '/aceptar', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             const { presupuesto } = response.data
    //             this.getOnePresupuestoAxios(presupuesto.id)
    //             doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
    //             const { history } = this.props
    //             history.push({
    //                 pathname: '/presupuesto/presupuesto'
    //             });
    //         },
    //         (error) => {
    //             printResponseErrorAlert(error)
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }

    tagInputChange = (nuevosCorreos) => {
        const { form } = this.state 
        let unico = {};
        nuevosCorreos.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.correos_presupuesto = nuevosCorreos ? Object.keys(unico) : [];
        this.setState({ ...this.state, form })
    }

    generarPDF = e => {
        e.preventDefault()
        const { form } = this.state
        if(form.tiempo_valido !== ''){
            waitAlert()
            this.generarPDFAxios() 
        }else{
            errorAlert('Ingresa el periodo de validez')
        }
    }

    generarPDFAxios = async() =>{
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.put(`${URL_DEV}presupuestos/${presupuesto.id}/generar`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { adjunto } = response.data
                const { form } = this.state
                const { user } = this.props.authUser
                if(user.email)
                    form.correos_presupuesto.push(user.email)
                Swal.close()
                this.setState({...this.state, modalObject: {adjunto: adjunto}, modal: true, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    sendMail = async () => {
        waitAlert();
        const { access_token } = this.props.authUser
        const { form, presupuesto, modalObject } = this.state
        form.presupuestoAdjunto = modalObject.adjunto
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                doneAlert('Correo enviado con éxito', () => { this.handleCloseModal() } ) 
            },  (error) => { this.handleCloseModal(); printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    /* sendPresupuesto = e => {
        e.preventDefault()
        waitAlert()
        this.sendPresupuestoAxios()
    } */

    sendPresupuestoAxios = async () => {
        /* -------------------------------------------------------------------------- */
        /*                         ANCHOR Sending presupuesto                         */
        /* -------------------------------------------------------------------------- */
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/finish`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                doneAlert('Márgenes actualizados actualizado con éxito', 
                    () => this.getOnePresupuestoAxios(presupuesto.id))
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    handleCloseModal = () => {
        const { form, modalObject, presupuesto } = this.state
        form.correos_presupuesto = []
        modalObject.adjunto = {}
        this.setState({...this.state,modal: false, modalObject, form })
        this.getOnePresupuestoAxios(presupuesto.id)
    }

    render() {
        
        const { form, presupuesto, modal, modalObject } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <UltimoPresupuestoForm formeditado={1} form={form} onChange={this.onChange} checkButton={this.checkButton} generarPDF={this.generarPDF}
                    presupuesto={presupuesto} {...this.props} onChangeInput={this.onChangeInput}
                    // aceptarPresupuesto={this.aceptarPresupuesto}
                    sendPresupuesto={ (e) => { e.preventDefault(); waitAlert(); this.sendPresupuestoAxios(); } } />
                <Modal show = { modal } 
                    //onHide = { () => this.setState({...this.state, modal:false})}
                    onHide = { this.handleCloseModal }
                    centered
                    contentClassName = 'swal2-popup d-flex'
                    >
                    <Modal.Header className = 'border-0 justify-content-center'>
                        <h2 className="swal2-title text-center">¡PRESUPUESTO GENERADO!</h2>
                    </Modal.Header>
                    <Modal.Body className = 'py-0'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div className="text-primary font-weight-bolder font-size-lg">
                                    Documento generado:
                                </div>
                                <div>
                                    {
                                        modalObject.adjunto !== undefined ?
                                            <a className="text-muted font-weight-bold text-hover-success" target= '_blank' rel="noreferrer" href = {modalObject.adjunto.url}>
                                                {modalObject.adjunto.name}
                                            </a>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-5 text-justify">
                                Si deseas enviar el presupuesto agrega el o los correos del {'destinatario'}, de lo contario da clic en <span className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <TagInputGray swal = { true } tags = { form.correos_presupuesto } placeholder = "CORREO(S)" iconclass = "flaticon-email" 
                                        uppercase = { false } onChange = { this.tagInputChange } /> 
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" class="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex"
                            onClick = { this.handleCloseModal }>CANCELAR</button>
                        <button type="button" class="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex"
                            onClick = { this.sendMail } >SI, ENVIAR</button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser} }
const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PresupuestosEnviadosFinish);