import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
import { Form } from 'react-bootstrap';
import { InputGray, SelectSearchGray, InputPhoneGray, Button } from '../../../../components/form-components';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, validateAlert, waitAlert, questionAlert2} from '../../../../functions/alert';
import Swal from 'sweetalert2'
import { setOptions } from '../../../../functions/setters';
import { TEL, URL_DEV, EMAIL } from '../../../../constants';
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
            origen: ''
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: []
        }
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
        const { options: { empresas } } = this.state
        empresas.map(element => {
            if (value.toString() === element.value.toString()) {
                empresa = element
                this.setOptions('tipos', element.tipos)
            }
            return false
        })
        this.setState({
            empresa: empresa
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
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
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
        const { form } = this.state
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'crm/add/lead/telefono', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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

    onSubmitCorreo = async () => {
        let si = ''
        let no = ''
        let respuesta_correo = ''
        if(document.getElementById('si'))
            si = document.getElementById('si').checked
        if(document.getElementById('no'))
            no = document.getElementById('no').checked
        if(si)
            respuesta_correo = 'si'
        if(no)
            respuesta_correo = 'no'
        const { access_token } = this.props.authUser
        // await axios.put(URL_DEV + 'lead/' + lead.id + '/rechazar', {respuesta_correo: respuesta_correo}, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            await axios.put(URL_DEV + 'lead/' , {respuesta_correo: respuesta_correo}, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.getLeadAxios()
                doneAlert('Lead rechazado.')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    render() {
        const { messages, form, options } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario por llamada entrante</span>
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
                                <div className="col-md-4">
                                    <SelectSearchGray
                                        options={options.empresas}
                                        placeholder="¿A QUÉ EMPRESA VA DIRIGIDA EL LEAD?"
                                        name="empresa_dirigida"
                                        value={form.empresa_dirigida}
                                        onChange={this.updateEmpresa}
                                        iconclass="fas fa-building"
                                        withtaglabel={1}
                                        withtextlabel={1}
                                    />
                                </div>
                                {
                                    form.empresa_dirigida !== '' ?
                                        <div className="col-md-4">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                withformgroup={1}
                                                placeholder='NOMBRE DEL LEAD'
                                                iconclass="far fa-user"
                                                name='name'
                                                value={form.name}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.name !== '' ?
                                        <div className="col-md-4">
                                            <SelectSearchGray
                                                options={options.tipos}
                                                placeholder="SELECCIONA EL TIPO DE PROYECTO"
                                                onChange={this.updateTipoProyecto}
                                                name="tipoProyecto"
                                                value={form.tipoProyecto}
                                                withtaglabel={1}
                                                withtextlabel={1}
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.tipoProyecto !== '' ?
                                        <>
                                            <div className="col-md-4 d-flex align-items-center">
                                                <div className="col-md-12">
                                                    <div className="row">
                                                        <div className="col-md-7 px-0">
                                                            <label className='col-form-label font-weight-bold text-dark-60'>¿Es un proyecto de obra y/o diseño?</label>
                                                        </div>
                                                        <div className="col-md-5 px-0">
                                                            <div className="checkbox-inline mt-2">
                                                                <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-secondary mr-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={(e) => this.onChange(e)}
                                                                        name='diseño'
                                                                        checked={form.diseño}
                                                                        value={form.diseño}
                                                                    />
                                                                    DISEÑO
                                                            <span></span>
                                                                </label>
                                                                <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-secondary">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={(e) => this.onChange(e)}
                                                                        name='obra'
                                                                        checked={form.obra}
                                                                        value={form.obra}
                                                                    />
                                                                    Obra
                                                            <span></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        : ''
                                }
                                {
                                    form.diseño || form.obra !== '' ?
                                        <div className="col-md-4">
                                            <InputGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                withformgroup={1}
                                                placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                                iconclass="fas fa-envelope"
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={this.onChange}
                                                patterns={EMAIL}
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.email !== '' ?
                                        <>
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    withformgroup={1}
                                                    name='empresa'
                                                    value={form.empresa}
                                                    placeholder='EMPRESA'
                                                    onChange={this.onChange}
                                                    iconclass='fas fa-building'
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <InputPhoneGray
                                                    placeholder="TELÉFONO DE CONTACTO"
                                                    withicon={1}
                                                    iconclass="fas fa-mobile-alt"
                                                    name="telefono"
                                                    value={form.telefono}
                                                    requirevalidation={1}
                                                    onChange={this.onChange}
                                                    patterns={TEL}
                                                    thousandseparator={false}
                                                    prefix=''
                                                    messageinc="Incorrecto. Ingresa el teléfono de contacto."
                                                />
                                            </div>
                                            <div className="col-md-8">
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
                                                    rows={1}
                                                    as='textarea'
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <SelectSearchGray
                                                    requirevalidation={1}
                                                    options={options.origenes}
                                                    placeholder="SELECCIONA EL ORIGEN PARA EL LEAD"
                                                    name="origen"
                                                    value={form.origen}
                                                    onChange={this.updateOrigen}
                                                    iconclass="fas fa-mail-bulk"
                                                    messageinc="Incorrecto. Selecciona el origen para el lead."
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                />
                                            </div>
                                        </>
                                        : ''
                                }
                            </div>
                            {
                                form.telefono ?
                                    <div className="card-footer py-3 pr-1 text-right">
                                        <Button
                                            icon=''
                                            className="btn btn-primary mr-2"
                                            onClick={(e) => { 
                                                questionAlert2(
                                                    '¿EL FORMULARIO SE LLENO POR MEDIO DE UNA LLAMADA?', '',
                                                    () => this.onSubmitCorreo(),
                                                    <div>
                                                        <Form.Check
                                                            type="radio"
                                                            label="SI"
                                                            name="respuesta_correo"
                                                            id="si"
                                                            className="px-0 mb-2"
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            label="NO"
                                                            name="respuesta_correo"
                                                            id="no"
                                                            className="px-0 mb-2"
                                                        />
                                                    </div>
                                                )
                                            }}
                                            text='ENVIAR'
                                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(LeadTelefono)