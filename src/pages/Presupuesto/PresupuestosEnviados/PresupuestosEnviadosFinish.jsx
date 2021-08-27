import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../../constants"
import { setOptions } from "../../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from "../../../functions/alert"
import Layout from "../../../components/layout/layout"
import { UltimoPresupuestoForm } from "../../../components/forms"
import { CreatableMultiselectGray } from '../../../components/form-components'
import { setSingleHeader } from "../../../functions/routers"
import { Modal } from "react-bootstrap"
import { save, deleteForm } from '../../../redux/reducers/formulario'
import FloatButtons from '../../../components/singles/FloatButtons'
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
                precio_unitario: '',
                bg_margen:true,
                vicio_oculto:false
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
            correos_clientes: []
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
        modalObject: {
            file: {},
        },
        aux_presupuestos: {
            conceptos: false,
            volumetrias: false,
            costos: false,
            revision:false,
            utilidad: false,
            espera: false,
            aceptado: false,
            rechazado: false,
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
                    if(concepto.vicio_oculto){
                        importe = (0).toFixed(2)
                    }
                    aux.push({
                        descripcion: concepto.descripcion,
                        costo: concepto.costo,
                        margen: concepto.margen,
                        cantidad: concepto.cantidad,
                        precio_unitario: precio_unitario,
                        importe: importe,
                        active: concepto.active ? true : false,
                        bg_margen:concepto.margen > 0 ? false : true,
                        id: concepto.id,
                        vicio_oculto:concepto.vicio_oculto ? true : false
                    })
                    return false
                })
                form.tiempo_valido = presupuesto.tiempo_valido
                form.conceptos = aux
                this.showStatusPresupuestos(presupuesto)
                this.setState({
                    ...this.state,
                    presupuesto: presupuesto,
                    form,
                    formeditado: 1
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
            console.error(error, 'error')
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
        const { form, presupuesto } = this.state
        if (name === 'margen') {
            value = value.replace('%', '')
            if ((presupuesto.conceptos[key][name].toString() !== value) && value !== 0 && value !== '' ) {
                form['conceptos'][key]['bg_margen'] = false
            }else{
                form['conceptos'][key]['bg_margen'] = true
            }
        }
        form.conceptos[key][name] = value
        form.conceptos[key].precio_unitario = this.getPrecioUnitario(key)
        
        if(form.conceptos[key].vicio_oculto){
            form.conceptos[key].importe = (0).toFixed(2)
        }else{
            form.conceptos[key].importe = this.getImporte(key)
        }
        this.setState({
            ...this.state,
            form
        })
    }
    getPrecioUnitario(key){
        const { form } = this.state
        let precio_unitario =(form.conceptos[key].costo / (1 - (form.conceptos[key].margen / 100))).toFixed(2)
        return precio_unitario
    }
    
    getImporte(key){
        const { form } = this.state
        let importe = (form.conceptos[key].precio_unitario * form.conceptos[key].cantidad).toFixed(2)
        return importe
    }
    checkButton = (key, e) => {
        const { name, checked } = e.target
        const { form, /*presupuesto*/ } = this.state
        form.conceptos[key][name] = checked ? 1 : 0
        // if (!checked) {
        //     let pre = presupuesto.conceptos[key]
        //     this.onChange(key, { target: { value: pre.descripcion } }, 'descripcion')
        //     this.onChange(key, { target: { value: pre.costo } }, 'costo')
        //     this.onChange(key, { target: { value: pre.cantidad_preliminar } }, 'cantidad_preliminar')
        //     this.onChange(key, { target: { value: '$' + pre.desperdicio } }, 'desperdicio')
        // }
        if(name === 'vicio_oculto'){
            if(form.conceptos[key]['vicio_oculto']){
                form.conceptos[key].importe = (0).toFixed(2)
            }else{
                form.conceptos[key].importe = this.getImporte(key)
            }
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
    //         console.error(error, 'error')
    //     })
    // }

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
        const { presupuesto } = this.state
        await axios.get(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/pdf`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { adjunto } = response.data
                const { form, presupuesto, options } = this.state
                const { user } = this.props.authUser
                let aux_contactos = [];
                if(user.email){
                    form.correos_presupuesto.push({ value: user.email, label: user.email })
                    aux_contactos.push({
                        value: user.email,
                        label: user.email
                    })
                }
                options.correos_clientes = []
                presupuesto.proyecto.contactos.forEach(contacto => {
                    aux_contactos.push({
                        value: contacto.correo.toLowerCase(),
                        label: contacto.correo.toLowerCase()
                    })
                    return ''
                })
                options.correos_clientes = aux_contactos
                Swal.close()
                this.setState({...this.state, modalObject: {adjunto: adjunto}, modal: true, form, options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    sendMail = async () => {
        waitAlert();
        const { access_token } = this.props.authUser
        const { form, presupuesto, modalObject } = this.state
        form.presupuestoAdjunto = modalObject.adjunto
        var arrayCorreos = form.correos_presupuesto.map(function (obj) {
            return obj.label;
        });
        form.correos_presupuesto = arrayCorreos
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/correo`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => { 
                doneAlert('Correo enviado con éxito', () => { this.handleCloseModal() } ) 
            },  (error) => { this.handleCloseModal(); printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    /* sendPresupuesto = e => {
        e.preventDefault()
        waitAlert()
        this.sendPresupuestoAxios()
    } */

    sendPresupuestoAxios = async (flag) => {
        /* -------------------------------------------------------------------------- */
        /*                         ANCHOR Sending presupuesto                         */
        /* -------------------------------------------------------------------------- */
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state
        await axios.post(`${URL_DEV}v2/presupuesto/presupuestos/${presupuesto.id}/finish`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { presupuesto } = response.data
                if(flag){
                    this.generarPDFAxios()
                }else{
                    doneAlert('Márgenes actualizados actualizado con éxito', 
                    () => this.getOnePresupuestoAxios(presupuesto.id))
                }
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleCloseModal = () => {
        const { form, modalObject, presupuesto } = this.state
        form.correos_presupuesto = []
        modalObject.adjunto = {}
        this.setState({...this.state,modal: false, modalObject, form })
        this.getOnePresupuestoAxios(presupuesto.id)
    }
    showStatusPresupuestos= (presupuesto) => {
        let auxiliar = '';
        if (presupuesto) {
            if (presupuesto.estatus)
                switch (presupuesto.estatus.estatus) {
                    case 'Conceptos':
                        auxiliar = { conceptos: true, volumetrias: false, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Volumetrías':
                        auxiliar = { conceptos: true, volumetrias: true, costos: false, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Costos':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: false, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En revisión':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: false, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'Utilidad':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: false, aceptado: false, rechazado: false };
                        break;
                    case 'En espera':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: false };
                        break;
                    case 'Aceptado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: true, rechazado: false };
                        break;
                    case 'Rechazado':
                        auxiliar = { conceptos: true, volumetrias: true, costos: true, revision: true, utilidad: true, espera: true, aceptado: false, rechazado: true };
                        break;
                    default:
                        break;
                }
        }
        this.setState({
            ...this.state,
            aux_presupuestos: auxiliar
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
            page: 'presupuesto/utilidad-presupuestos/finish'
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
    handleChangeCreateMSelect = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label
            })
            return ''
        })
        form.correos_presupuesto = currentValue
        this.setState({...this.state, form })
    };
    
    render() {
        const { form, presupuesto, modal, modalObject, aux_presupuestos, options } = this.state;
        const { formulario } = this.props
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <UltimoPresupuestoForm formeditado={1} form={form} onChange={this.onChange} checkButton={this.checkButton} 
                    presupuesto={presupuesto} {...this.props} onChangeInput={this.onChangeInput}
                    // aceptarPresupuesto={this.aceptarPresupuesto}
                    generarPDF = { (e) => { e.preventDefault(); waitAlert(); this.sendPresupuestoAxios(true); } } 
                    sendPresupuesto = { (e) => { e.preventDefault(); waitAlert(); this.sendPresupuestoAxios(); } } 
                    aux_presupuestos={aux_presupuestos}/>
                <Modal show = { modal }
                    onHide = { this.handleCloseModal }
                    centered
                    contentClassName = 'swal2-popup d-flex'
                    >
                    <Modal.Header className = 'border-0 justify-content-center'>
                        <h2 className="swal2-title text-center">¡PDF GENERADO!</h2>
                    </Modal.Header>
                    <Modal.Body className = 'py-0'>
                        <div className = 'row mx-0 justify-content-center'>
                            <div className="col-md-12 text-center py-2">
                                <div className="text-dark-75 font-weight-bolder font-size-lg">
                                    {
                                        modalObject.adjunto !== undefined ?
                                            <u> 
                                                <a className="text-primary font-weight-bold text-hover-success" target= '_blank' rel="noreferrer" href = {modalObject.adjunto.url}>
                                                    DA CLIC AQUÍ PARA VER <i className="las la-hand-point-right text-primary icon-md ml-1"></i> EL PRESUPUESTO
                                                </a>
                                            </u>
                                        : <></>
                                    }
                                </div>
                            </div>
                            <div className="col-md-11 font-weight-light mt-5 text-justify">
                                Si deseas enviar el presupuesto agrega el o los correos de los destinatarios, de lo contario da clic en <span className="font-weight-bold">cancelar</span>.
                            </div>
                            <div className="col-md-11 mt-5">
                                <div>
                                    <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email"
                                        requirevalidation = { 1 } messageinc = "Selecciona el o los correos" uppercase={false} 
                                        onChange = { this.handleChangeCreateMSelect } options={options.correos_clientes} elementoactual = { form.correos_presupuesto }
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className = 'border-0 justify-content-center'>
                        <button type="button" className="swal2-cancel btn-light-gray-sweetalert2 swal2-styled d-flex"
                            onClick = { this.handleCloseModal }>CANCELAR</button>
                        <button type="button" className="swal2-confirm btn-light-success-sweetalert2 swal2-styled d-flex"
                            onClick = { this.sendMail } >ENVIAR</button>
                    </Modal.Footer>
                </Modal>
                <FloatButtons
                    save={this.save}
                    recover={this.recover}
                    formulario={formulario}
                    url={'presupuesto/utilidad-presupuestos/finish'}
                    title='del presupuesto'
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