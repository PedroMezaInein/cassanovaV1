import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
import { Form } from 'react-bootstrap';
import { InputGray, SelectSearchGray, InputPhoneGray, Button } from '../../../../components/form-components';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, validateAlert, waitAlert } from '../../../../functions/alert';
import swal from 'sweetalert';
import { setOptions } from '../../../../functions/setters';
import { TEL, URL_DEV, EMAIL } from '../../../../constants';
class LeadLlamadaCierre extends Component {

    state = {
        messages: [],
        form: {
            respuesta_positiva:'',
            respuesta_negativa:'',
            name: '',
            empresa: '',
            empresa_dirigida: '',
            tipoProyecto: '',
            comentario: '',
            diseño: '',
            obra: '',
            email: '',
            tipoProyectoNombre: '',
            origen: '',
            telefono: '',
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: []
        },
        formeditado: 0
    }

    componentDidMount() {
        const { location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email.toUpperCase()
                form.empresa_dirigida = lead.empresa.id.toString()
                form.telefono = lead.telefono
                // options['tipos'] = setOptions(lead.empresa.tipos, 'tipo', 'id')
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    options
                })
            }
        }
        this.getOptionsAxios()
    }

    setOptionsTipo = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'tipo', 'id')
        this.setState({
            options
        })
    }

    updateEmpresa = value => {
        this.onChange({ target: { name: 'empresa_dirigida', value: value } })
        let empresa = ''
        const { options: { empresas } } = this.state
        empresas.map(element => {
            if (value.toString() === element.value.toString()) {
                empresa = element
                this.setOptionsTipo('tipos', element.tipos)
            }
            return false
        })
        this.setState({
            empresa: empresa
        })
    }

    updateTipoProyecto = value => {
        const { options } = this.state
        this.onChange({ target: { value: value, name: 'tipoProyecto' } })
        let tipoProyecto = ''
        options.tipos.map((tipo) => {
            if (value.toString() === tipo.value.toString()) {
                tipoProyecto = tipo.name
            }
            return false
        })
        this.onChange({ target: { value: tipoProyecto, name: 'tipoProyectoNombre' } })
    }

    updateOrigen = value => {
        this.onChange({ target: { value: value, name: 'origen' } })
    }

    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form, } = this.state
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        this.setState({
            ...this.state,
            form,
            messages: this.updateMessages2(name, value),
            tipo: name
        })
    }

    // servicio = servicios => {
    //     let servicio = ""
    //     servicios.map((element) => {
    //         servicio = element.servicio
    //         return false
    //     })
    //     return servicio
    // }

    updateMessages2 = (name, value) => {
        const { form, lead } = this.state
        switch (name) {
            case 'respuesta_negativa':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles específicos acerca su proyecto <span className="font-weight-boldest"><em>por lo que le solicito me pueda proporcionar su correo electrónico </em></span> para hacerle llegar un cuestionario</div>;
                    
                }
                else if (lead.empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles de tu proyecto <span className="font-weight-boldest"><em>¿Me podrías proporcionar tu correo electrónico?</em></span> para hacerte llegar un cuestionario</div>;
                }
                break;
            case 'email':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Gracias, en unos minutos le <span className="font-weight-boldest"><em>estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </em></span>, en él se describe detalladamente cada servicio que podemos brindarle.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Una vez que me haga llegar su información, la analizare y <span className="font-weight-boldest"><em>posteriormente me estaré comunicado con usted.</em></span></div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Gracias por contactarnos, que tenga un excelente día.</div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">En unos minutos te hare<span className="font-weight-boldest"><em> llegar a tu correo un cuestionario</em></span>, te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Muy bien <span className="font-weight-boldest">{form.name.split(" ", 1)}</span>, en un momento te hago el envio del cuestionario. Que tengas un excelente día.</div></>;
                }
                break;
            default:
                return <></>
                break;
        }
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, origenes } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['origenes'] = setOptions(origenes, 'origen', 'id')
                this.setState({
                    ...this.state,
                    options
                })
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
                    state: { tipo: 'lead-telefono' }
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
        const { messages, form, options, lead } = this.state
        const { name: usuario } = this.props.authUser.user
        return (
            <Layout active='leads' {...this.props} >
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario por llamada de salida</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0">
                        {
                            messages.length === 0 ?
                                lead !== undefined ?
                                    lead.empresa.name === 'INFRAESTRUCTURA MÉDICA' ?
                                        <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest"><em>¿Cómo ha estado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico con usted para comentarle que el día de ayer le envié la cotización para su proyecto. <span className="font-weight-boldest"><em>¿Tuvo la oportunidad de revisarla?</em></span> La envié a su correo a las <span className="font-weight-boldest">15:30 hrs</span></div> </>
                                        : lead.empresa.name === 'INEIN' ?
                                            <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día <span className="font-weight-boldest">{lead.nombre.split(" ", 1)}</span>. <span className="font-weight-boldest"><em>¿Cómo has estado?</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Únicamente me comunico para comentarte que el día de ayer envié a tu correo la cotización para del proyecto. <span className="font-weight-boldest"><em>¿Tuviste la oportunidad de revisarla?</em></span> La envié a su correo a las <span className="font-weight-boldest">15:30 hrs</span></div> </>
                                            : ''
                                    : ''
                                : messages
                        }
                        <Form id="form-lead-telefono"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(this.onSubmit, e, 'form-lead-telefono')
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
                                                            name='respuesta_positiva'
                                                            value={form.respuesta_positiva}
                                                            onChange={(e) => this.onChange(e)}
                                                            checked={form.respuesta_positiva}
                                                        />
                                                                    Si
                                                            <span></span>
                                                    </label>
                                                    <label className="radio radio-outline radio-outline-2x radio-dark-60 text-dark-50 font-weight-bold">
                                                        <input
                                                            type="radio"
                                                            name='respuesta_negativa'
                                                            value={form.respuesta_negativa}
                                                            onChange={(e) => this.onChange(e)}
                                                            checked={form.respuesta_negativa}
                                                        />
                                                                    No
                                                            <span></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            {/* {
                                form.telefono ?
                                    <div className="card-footer py-3 pr-1 text-right">
                                        <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(this.onSubmit, e, 'form-lead-telefono')
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