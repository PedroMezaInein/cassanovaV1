
import React, { Component } from 'react'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import { Form } from 'react-bootstrap'
import { TEL, EMAIL } from '../../constants'
import Scrollbar from 'perfect-scrollbar-react'
import Layout from '../../components/layout/layout'
import 'perfect-scrollbar-react/dist/style.min.css'
import { setOptions } from '../../functions/setters'
import { getEstados } from '../../functions/options'
import { catchErrors, apiGet, apiPostForm } from '../../functions/api'
import { InputGray, SelectSearchGray, InputPhoneGray, Button } from '../../components/form-components'
import { doneAlert, errorAlert, printResponseErrorAlert, validateAlert, waitAlert, questionAlert2, leadDuplicadoAlert, steps } from '../../functions/alert'
class LeadTelefono extends Component {
    state = {
        messages: [],
        form: {
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
            estado: ''
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: [],
            motivosRechazo: [],
            servicios:[]
        },
        data:{ servicios: [] }
    }
    componentDidMount() {
        this.getOptionsAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'tipo', 'id')
        this.setState({
            options
        })
    }
    updateEmpresa = value => {
        this.onChange({ target: { name: 'empresa_dirigida', value: value } })
        let empresa = ''
        const { options: { empresas }, data: {servicios}, options } = this.state
        empresas.map(element => {
            if (value.toString() === element.value.toString()) {
                empresa = element
                options['tipos'] = setOptions(element.tipos, 'tipo', 'id')
            }
            return false
        })
        let aux = []
        servicios.map((servicio) => {
            if(servicio.empresa){
                if(servicio.empresa.id.toString() === value)
                    aux.push(servicio)
            }else
                aux.push(servicio)
            return ''
        })
        options['servicios'] = setOptions(aux, 'servicio', 'id')
        this.setState({
            ...this.state,
            empresa: empresa,
            options
        })
    }

    updateTipoProyecto = value => {
        const { empresa: { tipos } } = this.state
        this.onChange({ target: { value: value, name: 'tipoProyecto' } })
        let tipoProyecto = ''
        tipos.map((tipo) => {
            if (value.toString() === tipo.id.toString()) {
                tipoProyecto = tipo.tipo
            }
            return false
        })
        this.onChange({ target: { value: tipoProyecto, name: 'tipoProyectoNombre' } })
    }
    updateOrigen = value => {
        this.onChange({ target: { value: value, name: 'origen' } })
    }
    updateServicio = value => {
        this.onChange({ target: { value: value, name: 'servicio' } })
    }
    /* updateServicio = value => {
        this.onChange({ target: { value: value, name: 'servicio' } })
    } */

    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form, } = this.state
        let newName = name
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        if(name === 'fase'){
            form[name] = parseInt(value)
            switch(parseInt(value)){
                case 1:
                    form.obra = false;
                    form.diseño = true;
                    newName = 'diseño'
                    break;
                case 2:
                    form.obra = true;
                    form.diseño = false;
                    newName = 'obra'
                    break;
                default:
                    break;
            }
        }
        this.setState({
            ...this.state,
            form,
            messages: this.updateMessages2(newName, value),
            tipo: newName
        })
    }

    updateMessages2 = (name, value) => {
        const { form, options, empresa: emp } = this.state
        const { name: usuario } = this.props.authUser.user
        
        switch (name) {
            case 'empresa_dirigida':
                let empresa = ''
                options.empresas.map((emp) => {
                    if (emp.value.toString() === value.toString()) {
                        empresa = emp
                    }
                    return false
                })
                if (empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Buen día. Asesoría comercial, <span className="font-weight-boldest">{empresa.name}</span>, lo atiende {usuario}, <span className="font-weight-boldest">¿Con quién tengo el gusto?</span></div>;
                } else if (empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Buenos días. <span className="font-weight-boldest">Infraestructura e Interiores</span>, soy {usuario}, <span className="font-weight-boldest">¿Con quién tengo el gusto?</span></div>;
                }
                break;
            case 'name':
                if (emp.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Mucho gusto <span className="font-weight-boldest">{value}, ¿Cuál es el motivo de su llamada?</span></div>;
                } else if (emp.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Mucho gusto <span className="font-weight-boldest">{value}, ¿En que puedo ayudarte?</span></div>;
                }
                break;
            case 'tipoProyecto':
            case 'tipoProyectoNombre':
                if (emp.name === 'INFRAESTRUCTURA MÉDICA') {
                return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">En <span className="font-weight-boldest">{emp.name}</span> somos especialistas en el diseño, construcción y remodelación de  <span className="font-weight-boldest">{form.tipoProyectoNombre}</span><span className="font-weight-boldest">{form.tipo_proyecto}</span>. <span className="font-weight-boldest">¿Su proyecto se trata de diseño o construcción?</span></div>;
                } else if (emp.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">¡Excelente! Te agradezco que nos tomes en cuenta para tu proyecto puedes indicarme <span className="font-weight-boldest">¿Cuál es el alcance de este?</span></div>;
                }
                break;
            case 'diseño':
            case 'obra':
                if (emp.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles específicos acerca su proyecto <span className="font-weight-boldest">por lo que le solicito me pueda proporcionar su correo electrónico </span>para hacerle llegar un cuestionario.</div>;
                } else if (emp.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles de tu proyecto <span className="font-weight-boldest">¿Me podrías proporcionar tu correo electrónico?</span>&nbsp;Para hacerte llegar un cuestionario.</div>;
                }
                break;
            case 'email':
                if (emp.name === 'INFRAESTRUCTURA MÉDICA') {
                return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Gracias <span className="font-weight-boldest">{form.name}</span>, en unos minutos le <span className="font-weight-boldest">estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted</span>, en él se describe detalladamente cada servicio que podemos brindarle. Una vez que me haga llegar su información, la analizare y <span className="font-weight-boldest">posteriormente me estaré comunicado con usted.</span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Gracias por contactarnos, que tenga un excelente día.</div></>;
                } else if (emp.name === 'INEIN') {
                return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">En unos minutos hare<span className="font-weight-boldest"> llegar a tu correo un cuestionario</span>, te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Muy bien <span className="font-weight-boldest">{form.name}</span>, en un momento te hago el envio del cuestionario. Que tengas un excelente día.</div></>;
                }
                break;
                default:
                return ''
        }
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet('crm/options', access_token).then(
            (response) => {
                Swal.close()
                const { empresas, origenes, motivosRechazo,servicios } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['origenes'] = setOptions(origenes, 'origen', 'id')
                options['servicios']= setOptions(servicios, 'servicio', 'id')
                data.servicios = servicios
                options.motivosRechazo = motivosRechazo
                options.motivosRechazo.map((motivo)=>{
                    motivo.checked = false
                    return ''
                })
                this.setState({
                    ...this.state,
                    options,
                    data
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => { catchErrors(error) })
    }

    onSubmit = async (values) => {
        const { form } = this.state
        const { access_token } = this.props.authUser
        form.llamada = values[0] === 'SI' ? true : false
        form.sendCorreo = values[1] === 'SI' ? true : false
        waitAlert();
        apiPostForm('v2/leads/crm/add/lead/telefono', form, access_token).then(
            (response) => {
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'NUEVO LEAD AGREGADO',
                    () => { history.push({ pathname: '/leads/crm', state: { tipo: 'lead-telefono' } }) } )
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => { catchErrors(error) })
    }
    openModalWithInput = (estatus) => {
        const { options } = this.state
        questionAlert2( 'ESCRIBE EL MOTIVO DE RECHAZO', '', () => this.changeEstatusRechazadoAxios({ estatus: estatus }),
            <div style={{ display: 'flex', maxHeight: '250px'}} >
                <Scrollbar>
                    <form id = 'rechazoForm' name = 'rechazoForm' className="mx-auto w-90">
                        {
                            options.motivosRechazo.map((option, key) => {
                                return (
                                    <Form.Check key = { key } id = { `motivo-rechazo-${option.id}` } 
                                        type="radio" label = { option.motivo } name = 'motivoRechazo'
                                        className="text-justify mb-3" value = { option.motivo } 
                                        onChange = { this.onChangeMotivoRechazo }
                                    />
                                )
                            })
                        }
                        <Form.Check 
                            id="motivo-rechazo-14"
                            type="radio"
                            label="Otro"
                            name = 'motivoRechazo'
                            className="text-justify mb-3"
                            value="Otro"
                            onChange = { this.onChangeMotivoRechazo }
                        />
                        <div id = 'customInputRechazo' className = 'd-none'>
                            <Form.Control
                                placeholder='MOTIVO DE RECHAZO'
                                className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                                id='otro-motivo-rechazo'
                                as="textarea"
                                rows="3"
                            />
                        </div>
                    </form>
                </Scrollbar>
            </div>
        )
    }

    eliminarLeadDuplicadoAxios = async () => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert();
        apiPostForm('v2/leads/crm/add/lead/telefono/duplicado', form, access_token).then(
            (response) => {
                const { history } = this.props
                doneAlert('El lead fue registrado como duplicado.',
                    () => { history.push({ pathname: '/leads/crm' }); })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    changeEstatusRechazadoAxios = async (data) => {
        const { estatus } = data
        const { access_token } = this.props.authUser
        const { form } = this.state
        let elemento = ''
        let motivo = ''
        if(estatus === 'Rechazado'){
            elemento = document.rechazoForm.motivoRechazo.value;
            motivo = document.getElementById('otro-motivo-rechazo').value
        }
        if(elemento === '')
            errorAlert('No seleccionaste el motivo')
        else{
            waitAlert()
            if(elemento === 'Otro')
                if(motivo !== '')
                    elemento = motivo
            form.motivo_rechazo = elemento
            waitAlert();
            apiPostForm('v2/leads/crm/add/lead/telefono/rechazar', form, access_token).then(
                (response) => {
                    const { history } = this.props
                    history.push({ pathname: '/leads/crm' });
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) })
        }
    }

    onChangeMotivoRechazo =  e => {
        const { value } = e.target
        var element = document.getElementById("customInputRechazo");
        if(value === 'Otro'){
            element.classList.remove("d-none");
        }else{
            element.classList.add("d-none");
        }
    }

    render() {
        const { messages, form, options } = this.state
        return (
            <Layout active = 'leads'  { ...this.props } >
                <div className="card-custom card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario nuevo lead</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0">
                        {messages}
                        <Form id="form-lead-telefono"
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(this.onSubmit, e, 'form-lead-telefono')
                                }
                            }
                            {...this.props}>
                            <div className="form-group row form-group-marginless mt-4 mb-0">
                                <div className="col-md-12">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                        withicon = { 0 } withformgroup = { 1 } placeholder = "COMENTARIO"
                                        name = "comentario" value = { form.comentario } onChange = { this.onChange }
                                        rows = { 3 } as = 'textarea' />
                                </div>
                                <div className="col-md-3">
                                    <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                        withicon = { 0 } withformgroup = { 1 } name = 'empresa'
                                        value = { form.empresa } placeholder = 'EMPRESA DEL LEAD'
                                        onChange = { this.onChange } iconclass = 'fas fa-building' />
                                </div>
                                <div className="col-md-3">
                                    <InputPhoneGray placeholder = "TELÉFONO DE CONTACTO" withicon = { 1 }
                                        iconclass = "fas fa-mobile-alt" name = "telefono" value = { form.telefono }
                                        requirevalidation = { 1 } onChange = { this.onChange } patterns = { TEL }
                                        thousandseparator = { false } prefix = '' 
                                        messageinc = "Incorrecto. Ingresa el teléfono de contacto." />
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray requirevalidation = { 1 } options = { options.origenes }
                                        placeholder = "SELECCIONA EL ORIGEN PARA EL LEAD" name = "origen"
                                        value = { form.origen } onChange = { this.updateOrigen } withtaglabel = { 1 }
                                        iconclass = "fas fa-mail-bulk" withtextlabel = { 1 }
                                        messageinc="Incorrecto. Selecciona el origen para el lead." withicon={1}/>
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray options = { getEstados() } placeholder = "SELECCIONA EL ESTADO" name = "estado"
                                        value = { form.estado } onChange = {  (value) => { this.onChange({ target: { value: value, name: 'estado' } }) } } 
                                        requirevalidation = { 1 } messageinc = "Selecciona el estado." customdiv = "mb-0" withtaglabel = { 1 } 
                                        withtextlabel = { 1 } withicon={1} />
                                </div>
                                <div className="col-md-3">
                                    <SelectSearchGray options = { options.empresas } name = "empresa_dirigida"
                                        placeholder = "¿A QUÉ EMPRESA VA DIRIGIDA EL LEAD?" value = { form.empresa_dirigida }
                                        onChange = { this.updateEmpresa } iconclass = "fas fa-building" withtaglabel = { 1 }
                                        withtextlabel = { 1 } withicon={1}/>
                                </div>
                                {
                                    form.empresa_dirigida !== '' &&
                                        <>
                                            <div className="col-md-3">
                                                <SelectSearchGray requirevalidation = { 1 } options = { options.servicios }
                                                    placeholder = "SELECCIONA EL SERVICIO" name = "servicio" value = { form.servicio }
                                                    onChange = { this.updateServicio } iconclass = "fas fa-mail-bulk"
                                                    messageinc = "Incorrecto. Selecciona el servicio." withtaglabel = { 1 }
                                                    withtextlabel = { 1 } withicon={1} />
                                            </div>
                                            <div className="col-md-3">
                                                <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                                    withicon = { 1 } withformgroup = { 1 } placeholder = 'NOMBRE DEL LEAD'
                                                    iconclass = "far fa-user" name = 'name' value = { form.name }
                                                    onChange = { this.onChange } />
                                            </div>
                                        </>
                                }
                                {
                                    form.name !== '' &&
                                        <div className="col-md-3">
                                            <SelectSearchGray options = { options.tipos } placeholder = "SELECCIONA EL TIPO DE PROYECTO"
                                                onChange = { this.updateTipoProyecto } name = "tipoProyecto" value = { form.tipoProyecto }
                                                withtaglabel = { 1 } withtextlabel = { 1 } withicon={1}/>
                                        </div>
                                }
                                {
                                    form.tipoProyecto !== '' &&
                                    <div className="col-md-3 d-flex align-items-center">
                                        <div className="form-group">
                                            <label className='col-form-label font-weight-bold text-dark-60'>¿Es un proyecto de Fase 1 o Fase 2?</label>
                                            <div className="radio-inline">
                                                <label className="radio">
                                                    <input type = "radio" name = 'fase' value = { 1 } onChange = { this.onChange } checked = { form.fase === 1 ? true : false } />Fase 1
                                                    <span></span>
                                                </label>
                                                <label className="radio">
                                                    <input type = "radio" name = 'fase' value = { 2 } onChange = { this.onChange } checked = { form.fase === 2 ? true : false } />Fase 2
                                                    <span></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    (form.diseño || form.obra !== '') &&
                                        <div className="col-md-4">
                                            <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 } withicon = { 1 }
                                                withformgroup = { 1 } requirevalidation = { 1 } placeholder = "CORREO ELECTRÓNICO DE CONTACTO"
                                                iconclass = "fas fa-envelope" type = "email" name = "email" value = { form.email }
                                                onChange = { this.onChange } patterns = { EMAIL } letterCase = { false } messageinc = "Incorrecto. Ingresa el correo." />
                                        </div>
                                }
                            </div>
                            <div className={form.name || form.email ? 'card-footer px-0 pb-0 pt-5 text-right' :''}>
                                {
                                    form.name &&
                                        <>
                                            <Button icon = '' id = "solicitar_cita" className = "btn btn-light-danger font-weight-bold"
                                                onClick = { (e) => { e.preventDefault(); this.openModalWithInput('Rechazado') } }
                                                text = 'RECHAZAR' />
                                            <Button iconv = '' id = "lead_duplicado" className = "btn btn-light-warning font-weight-bold mx-3"
                                                onClick={(e) => { e.preventDefault();
                                                    leadDuplicadoAlert('¡NO PODRÁS REVERTIR ESTO!', 'INGRESARÁS UN LEAD', 'MARCAR COMO DUPLICADO', () => this.eliminarLeadDuplicadoAxios())
                                                }} text='LEAD DUPLICADO' />
                                        </>
                                }
                                {
                                    form.email &&
                                        <Button icon='' className="btn btn-light-primary font-weight-bold ml-2" text='ENVIAR'
                                            onClick = { (e) => {  e.preventDefault(); steps(this.onSubmit)
                                                // questionAlert2(
                                                //     '¿EL FORMULARIO SE LLENÓ POR MEDIO DE UNA LLAMADA?', '',
                                                //     () => this.onSubmit(),
                                                //     <div>
                                                //         <Form.Check type="radio" label="SI" name="respuesta_correo"
                                                //             className="px-0 mb-2" id = 'radio-si' />
                                                //         <Form.Check type="radio" label="NO" name="respuesta_correo"
                                                //             className="px-0 mb-2" id = 'radio-no'  />
                                                //     </div>
                                                // )
                                            }}
                                            />
                                    
                                }
                            </div>
                        </Form>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {return {authUser: state.authUser}}
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(LeadTelefono)