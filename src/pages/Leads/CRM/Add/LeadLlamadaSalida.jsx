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
class LeadLlamadaSalida extends Component {
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
        // const { authUser: { user: { permisos } } } = this.props
        // const { history: { location: { pathname } } } = this.props
        // const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                console.log(lead,'lead')
                form.name = lead.nombre==='SIN ESPECIFICAR'?'':lead.nombre.toUpperCase()
                form.email = lead.email.toUpperCase()
                form.empresa_dirigida = lead.empresa.id.toString()
                form.telefono= lead.telefono
                options['tipos'] = setOptions(lead.empresa.tipos, 'tipo', 'id')
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
    // setOptions = (name, array) => {
    //     const { options } = this.state
    //     options[name] = setOptions(array, 'nombre', 'id')
    //     this.setState({
    //         ...this.state,
    //         options
    //     })
    // }
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
        // console.log(empresa.tipos,'empresa')
        // const { empresa: { tipos } } = this.state
        const { options } = this.state
        this.onChange({ target: { value: value, name: 'tipoProyecto' } })
        let tipoProyecto = ''
        options.tipos.map((tipo) => {
            if (value.toString() === tipo.value.toString()) {
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
    servicio = servicios => {
        let servicio = ""
        servicios.map((element) => {
            servicio = element.servicio
            return false
        })
        return servicio
    }
    updateMessages2 = (name, value) => {
        const { form, lead } = this.state
        // const { name: usuario } = this.props.authUser.user
        switch (name) {
            case 'name':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                return <><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Mucho gusto <span className="font-weight-boldest"><em>{form.name.split(" ", 1)}</em></span>, recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto con usted a relación del servicio que seleccionó de <span className="font-weight-boldest"><em>{this.servicio(lead.servicios)}</em></span> {this.servicio(lead.servicios)==='Diseño de proyectos para el sector salud'?'.':'para el sector salud.'}</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Excelente, puede indicarme <span className="font-weight-boldest"><em>¿Qué tipo de proyecto es?</em></span></div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Mucho gusto <span className="font-weight-boldest"><em>{form.name.split(" ", 1)}</em></span>, recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto en relación del servicio que seleccionaste de <span className="font-weight-boldest"><em>{this.servicio(lead.servicios)}</em>.</span></div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">¡EXCELENTE! TE AGRADEZCO QUE NOS TOMES EN CUENTA PARA TU PROYECTO, PUEDES INDICARME <span className="font-weight-boldest"><em>¿Qué tipo de proyecto es?</em></span></div></>;
                }
            case 'tipoProyecto':
            case 'tipoProyectoNombre':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">En <span className="font-weight-boldest">IM {lead.empresa.name}</span> somos especialistas en el diseño, construcción y remodelación de  <span className="font-weight-boldest">{form.tipoProyectoNombre}</span><span className="font-weight-boldest">{form.tipo_proyecto}</span>. <span className="font-weight-boldest"><em>¿Su proyecto se trata de diseño o construcción?</em></span></div>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">De acuerdo, me parece increíble. <span className="font-weight-boldest"><em>¿Tu proyecto se trata de diseño o construcción?</em></span></div>;
                }
            case 'diseño':
            case 'obra':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    if(lead.email===null){
                        return<div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles específicos acerca su proyecto <span className="font-weight-boldest"><em>por lo que le solicito me pueda proporcionar su correo electrónico </em></span> para hacerle llegar un cuestionario</div>;
                    }else{
                    return<><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify mb-3">Me gustaría conocer más detalles específicos acerca su proyecto <span className="font-weight-boldest"><em>por lo que le solicito me pueda corroborar su correo electrónico </em></span> para hacerle llegar un cuestionario. Su correo es: <span className="font-weight-boldest"><em>{lead.email}</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Gracias, en unos minutos le <span className="font-weight-boldest"><em>estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </em></span>, en él se describe detalladamente cada servicio que podemos brindarle.</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Una vez que me haga llegar su información, la analizare y <span className="font-weight-boldest"><em>posteriormente me estaré comunicado con usted.</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg text-justify">Gracias por contactarnos, que tenga un excelente día.</div></>;
                    }
                }
                else if (lead.empresa.name === 'INEIN') {
                    if(lead.email===null){
                        return<div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles de tu proyecto <span className="font-weight-boldest"><em>¿Me podrías proporcionar tu correo electrónico?</em></span> para hacerte llegar un cuestionario</div>;
                    }else{
                        return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify mb-3">Me gustaría conocer más detalles de tu proyecto <span className="font-weight-boldest"><em>¿Me podrías corroborar tu correo electrónico?</em></span>&nbsp;para hacerte llegar un cuestionario. Tu correo es: <span className="font-weight-boldest"><em>{lead.email}</em></span></div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">En unos minutos te hare<span className="font-weight-boldest"><em> llegar a tu correo un cuestionario</em></span>, te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg text-justify">Muy bien <span className="font-weight-boldest">{form.name.split(" ", 1)}</span>, en un momento te hago el envio del cuestionario. Que tengas un excelente día.</div></>;
                }
            }
            case 'email':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Gracias, en unos minutos le <span className="font-weight-boldest"><em>estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </em></span>, en él se describe detalladamente cada servicio que podemos brindarle.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Una vez que me haga llegar su información, la analizare y <span className="font-weight-boldest"><em>posteriormente me estaré comunicado con usted.</em></span></div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Gracias por contactarnos, que tenga un excelente día.</div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">En unos minutos te hare<span className="font-weight-boldest"><em> llegar a tu correo un cuestionario</em></span>, te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Muy bien <span className="font-weight-boldest">{form.name.split(" ", 1)}</span>, en un momento te hago el envio del cuestionario. Que tengas un excelente día.</div></>;
                }
            default:
                return <></>
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
                
                // console.log(options.empresas)
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
        await axios.put(URL_DEV +`crm/update/lead/llamada-saliente/${lead.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
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
        const { messages, form, options, formeditado, lead } = this.state
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
                        <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día mi nombre es {usuario}, asesora comercial en <span className="font-weight-boldest">IM {lead.empresa.name}</span>. {lead.nombre==='SIN ESPECIFICAR'? '¿Con quién tengo el gusto':'¿Tengo el gusto con'}<span className="font-weight-boldest"><em>{lead.nombre==='SIN ESPECIFICAR'?'':lead.nombre}</em></span>?</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Mucho gusto <span className="font-weight-boldest"><em>{lead.nombre.split(" ", 1)}</em></span>, recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto con usted a relación del servicio que seleccionó de <span className="font-weight-boldest"><em>{this.servicio(lead.servicios)}</em></span> {this.servicio(lead.servicios)==='Diseño de proyectos para el sector salud'?'.':'para el sector salud.'}</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Excelente, puede indicarme <span className="font-weight-boldest"><em>¿Qué tipo de proyecto es?</em></span></div></>
                                        : lead.empresa.name === 'INEIN' ?
                                            <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Buen día mi nombre es {usuario}, asesora comercial en <span className="font-weight-boldest">Infraestructura e Interiores</span>. {lead.nombre==='SIN ESPECIFICAR'? '¿Con quién tengo el gusto':'¿Tengo el gusto con'}<span className="font-weight-boldest"><em>{lead.nombre==='SIN ESPECIFICAR'?'':lead.nombre}</em></span>?</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Mucho gusto <span className="font-weight-boldest"><em>{lead.nombre.split(" ", 1)}</em></span>, recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto a relación del servicio que seleccionaste de <span className="font-weight-boldest"><em>{this.servicio(lead.servicios)}</em></span>.</div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">¡EXCELENTE! TE AGRADEZCO QUE NOS TOMES EN CUENTA PARA TU PROYECTO, PUEDES INDICARME <span className="font-weight-boldest"><em>¿Qué tipo de proyecto es?</em></span></div></>
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
                                {/* <div className="col-md-4">
                                    <SelectSearchGray
                                        options={options.empresas}
                                        placeholder="¿A QUÉ EMPRESA VA DIRIGIDA EL LEAD?"
                                        name="empresa_dirigida"
                                        value={form.empresa_dirigida}
                                        onChange={this.updateEmpresa}
                                        iconclass="fas fa-building"
                                        formeditado={formeditado}
                                    />
                                </div> */}
                                <div className="col-md-4">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={1}
                                        placeholder='NOMBRE DEL LEAD'
                                        iconclass="far fa-user"
                                        name='name'
                                        value={form.name}
                                        onChange={this.onChange}
                                    // formeditado={formeditado}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <SelectSearchGray
                                        options={options.tipos}
                                        placeholder="SELECCIONA EL TIPO DE PROYECTO"
                                        onChange={this.updateTipoProyecto}
                                        name="tipoProyecto"
                                        value={form.tipoProyecto}
                                    />
                                </div>
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
                                    form.diseño || form.obra !== '' ?
                                        <>
                                            <div className="col-md-4">
                                                <InputGray
                                                    withtaglabel={1}
                                                    withtextlabel={1}
                                                    withplaceholder={1}
                                                    withicon={1}
                                                    name='empresa'
                                                    value={form.empresa}
                                                    placeholder='Empresa'
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
                                                    onChange={this.onChange}
                                                    patterns={TEL}
                                                    thousandseparator={false}
                                                    prefix=''
                                                />
                                            </div>
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
                                                    rows={1}
                                                    as='textarea'
                                                />
                                            </div>
                                            {/* <div className="col-md-4">
                                                <SelectSearchGray
                                                    options={options.origenes}
                                                    placeholder="SELECCIONA EL ORIGEN PARA EL LEAD"
                                                    name="origen"
                                                    value={form.origen}
                                                    onChange={this.updateOrigen}
                                                    iconclass="fas fa-mail-bulk"
                                                />
                                            </div> */}
                                        </>
                                        : ''
                                }
                            </div>
                            {
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

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadLlamadaSalida)