import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
import { Card, Nav, Tab } from 'react-bootstrap';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, validateAlert, waitAlert } from '../../../../functions/alert';
import Swal from 'sweetalert2'
import { setOptions } from '../../../../functions/setters';
import { TEL, URL_DEV, EMAIL } from '../../../../constants';
import { TipoContacto } from '../../../../components/forms';

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
        formeditado: 0,
        typeForm: "llamada",
    }

    componentDidMount() {
        const { location: { state } } = this.props
        if (state) {
            if (state.lead) {
                const { form, options } = this.state
                const { lead } = state
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email === null ? '' : lead.email.toUpperCase()
                form.empresa_dirigida = lead.empresa.id.toString()
                form.telefono = lead.telefono
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
        const { form, typeForm } = this.state
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        this.setState({
            ...this.state,
            form,
            messages: this.updateMessages2(name,typeForm),
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
    onClickLlamada = type => {
        let { tipo} = this.state
        this.setState({
            typeForm:type,
            messages:this.updateMessages2(tipo, type)
        })
    }
    showIcon(){
        return (
            <>
                <span className="w-3 d-flex justify-content-end align-items-center">
                    <a className="btn btn-icon btn-light-primary btn-xs">
                        <i className="far fa-copy"></i>
                    </a>
                </span>
            </>
        )
    }
    separator(){
        return (
            <>
                <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
            </>
        )
        
    }

    updateMessages2 = (name, typeForm) => {
        const { form, lead } = this.state
        switch (name) {
            case 'name':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <>
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            Mucho gusto 
                            <span className="font-weight-boldest"> {form.name.split(" ", 1)}</span>
                            , recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto con usted a relación del servicio que seleccionó de
                            <span className="font-weight-boldest"> {this.servicio(lead.servicios)}</span>
                            {this.servicio(lead.servicios) === ' Diseño de proyectos para el sector salud' ? '.' : ' para el sector salud.'}
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div>
                    {this.separator()}                    
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            Excelente, puede indicarme
                            <span className="font-weight-boldest"> ¿Qué tipo de proyecto es? </span>
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            Mucho gusto
                            <span className="font-weight-boldest"> {form.name.split(" ", 1)}</span>
                            , recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto en relación del servicio que seleccionaste de
                            <span className="font-weight-boldest"> {this.servicio(lead.servicios)}.</span>
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div>
                    {this.separator()}
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            ¡EXCELENTE! TE AGRADEZCO QUE NOS TOMES EN CUENTA PARA TU PROYECTO, PUEDES INDICARME
                            <span className="font-weight-boldest">¿Qué tipo de proyecto es?</span>
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div></>;
                }
                break;
            case 'tipoProyecto':
            case 'tipoProyectoNombre':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return  <>
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            En
                            <span className="font-weight-boldest"> IM {lead.empresa.name} </span>
                            somos especialistas en el diseño, construcción y remodelación de
                            <span className="font-weight-boldest"> {form.tipoProyectoNombre}</span>
                            <span className="font-weight-boldest"> {form.tipo_proyecto}</span>.
                            <span className="font-weight-boldest"> ¿Su proyecto se trata de diseño o construcción?</span>
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                    <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                        <span className={typeForm === "whatsapp"?"w-97":""}>
                            De acuerdo, me parece increíble.
                            <span className="font-weight-boldest"> ¿Tu proyecto se trata de diseño o construcción?</span>
                            {typeForm}
                        </span>
                        {
                            typeForm === "whatsapp" ?
                                this.showIcon()
                            : ""
                        }
                    </div></>;
                }
                break;
            case 'diseño':
            case 'obra':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    if (lead.email === null) {
                        return <>
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Me gustaría conocer más detalles específicos acerca su proyecto
                                    <span className="font-weight-boldest"> por lo que le solicito me pueda proporcionar su correo electrónico </span>
                                    para hacerle llegar un cuestionario
                                </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                            </div></>;
                    } else {
                        return <>
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Me gustaría conocer más detalles específicos acerca su proyecto 
                                    <span className="font-weight-boldest"> por lo que le solicito me pueda corroborar su correo electrónico </span>
                                    para hacerle llegar un cuestionario. Su correo es: 
                                    <span className="font-weight-boldest"> {lead.email}</span>
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Gracias, en unos minutos le 
                                    <span className="font-weight-boldest"> estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </span>
                                    , en él se describe detalladamente cada servicio que podemos brindarle.
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Una vez que me haga llegar su información, la analizare y 
                                    <span className="font-weight-boldest">posteriormente me estaré comunicado con usted.</span>
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Gracias por contactarnos, que tenga un excelente día.
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div></>;
                    }
                }
                else if (lead.empresa.name === 'INEIN') {
                    if (lead.email === null) {
                        return <>
                        <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                Me gustaría conocer más detalles de tu proyecto
                                <span className="font-weight-boldest">¿Me podrías proporcionar tu correo electrónico? </span>
                                para hacerte llegar un cuestionario
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div></>;
                    } else {
                        return <>
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Me gustaría conocer más detalles de tu proyecto
                                    <span className="font-weight-boldest"> ¿Me podrías corroborar tu correo electrónico?</span>
                                    &nbsp;para hacerte llegar un cuestionario. Tu correo es:
                                    <span className="font-weight-boldest"> {lead.email}</span>
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    En unos minutos te hare
                                    <span className="font-weight-boldest"> llegar a tu correo un cuestionario </span>
                                    , te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    ¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div>
                            {this.separator()}
                            <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                                <span className={typeForm === "whatsapp"?"w-97":""}>
                                    Muy bien
                                    <span className="font-weight-boldest"> {form.name.split(" ", 1)}</span>
                                    , en un momento te hago el envio del cuestionario. Que tengas un excelente día.
                                </span>
                                {
                                    typeForm === "whatsapp" ?
                                        this.showIcon()
                                    : ""
                                }
                            </div></>;
                    }
                }
                break;
            case 'email':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <>
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                Gracias, en unos minutos le
                                <span className="font-weight-boldest"> estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </span>
                                , en él se describe detalladamente cada servicio que podemos brindarle.
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div>
                        {this.separator()}
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                Una vez que me haga llegar su información, la analizare y
                                <span className="font-weight-boldest"> posteriormente me estaré comunicado con usted.</span>
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div>
                        {this.separator()}
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                Gracias por contactarnos, que tenga un excelente día.
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div></>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                En unos minutos te hare
                                <span className="font-weight-boldest"> llegar a tu correo un cuestionario</span>
                                , te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?.
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div>
                        {this.separator()}
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}>
                                ¿Existiría algo mas en lo que te pueda ayudar antes de finalizar esta llamada?
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div>
                        {this.separator()}
                        <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                            <span className={typeForm === "whatsapp"?"w-97":""}> 
                                Muy bien
                                <span className="font-weight-boldest"> {form.name.split(" ", 1)}</span>
                                , en un momento te hago el envio del cuestionario. Que tengas un excelente día.
                            </span>
                            {
                                typeForm === "whatsapp" ?
                                    this.showIcon()
                                : ""
                            }
                        </div></>;
                }
                break;
            default:
                return this.showMessages(typeForm)
                break;
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
    showMessages = (typeForm) => {
        const { lead } = this.state
        const usuario = this.props.authUser.user
        if(lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'){
            if(lead.nombre === 'SIN ESPECIFICAR'){
                return <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Buen día mi nombre es {usuario.name}, asesora comercial en
                        <span className="font-weight-boldest"> IM {lead.empresa.name}</span>.
                            {lead.nombre === 'SIN ESPECIFICAR' ? ' ¿Con quién tengo el gusto' : ' ¿Tengo el gusto con '}
                        <span className="font-weight-boldest"> 
                            {lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}
                        </span>
                        ?
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div></>;
            }else{
                return <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Buen día mi nombre es {usuario.name}, {usuario.genero === 'femenino' ? 'asesora' : 'asesor'} comercial en 
                        <span className="font-weight-boldest"> IM {lead.empresa.name}</span>
                        . {lead.nombre === 'SIN ESPECIFICAR' ? '¿Con quién tengo el gusto' : '¿Tengo el gusto con '}
                        <span className="font-weight-boldest">{lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}</span>
                        ?
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div>
                {this.separator()}
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Mucho gusto 
                        <span className="font-weight-boldest"> {lead.nombre.split(" ", 1)}</span>
                        , recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto con usted a relación del servicio que seleccionó de 
                        <span className="font-weight-boldest"> {this.servicio(lead.servicios)}</span>
                        {this.servicio(lead.servicios) === ' Diseño de proyectos para el sector salud' ? '.' : ' para el sector salud.'}
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div>
                {this.separator()}
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Excelente, puede indicarme 
                        <span className="font-weight-boldest"> ¿Qué tipo de proyecto es?</span>
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div></>;
            }
        }else if(lead.empresa.name === 'INEIN'){
            if(lead.nombre === 'SIN ESPECIFICAR'){
                return <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Buen día mi nombre es {usuario.name}, asesora comercial en
                        <span className="font-weight-boldest"> Infraestructura e Interiores</span>.
                            {lead.nombre === 'SIN ESPECIFICAR' ? ' ¿Con quién tengo el gusto' : ' ¿Tengo el gusto con '}
                        <span className="font-weight-boldest">
                            {lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}
                        </span>
                        ?
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div></>;
            }
            return <>
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Buen día mi nombre es {usuario.name}, {usuario.genero === 'femenino' ? 'asesora' : 'asesor'} comercial en
                            <span className="font-weight-boldest"> Infraestructura e Interiores</span>
                            . {lead.nombre === 'SIN ESPECIFICAR' ? '¿Con quién tengo el gusto' : '¿Tengo el gusto con '}
                        <span className="font-weight-boldest">{lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}</span>
                            ?
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div>
                {this.separator()}
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        Mucho gusto
                        <span className="font-weight-boldest"> {lead.nombre.split(" ", 1)}</span>
                        , recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto a relación del servicio que seleccionaste de
                        <span className="font-weight-boldest"> {this.servicio(lead.servicios)}</span>.
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div>
                {this.separator()}
                <div className={`bg-light-primary text-primary font-weight-bold py-2 font-size-lg mb-3 text-justify ${typeForm === "whatsapp"?" row mx-0 pl-4 pr-2":" px-4"}`}>
                    <span className={typeForm === "whatsapp"?"w-97":""}>
                        ¡EXCELENTE! TE AGRADEZCO QUE NOS TOMES EN CUENTA PARA TU PROYECTO, PUEDES INDICARME
                        <span className="font-weight-boldest">¿Qué tipo de proyecto es?</span>
                    </span>
                    {
                        typeForm === "whatsapp" ?
                            this.showIcon()
                        : ""
                    }
                </div></>;
        }
    }

    render() {
        const { messages, form, options, lead } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="border-bottom-0">
                            <div className="card-toolbar">
                                <Nav className="nav nav-light-info nav-bolder nav-pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first" className="rounded-0" onClick={(e) =>{ e.preventDefault(); this.onClickLlamada("llamada")}}>
                                            <span className="nav-icon">
                                                <i className="fas fa-phone-alt"></i>
                                            </span>
                                            <span className="nav-text">
                                                Formulario por llamada de salida
                                            </span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second" className="rounded-0" onClick={(e) =>{ e.preventDefault();  this.onClickLlamada("whatsapp")}}>
                                            <span className="nav-icon">
                                                <i className="socicon-whatsapp"></i>
                                            </span>
                                            <span className="nav-text">
                                                Formulario por whatsapp
                                            </span>
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    {
                                        messages.length === 0 ?
                                            lead !== undefined ?
                                                this.showMessages("llamada")
                                            : ''
                                        : messages
                                    }
                                    <TipoContacto
                                        form={form}
                                        onChange={this.onChange}
                                        updateTipoProyecto={this.updateTipoProyecto}
                                        options={options}
                                        onSubmit={this.onSubmit}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    {
                                        messages.length === 0 ?
                                            lead !== undefined ?
                                                this.showMessages("whatsapp")
                                            : ''
                                        : messages
                                    }
                                    <TipoContacto
                                        form={form}
                                        onChange={this.onChange}
                                        updateTipoProyecto={this.updateTipoProyecto}
                                        options={options}
                                        onSubmit={this.onSubmit}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </Card>
                </Tab.Container>
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