import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
import { Form } from 'react-bootstrap';
import { InputGray, Button } from '../../../../components/form-components';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, validateAlert, waitAlert } from '../../../../functions/alert';
import swal from 'sweetalert';
import { setOptions } from '../../../../functions/setters';
import { URL_DEV } from '../../../../constants';
import { Modal } from '../../../../components/singles'
import { AgendaLlamada } from '../../../../components/forms'
class LeadLlamadaCierre extends Component {

    state = {
        presupuesto: {},
        messages: [],
        form: {
            si_reviso_cotizacion: '',
            no_reviso_cotizacion: '',
            fecha: '',
            hora: '',
            minuto: '',
            con_cita: '',
            sin_cita: '',

            name: '',
            empresa: '',
            comentario: '',
            origen: '',
            telefono: '',

        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: []
        },
        formeditado: 0,
        modal_reviso: false,
        modal_duda: false,
        cierre_reviso: true,
        cita_reviso:false,
        cierre_cita: true,
        cita_contrato:false
    }

    componentDidMount() {
        const { location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                let pdfObject = {};
                if(lead.presupuesto_diseño){
                    if(lead.presupuesto_diseño.pdfs){
                        if(lead.presupuesto_diseño.pdfs.length){
                            lead.presupuesto_diseño.pdfs.map((pdf, key)=>{
                                if(pdf.pivot.fecha_envio){
                                    if(Object.keys(pdfObject).length > 0){
                                        if(pdf.pivot.fecha_envio > pdfObject.pivot.fecha_envio){
                                            pdfObject = pdf
                                        }
                                    }else{
                                        pdfObject = pdf
                                    }
                                }
                            })
                        }
                    }
                }
                console.log(pdfObject, 'pdfObject')
                // form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                // form.telefono = lead.telefono
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    options,
                    presupuesto: pdfObject
                })
            }
        }
        // this.getOptionsAxios()
    }

    onChange = e => {
        const { name, value, checked, type } = e.target
        let { form, modal_reviso, modal_duda } = this.state
        form[name] = value
        if (type === 'radio') {
            if (name === "si_reviso_cotizacion") {
                modal_reviso = false
                form["no_reviso_cotizacion"] = false
            }
            else if (name === "no_reviso_cotizacion") {
                modal_reviso = true
                form["si_reviso_cotizacion"] = false
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
        let { form, cierre_reviso, cita_reviso} = this.state
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
            cita_contrato =true
        }
        this.setState({
            cierre_cita,
            cita_contrato,
            form
        })
    };
    

    hideModalReviso = () => {
        this.setState({
            modal_reviso: false,
        });
    };

    hideModalDuda = () => {
        this.setState({
            modal_duda: false,
        });
    };

    updateMessages2 = (name, value) => {
        const { lead } = this.state
        switch (name) {
            case 'si_reviso_cotizacion':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <> <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Me encanta que haya tomado el tiempo de revisar la cotización, espero que haya sido de su agrado. <span className="font-weight-boldest"><em>¿Le ha surgido una duda con respecto al contenido enviado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify"><span className="font-weight-boldest"><em>¿Puedo contar con su visto bueno para programar la firma de contrato y comenzar el diseño?</em></span></div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Me encanta que tomaste el tiempo de revisar la cotización, espero que haya sido de tu agrado. <span className="font-weight-boldest"><em>¿Tienes alguna duda con respecto al contenido enviado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify"><span className="font-weight-boldest"><em>¿Puedo contar con tu visto bueno para programar la firma de contrato y comenzar el diseño?</em></span></div></>;
                }
                break;
            // case 'sin_cita':
            //     if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
            //         return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¡Excelente! Ahora el siguiente paso es que nos brindes tu visto bueno y me compartas tus datos,para programar la firma del contrato y comenzar el diseño.<span className="font-weight-boldest"><em> ¿Podemos programar la firma el día de mañana en el horario que mejor se acomode a tu agenda?</em></span></div>;
            //     } else if (lead.empresa.name === 'INEIN') {
            //         return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¡Excelente! Ahora el siguiente paso es que nos brinde su visto bueno y me comparta sus datos, para programar la firma del contrato y comenzar el diseño.<span className="font-weight-boldest"><em> ¿Podemos programar la firma el día de mañana en el horario que mejor se acomode a su agenda?</em></span></div>;
            //     }
            //     break;
            // case 'sin_cita':
            //     if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
            //         return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¡Excelente! Ahora el siguiente paso es que nos brinde su visto bueno y me comparta sus datos, para programar la firma del contrato y comenzar el diseño.<span className="font-weight-boldest"><em> ¿Podemos programar la firma el día de mañana en el horario que mejor se acomode a su agenda?</em></span></div>;
            //     } else if (lead.empresa.name === 'INEIN') {
            //         return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Me encanta que tomaste el tiempo de revisar la cotización, espero que haya sido de tu agrado. <span className="font-weight-boldest"><em>¿Tienes alguna duda con respecto al contenido enviado?</em></span></div>;
            //     }
            //     break;
            default:
                return <></>
                break;
        }
    }

    // async getOptionsAxios() {
    //     waitAlert()
    //     const { access_token } = this.props.authUser
    //     await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             swal.close()
    //             const { empresas, origenes } = response.data
    //             const { options } = this.state
    //             options['empresas'] = setOptions(empresas, 'name', 'id')
    //             options['origenes'] = setOptions(origenes, 'origen', 'id')
    //             this.setState({
    //                 ...this.state,
    //                 options
    //             })
    //         },
    //         (error) => {
    //             console.log(error, 'error')
    //             if (error.response.status === 401)
    //                 forbiddenAccessAlert();
    //             else
    //                 errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }

    onSubmit = async (e) => {
        waitAlert();
        const { form, lead } = this.state
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + `crm/update/lead/llamada-saliente/${lead.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste los permisos.',)
                const { history } = this.props
                history.push({
                    pathname: '/leads/crm',
                    // state: { tipo: 'lead-telefono' }
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { messages, form, lead, modal_reviso, modal_duda, cierre_reviso, cita_reviso, cierre_cita, cita_contrato } = this.state
        return (

            <Layout active='leads' {...this.props} >
                <Modal title='Agenda una nueva llamada.' show={modal_reviso} handleClose={this.hideModalReviso}>
                    <AgendaLlamada form={form} onChange={this.onChangeReviso} lead={lead} cierre_reviso={cierre_reviso} cita_reviso={cita_reviso} />
                </Modal>
                <Modal title='Agendar firma de contrato' show={modal_duda} handleClose={this.hideModalDuda}>
                    <AgendaLlamada form={form} onChange={this.onChangeDuda} lead={lead} cierre_cita={cierre_cita} cita_contrato={cita_contrato}/>
                </Modal>
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario de cierre de venta</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0">
                        {
                            messages.length === 0 ?
                                lead !== undefined ?
                                    lead.empresa.name === 'INFRAESTRUCTURA MÉDICA' ?
                                        <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest"><em>¿Cómo ha estado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Bien, gracias <span className="font-weight-boldest"><em>¿Y tu?</em></span></div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico con usted para comentarle que el día de ayer le envié la cotización para su proyecto. <span className="font-weight-boldest"><em>¿Tuvo la oportunidad de revisarla?</em></span> La envié a su correo a las <span className="font-weight-boldest">15:30 hrs</span></div> </>
                                        : lead.empresa.name === 'INEIN' ?
                                            <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest"><em>¿Cómo has estado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico para comentarte que el día de ayer envié a tu correo la cotización para del proyecto. <span className="font-weight-boldest"><em>¿Tuviste la oportunidad de revisarla?</em></span> La envié a su correo a las <span className="font-weight-boldest">15:30 hrs</span></div> </>
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
                            {...this.props}>
                            <div className="form-group row form-group-marginless mt-4 mb-0">
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
                                    form.si_reviso_cotizacion || form.no_reviso_cotizacion !== '' ?
                                        <div className="col-md-4 d-flex align-items-center">
                                            <div className="col-md-12">
                                                <div className="row">
                                                    <div className="col-md-7 px-0">
                                                        <label className='col-form-label font-weight-bold text-dark-60'>¿Se programa firma de contrato?</label>
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
                                    form.sin_cita?
                                        <div className="col-md-12">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={0}
                                                placeholder="COMENTARIO"
                                                name="comentario"
                                                value={form.comentario}
                                                onChange={this.onChange}
                                                rows={2}
                                                as='textarea'
                                            />
                                        </div>
                                    :''
                                }
                            </div>
                            {/* {
                                form.sin_cita?
                                    <div className="card-footer py-3 pr-1 text-right">
                                        <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(this.onSubmit, e, 'form-lead-cierre')
                                                }
                                            } />
                                    </div>
                                    : ''
                            } */}
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

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadLlamadaCierre)