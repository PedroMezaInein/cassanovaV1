import { connect } from 'react-redux'
import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Form } from 'react-bootstrap'
import { InputGray, Button } from '../../../../components/form-components'
import axios from 'axios'
import { doneAlert, errorAlert, printResponseErrorAlert, validateAlert, waitAlert } from '../../../../functions/alert'
import { URL_DEV } from '../../../../constants'
import { Modal } from '../../../../components/singles'
import { AgendaLlamada, AgendaLlamadaUbicacion} from '../../../../components/forms'
class LeadLlamadaCierre extends Component {
    state = {
        presupuesto: {},
        messages: [],
        form: {
            si_reviso_cotizacion: '',
            no_reviso_cotizacion: '',
            fecha: new Date(),
            hora: "08",
            minuto: "00",
            hora_final: "08",
            minuto_final: "00",
            con_cita: '',
            sin_cita: '',
            comentario: '',
            si_agendar_llamada: '',
            no_agendar_llamada: '',
            correos:[],
            tipo: '',
            name: '',
            empresa: '',
            ubicacion: ''
        },
        tipo: '',
        formeditado: 0,
        modal_reviso: false,
        modal_duda: false,
        cierre_reviso: true,
        cita_reviso: false,
        cierre_cita: true,
        cita_contrato: false
    }

    componentDidMount() {
        const { location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form } = this.state
                const { lead } = state
                let pdfObject = {};
                if (lead.presupuesto_diseño) {
                    if (lead.presupuesto_diseño.pdfs) {
                        if (lead.presupuesto_diseño.pdfs.length) {
                            lead.presupuesto_diseño.pdfs.map((pdf, key) => {
                                if (pdf.pivot.fecha_envio) {
                                    if (Object.keys(pdfObject).length > 0) {
                                        if (pdf.pivot.fecha_envio > pdfObject.pivot.fecha_envio) {
                                            pdfObject = pdf
                                        }
                                    } else {
                                        pdfObject = pdf
                                    }
                                }
                                return ''
                            })
                        }
                    }
                }
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    presupuesto: pdfObject
                })
            }
        }
    }

    onChange = e => {
        const { name, value, checked, type } = e.target
        let { form, modal_reviso, modal_duda } = this.state
        form[name] = value
        if (type === 'radio') {
            if (name === "si_reviso_cotizacion") {
                form["no_reviso_cotizacion"] = false
            }
            else if (name === "no_reviso_cotizacion") {
                form["si_reviso_cotizacion"] = false
            }

            if (name === "si_agendar_llamada") {
                modal_reviso = true
                form["no_agendar_llamada"] = false
            }
            else if (name === "no_agendar_llamada") {
                modal_reviso = false
                form["si_agendar_llamada"] = false
            }

            if (name === "sin_cita") {
                modal_duda = false
                form["con_cita"] = false
            }
            else if (name === "con_cita") {
                modal_duda = true
                form["sin_cita"] = false
            }
            form[name] = checked
        }
        this.setState({
            ...this.state,
            form,
            modal_reviso,
            modal_duda,
            messages: this.updateMessages2(name, value),
            tipo: name
        })
    }

    onChangeReviso = (e) => {
        let { form, cierre_reviso, cita_reviso } = this.state
        let value = e.target.value
        let name = e.target.name
        form[name] = value
        if (form["hora"] !== "" && form["minuto"] !== "" && form["fecha"] !== "") {
            cierre_reviso = false
            cita_reviso = true
        }
        this.setState({
            cierre_reviso,
            cita_reviso,
            form
        })
    };

    onChangeDuda = (e) => {
        let { form, cierre_cita, cita_contrato } = this.state
        let value = e.target.value
        let name = e.target.name
        form[name] = value
        if (form["hora"] !== "" && form["minuto"] !== "" && form["fecha"] !== "") {
            cierre_cita = false
            cita_contrato = true
        }
        this.setState({
            cierre_cita,
            cita_contrato,
            form
        })
    };

    hideModalReviso = () => {
        this.setState({
            modal_reviso: true,
        });
    };

    hideModalDuda = () => {
        this.setState({
            modal_duda: true,
        });
    };

    updateMessages2 = (name, value) => {
        const { lead } = this.state
        switch (name) {
            case 'no_reviso_cotizacion':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Me imagino que ha estado ocupado. <span className="font-weight-boldest">¿Le parece bien si agendamos una llamada para poder hablar sobre la cotización?</span></div>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Me imagino que ha estado ocupado. <span className="font-weight-boldest">¿Te parece bien si agendamos una llamada para poder hablar sobre la cotización?</span></div>;
                }
                break;
            case 'no_agendar_llamada':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Ok <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>, quedo en espera de su respuesta y atenta a cualquier duda que pudiera tener con respecto a lo enviado. Que tenga excelente día. </div>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Ok <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>, quedo en espera de tu respuesta y atenta a cualquier duda que pudieras tener con respecto a lo enviado. Que tengas excelente día.</div>;
                }
                break;
            case 'si_reviso_cotizacion':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <> <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Me encanta que haya tomado el tiempo de revisar la cotización, espero que haya sido de su agrado. <span className="font-weight-boldest">¿Le ha surgido una duda con respecto al contenido enviado?</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify"><span className="font-weight-boldest">¿Puedo contar con su visto bueno para programar la firma de contrato y comenzar el diseño?</span></div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Me encanta que tomaste el tiempo de revisar la cotización, espero que haya sido de tu agrado. <span className="font-weight-boldest">¿Tienes alguna duda con respecto al contenido enviado?</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify"><span className="font-weight-boldest">¿Puedo contar con tu visto bueno para programar la firma de contrato y comenzar el diseño?</span></div></>;
                }
                break;
            case 'sin_cita':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Ok <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>, el área de proyectos analizará sus cambios, en cuanto tenga respuesta me estaré comunicando con usted. Quedo atenta a cualquier duda que pudiera tener. Que tenga excelente día.</div>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify my-4">Ok <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>, el área de proyectos analizará tus cambios, en cuanto tenga respuesta me estaré comunicando contigo. Quedo atenta a cualquier duda que pudieras tener. Que tengas excelente día.</div>;
                }
                break;
            default:
                return <></>
        }
    }

    onSubmit = async (e) => {
        waitAlert();
        const { form, lead } = this.state
        if(form.no_reviso_cotizacion === true){
            if(form.no_agendar_llamada === true){
                form.tipo = 'no-agendar-llamada'
            }else{
                if(form.si_agendar_llamada === true){
                    form.tipo = 'agendar-llamada'
                }
            }
        }else{
            if(form.si_reviso_cotizacion === true){
                if(form.sin_cita === true){
                    form.tipo = 'no-visto-bueno'
                }else{
                    if(form.con_cita === true){
                        form.tipo = 'visto-bueno'
                    }
                }
            }
        }
        if(form.tipo === '' )
            errorAlert('Error de flujo')
        else{
            const { access_token } = this.props.authUser
            await axios.post(URL_DEV + `crm/update/lead/llamada-cierre/${lead.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Lead actualizado con éxito.',)
                    const { history } = this.props
                    history.push({
                        pathname: '/leads/crm',
                    });    
                },
                (error) => {
                printResponseErrorAlert(error)
            }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }

    presupuesto_fecha() {
        let { presupuesto } = this.state
        if(!presupuesto)
            return ''
        else
            if(!presupuesto.pivot)
                return ''
            else
                if(!presupuesto.pivot.fecha_envio)
                    return ''
        let show_fecha = ""
        let hoy = new Date().getDate();
        let fecha_presupuesto = new Date(presupuesto.pivot.fecha_envio)

        let dia_presupuesto = fecha_presupuesto.getDate()

        let numMes = fecha_presupuesto.getMonth() + 1
        let mes = ""
        switch (numMes) {
            case 1:
                mes = "Enero";
                break;
            case 2:
                mes = "Febrero";
                break;
            case 3:
                mes = "Marzo";
                break;
            case 4:
                mes = "Abril";
                break;
            case 5:
                mes = "Mayo";
                break;
            case 6:
                mes = "Junio";
                break;
            case 7:
                mes = "Julio";
                break;
            case 8:
                mes = "Agosto";
                break;
            case 9:
                mes = "Septiembre";
                break;
            case 10:
                mes = "Octubre";
                break;
            case 11:
                mes = "Noviembre";
                break;
            case 12:
                mes = "Diciembre";
                break;
            default: break;
        }
        if (hoy === dia_presupuesto) {
            show_fecha = "EL DÍA DE HOY"
        } else if (hoy - 1 === dia_presupuesto) {
            show_fecha = "EL DÍA DE AYER"
        } else {
            show_fecha = 'EL DÍA ' + dia_presupuesto + ' DE ' + mes
        }
        return show_fecha;
    }
    presupuesto_hora() {
        let { presupuesto } = this.state
        if(!presupuesto)
            return ''
        else
            if(!presupuesto.pivot)
                return ''
            else
                if(!presupuesto.pivot.fecha_envio)
                    return ''
        let show_hora = ""
        let fecha_presupuesto = new Date(presupuesto.pivot.fecha_envio)
        let hora = fecha_presupuesto.getHours();
        let minuto = fecha_presupuesto.getMinutes();

        let validacion_min = minuto < 10 ? ':0' + minuto : ':' + minuto
        let validacion_hora = hora < 11 ? ' de la mañana' : ' de la tarde'

        show_hora = hora + validacion_min + validacion_hora
        return show_hora;
    }

    tagInputChange = ( nuevoTipos ) => {
        const uppercased = nuevoTipos
        /* const uppercased = nuevoTipos.map(tipo => tipo.toUpperCase());  */
        const { form } = this.state 
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        form.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            form
        })
    }
    render() {
        const { messages, form, lead, modal_reviso, modal_duda, cierre_reviso, cita_reviso, cierre_cita, cita_contrato } = this.state
        const { authUser, staticContext, ...props } = this.props
        return (
            <Layout active='leads' {...this.props} >
                <Modal title = 'Agenda una nueva llamada.' show = { modal_reviso } handleClose = { this.hideModalReviso } >
                    <AgendaLlamada 
                        form = { form }
                        onChange = { this.onChangeReviso }
                        lead = { lead }
                        cierre_reviso = { cierre_reviso }
                        cita_reviso = { cita_reviso }
                        onSubmit = { this.onSubmit }
                    />
                </Modal>
                <Modal size="lg" title='Agendar firma de contrato' show = { modal_duda } handleClose = { this.hideModalDuda } >
                    <AgendaLlamadaUbicacion
                        form = { form }
                        onChange = { this.onChangeDuda }
                        lead = { lead }
                        cierre_cita = { cierre_cita }
                        cita_contrato = { cita_contrato }
                        tagInputChange = { (e) => this.tagInputChange(e) }
                        onSubmit = { this.onSubmit }
                    />
                </Modal>
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario de cierre de venta</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0 pb-3">
                        {
                            messages.length === 0 ?
                                lead !== undefined ?
                                    lead.empresa.name === 'INFRAESTRUCTURA MÉDICA' ?
                                        <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest">¿Cómo ha estado?</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Bien, gracias <span className="font-weight-boldest">¿Y tu?</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico con usted para comentarle que <span className="font-weight-boldest">{this.presupuesto_fecha()}</span> le envié la cotización para su proyecto. <span className="font-weight-boldest">¿Tuvo la oportunidad de revisarla?</span> La envié a su correo a las <span className="font-weight-boldest">{this.presupuesto_hora()}</span></div> </>
                                        : lead.empresa.name === 'INEIN' ?
                                            <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest">¿Cómo has estado?</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico para comentarte que <span className="font-weight-boldest">{this.presupuesto_fecha()}</span> te envié a tu correo la cotización para del proyecto. <span className="font-weight-boldest">¿Tuviste la oportunidad de revisarla?</span> La envié a su correo a las <span className="font-weight-boldest">{this.presupuesto_hora()}</span></div> </>
                                            : ''
                                    : ''
                                : messages
                        }
                        <Form id="form-lead-cierre"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(this.onSubmit, e, 'form-lead-cierre')
                                }
                            }
                            {...props}>
                            <div className="form-group row form-group-marginless my-4">
                                <div className="col-md-4 d-flex align-items-center">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-7 px-0">
                                                <label className='col-form-label font-weight-bold text-dark-60'>¿Reviso la cotización?</label>
                                            </div>
                                            <div className="col-md-5 px-0">
                                                <div className="radio-inline mt-2">
                                                    <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold mr-3">
                                                        <input
                                                            type="radio"
                                                            name='si_reviso_cotizacion'
                                                            value={form.si_reviso_cotizacion}
                                                            onChange={(e) => this.onChange(e)}
                                                            checked={form.si_reviso_cotizacion}
                                                        />
                                                        Si
                                                        <span></span>
                                                    </label>
                                                    <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold">
                                                        <input
                                                            type="radio"
                                                            name='no_reviso_cotizacion'
                                                            value={form.no_reviso_cotizacion}
                                                            onChange={(e) => this.onChange(e)}
                                                            checked={form.no_reviso_cotizacion}
                                                        />
                                                        No
                                                        <span></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    form.no_reviso_cotizacion ?
                                        <div className="col-md-4 d-flex align-items-center">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-7 px-0">
                                                        <label className='col-form-label font-weight-bold text-dark-60'>¿Agendar llamada?</label>
                                                    </div>
                                                    <div className="col-md-5 px-0">
                                                        <div className="radio-inline mt-2">
                                                            <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold mr-3">
                                                                <input
                                                                    type="radio"
                                                                    name='si_agendar_llamada'
                                                                    value={form.si_agendar_llamada}
                                                                    onChange={(e) => this.onChange(e)}
                                                                    checked={form.si_agendar_llamada}
                                                                />
                                                                    Si
                                                                    <span></span>
                                                            </label>
                                                            <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold">
                                                                <input
                                                                    type="radio"
                                                                    name='no_agendar_llamada'
                                                                    value={form.no_agendar_llamada}
                                                                    onChange={(e) => this.onChange(e)}
                                                                    checked={form.no_agendar_llamada}
                                                                />
                                                                    No
                                                                    <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    form.si_reviso_cotizacion ?
                                        <div className="col-md-4 d-flex align-items-center">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-7 px-0">
                                                        <label className='col-form-label font-weight-bold text-dark-60'>¿Se da visto bueno para firma de contrato?</label>
                                                    </div>
                                                    <div className="col-md-5 px-0">
                                                        <div className="radio-inline mt-2">
                                                            <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold mr-3">
                                                                <input
                                                                    type="radio"
                                                                    name='con_cita'
                                                                    value={form.con_cita}
                                                                    onChange={(e) => this.onChange(e)}
                                                                    checked={form.con_cita}
                                                                />
                                                                Si
                                                                <span></span>
                                                            </label>
                                                            <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold">
                                                                <input
                                                                    type="radio"
                                                                    name='sin_cita'
                                                                    value={form.sin_cita}
                                                                    onChange={(e) => this.onChange(e)}
                                                                    checked={form.sin_cita}
                                                                />
                                                                No
                                                                <span></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    form.no_agendar_llamada || form.sin_cita ?
                                        <div className="col-md-12">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={0}
                                                withformgroup={1}
                                                placeholder="COMENTARIO"
                                                name="comentario"
                                                value={form.comentario}
                                                onChange={this.onChange}
                                                rows={2}
                                                as='textarea'
                                            />
                                        </div>
                                        : ''
                                }
                            </div>
                            {
                                form.no_agendar_llamada || form.sin_cita ?
                                    <div className="card-footer pt-3 pb-0 pr-1 text-right">
                                        <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(this.onSubmit, e, 'form-lead-cierre')
                                                }
                                            } />
                                    </div>
                                    : ''
                            }
                        </Form>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadLlamadaCierre)