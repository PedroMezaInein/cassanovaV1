import { connect } from 'react-redux'
import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Card, Nav, Tab, Col, Row, Form } from 'react-bootstrap'
import axios from 'axios'
import { doneAlert, errorAlert, printResponseErrorAlert, questionAlert2, questionAlertY, waitAlert } from '../../../../functions/alert'
import Swal from 'sweetalert2'
import { setOptions } from '../../../../functions/setters'
import { URL_DEV } from '../../../../constants'
import FormLlamada from '../../../../components/forms/leads/FormLlamada'
import FormWhatsapp from '../../../../components/forms/leads/FormWhatsapp'
import MensajePrincipal from '../../../../components/forms/leads/MensajePrincipal'
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';

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
            origenes: [],
            motivosRechazo:[]
        },
        formeditado: 0,
        boton:1
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
    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form } = this.state
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        this.setState({
            ...this.state,
            form,
            messages: this.updateMessages2(name),
            tipo: name
        })
    }
    onChange2 = e => {
        const { name, value, checked, type } = e.target
        const { form } = this.state
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        this.setState({
            ...this.state,
            form,
            tipo: name
        })
    }
    updateTipoProyecto2 = value => {
        const { options } = this.state
        this.onChange2({ target: { value: value, name: 'tipoProyecto' } })
        let tipoProyecto = ''
        options.tipos.map((tipo) => {
            if (value.toString() === tipo.value.toString()) {
                tipoProyecto = tipo.name
            }
            return false
        })
        this.onChange2({ target: { value: tipoProyecto, name: 'tipoProyectoNombre' } })
    }

    servicio = servicios => {
        let servicio = ""
        servicios.map((element) => {
            servicio = element.servicio
            return false
        })
        return servicio
    }
    mensajeNameNullIM(boton){
        const { lead } = this.state
        const usuario = this.props.authUser.user
        return (
            <MensajePrincipal
                primerTexto={`Buen día mi nombre es ${usuario.name}, ${usuario.genero === 'femenino' ? 'asesora' : 'asesor'} comercial en `}
                primerBoldest={`IM ${lead.empresa.name}`}
                segundoTexto={lead.nombre === 'SIN ESPECIFICAR' ? ' ¿Con quién tengo el gusto' : ' ¿Tengo el gusto con '}
                segundoBoldest={lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}
                tercerTexto={"?"}
                boton={boton}
                bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
            />
        )
    }
    mensajeNameNullINEIN(boton){
        const { lead } = this.state
        const usuario = this.props.authUser.user
        return (
            <MensajePrincipal
                primerTexto={`Buen día mi nombre es ${usuario.name}, ${usuario.genero === 'femenino' ? 'asesora' : 'asesor'} comercial en `}
                primerBoldest={"Infraestructura e Interiores"}
                segundoTexto={lead.nombre === 'SIN ESPECIFICAR' ? ' ¿Con quién tengo el gusto' : ' ¿Tengo el gusto con '}
                segundoBoldest={lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre}
                tercerTexto={"?"}
                boton={boton}
                bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
            />
        )
    }
    mensajeTipoProyectoIM(boton){
        const { lead, form } = this.state
        return (
            <>
                <MensajePrincipal
                    primerTexto={"Mucho gusto "}
                    primerBoldest={`${form.name.split(" ", 1)}, `}
                    segundoTexto={"recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto con usted a relación del servicio que seleccionó de "}
                    segundoBoldest={this.servicio(lead.servicios)}
                    tercerTexto={this.servicio(lead.servicios) === ' Diseño de proyectos para el sector salud' ? '.' : ' para el sector salud.'}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
                <MensajePrincipal
                    primerTexto={"Excelente, puede indicarme "}
                    primerBoldest={"¿Qué tipo de proyecto es?"}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
            </>
        )
    }
    mensajeTipoProyectoINEIN(boton){
        const { form, lead } = this.state
        return (
            <>
                <MensajePrincipal
                    primerTexto={"Mucho gusto "}
                    primerBoldest={`${form.name.split(" ", 1)}, `}
                    segundoTexto={"recibimos exitosamente su información a través de nuestro sitio web. Me pongo en contacto en relación del servicio que seleccionaste de "}
                    segundoBoldest={`${this.servicio(lead.servicios)}.`}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
                <MensajePrincipal
                    primerTexto={"¡Excelente! Te agradezco que nos tomes en cuenta para tu proyecto, puedes indicarme: "}
                    primerBoldest={"¿Qué tipo de proyecto es?"}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
            </>
        )
    }
    mensajeEmailINEIN(boton){
        const { form } = this.state
        return (
            <>
                <MensajePrincipal
                    primerTexto={"En unos minutos te haré "}
                    primerBoldest={"llegar a tu correo un cuestionario, "}
                    segundoTexto={"te pido nos apoyes en constarlo, para que una vez que yo lo reciba pueda evaluar tu proyecto, ¿De acuerdo?."}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
                <MensajePrincipal
                    primerTexto={"¿Existiría algo mas en lo que te pueda ayudar?"}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
                <MensajePrincipal 
                    primerTexto={"Muy bien "}
                    primerBoldest={`${form.name.split(" ", 1)}, `}
                    segundoTexto={"en un momento te hago el envio del cuestionario. Que tengas un excelente día."}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
            </>
        )
    }
    mensajeEmailIM(boton){
        return (
            <>
            <MensajePrincipal
                primerTexto={"Gracias, en unos minutos le "}
                primerBoldest={"estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted, "}
                segundoTexto={"en él se describe detalladamente cada servicio que podemos brindarle. "}
                separator={1}
                boton={boton}
                bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
            />
            <MensajePrincipal
                primerTexto={"Una vez que me haga llegar su información, la analizare y "}
                primerBoldest={"posteriormente me estaré comunicado con usted."}
                separator={1}
                boton={boton}
                bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
            />
            <MensajePrincipal
                primerTexto={"Gracias por contactarnos, que tenga un excelente día."}
                boton={boton}
                bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
            />
            </>
        )
    }
    caseDiseñoObra(boton){
        const { form, lead } = this.state
        if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
            if (lead.email === null) {
                return <>
                    <MensajePrincipal 
                        primerTexto={"Me gustaría conocer más detalles específicos acerca su proyecto "}
                        primerBoldest={"por lo que le solicito me pueda proporcionar su correo electrónico "}
                        segundoTexto={"para hacerle llegar un cuestionario"}
                        boton={boton}
                        bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                    />
                    {
                        form.email?
                            <>
                                <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                                {this.mensajeEmailIM(boton)}
                            </>
                        :""
                    }
                </>;
            } else {
            return <>
                <MensajePrincipal
                    primerTexto={"Me gustaría conocer más detalles específicos acerca su proyecto "}
                    primerBoldest={"por lo que le solicito me pueda corroborar su correo electrónico "}
                    segundoTexto={"para hacerle llegar un cuestionario. Su correo es: "}
                    segundoBoldest={lead.email}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
                {this.mensajeEmailIM(boton)}
            </>;
            }
        }else if (lead.empresa.name === 'INEIN') {
            if (lead.email === null) {
                return <>
                    <MensajePrincipal 
                        primerTexto={"Me gustaría conocer más detalles de tu proyecto "}
                        primerBoldest={"¿Me podrías proporcionar tu correo electrónico? "}
                        segundoTexto={"para hacerte llegar un cuestionario"}
                        boton={boton}
                        bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                    />
                    {
                        form.email?
                            <>
                                <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                                {this.mensajeEmailINEIN(boton)}
                            </>
                        :""
                    }
                </>;
            } else {
                return <>
                    <MensajePrincipal 
                        primerTexto={"Me gustaría conocer más detalles de tu proyecto "}
                        primerBoldest={"¿Me podrías corroborar tu correo electrónico? "}
                        segundoTexto={"para hacerte llegar un cuestionario. Tu correo es: "}
                        segundoBoldest={lead.email}
                        separator={1}
                        boton={boton}
                        bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                    />
                    {this.mensajeEmailINEIN(boton)}
                </>;
            }
        }
    }
    mensajeDiseñoConstruccion(boton) {
        return (
            <>
                <MensajePrincipal
                    primerBoldest={"¿El proyecto se trata de diseño o construcción?"}
                    separator={1}
                    boton={boton}
                    bontonFunction = { (e, value) => { e.preventDefault(); this.sendWhatsapp(value) } }
                />
            </>
        )
    }
    // caseName(boton){
    //     const { form, lead } = this.state
    //     if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
    //         if (lead.nombre === 'SIN ESPECIFICAR') {
    //             return <>
    //                 {this.mensajeNameNullIM(boton)}
    //                 {
    //                     form.name !==""?
    //                         <>
    //                             <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
    //                             {this.mensajeTipoProyectoIM(boton)}
    //                         </>
    //                     :""
    //                 }
    //             </>;
    //         } else {
    //             return <>
    //                 {this.mensajeNameNullIM(boton)}
    //                 {this.mensajeTipoProyectoIM(boton)}
    //             </>;
    //         }
    //     } else if (lead.empresa.name === 'INEIN') {
    //         if (lead.nombre === 'SIN ESPECIFICAR') {
    //             return <>
    //                 {this.mensajeNameNullINEIN(boton)}
    //                 {
    //                     form.name !==""?
    //                         <>
    //                             <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
    //                             {this.mensajeTipoProyectoINEIN(boton)}
    //                         </>
    //                     :""
    //                 }
    //             </>;
    //         } else {
    //             return <>
    //                 {this.mensajeNameNullINEIN(boton)}
    //                 {this.mensajeTipoProyectoINEIN(boton)}
    //             </>;
    //         }
    //     }
    // }
    
    updateMessages2 = (name) => {
        const { form, lead } = this.state
        switch (name) {
            case 'name':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <>
                        {this.mensajeTipoProyectoIM()}
                    </>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                        {this.mensajeTipoProyectoINEIN()}
                    </>;
                }
            break;
            case 'tipoProyecto':
            case 'tipoProyectoNombre':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return  <>
                        <MensajePrincipal 
                            primerTexto={"En "}
                            primerBoldest={`IM ${lead.empresa.name}, `}
                            segundoTexto={"somos especialistas en el diseño, construcción y remodelación de "}
                            segundoBoldest={`${form.tipoProyectoNombre}. `}
                            tercerBoldest={"¿Su proyecto se trata de diseño o construcción?"}
                        />
                    </>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                        <MensajePrincipal 
                            primerTexto={"De acuerdo, me parece increíble. "}
                            primerBoldest={"¿Tu proyecto se trata de diseño o construcción?"}
                        />
                    </>;
                }
                break;
            case 'diseño':
            case 'obra':
                return <>
                    {this.caseDiseñoObra()}
                </>;
            case 'email':
                if (lead.empresa.name === 'INFRAESTRUCTURA MÉDICA') {
                    return <>
                        {this.mensajeEmailIM()}
                    </>;
                } else if (lead.empresa.name === 'INEIN') {
                    return <>
                        {this.mensajeEmailINEIN()}
                    </>;
                }
                break;
            case'empresa':
            case'telefono':
            case'comentario':
            return <></>;
            default:
                return <></>;
        }
    }
    showMessages = (boton) => {
        const { lead } = this.state
        if(lead.empresa.name === 'INFRAESTRUCTURA MÉDICA'){
            if(lead.nombre === 'SIN ESPECIFICAR'){
                return <>
                    {this.mensajeNameNullIM(boton)}
                </>;
            }else{
                return <>
                    {this.mensajeNameNullIM(boton)}
                    <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                    {this.mensajeTipoProyectoIM(boton)}
                    
                </>;
            }
        }else if(lead.empresa.name === 'INEIN'){
            if(lead.nombre === 'SIN ESPECIFICAR'){
                return <>
                    {this.mensajeNameNullINEIN(boton)}
                </>;
            }
            return <>
                    {this.mensajeNameNullINEIN(boton)}
                    <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                    {this.mensajeTipoProyectoINEIN(boton)}
                </>;
        }
    }
    allMessages(){
        const { lead, boton } = this.state
        if(lead !== undefined){
            return ( 
                <>
                    {this.showMessages(boton)}
                    <div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">...</div>
                    {this.mensajeDiseñoConstruccion(boton)}
                    {this.caseDiseñoObra(boton)}
                </>
            )
        }
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, origenes, motivosRechazo} = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['origenes'] = setOptions(origenes, 'origen', 'id')
                options.motivosRechazo = motivosRechazo
                options.motivosRechazo.map((motivo)=>{
                    motivo.checked = false
                    return ''
                })
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
            console.error(error, 'error')
        })
    }

    onSubmit = async (e) => {
        const { form, lead } = this.state
        const { access_token } = this.props.authUser
        let sendCorreoValue = document.sendCorreoForm.sendCorreo.value;
        if(sendCorreoValue === 'si' || sendCorreoValue === 'no'){
            waitAlert();
            form.sendCorreoValue =  sendCorreoValue
            await axios.put(`${URL_DEV}crm/update/lead/llamada-saliente/${lead.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste los permisos.',)
                    const { history } = this.props
                    history.push({
                        pathname: '/leads/crm',
                        state: { tipo: 'lead-telefono' }
                    });
                },
                (error) => {
                    printResponseErrorAlert(error)
                }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }else{
            errorAlert('Selecciona una opción')
        }
    }

    sendWhatsapp = texto => {

        const { lead } = this.state
        if(lead.telefono)
            window.open(`https://wa.me/52${lead.telefono}?text=${texto}`, '_blank');
        else
            window.open(`https://wa.me/${lead.telefono}?text=${texto}`, '_blank');
        questionAlertY('¿ESTÁS SEGURO?', '¿DESEAS GENERAR EL REGISTRO DE CONTACTO?', () => this.sendRegistro(texto))
    
    }
    
    sendRegistro = async texto => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.put(URL_DEV + 'crm/add/registro/whatsapp/' + lead.id, { texto: texto }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Contacto registrado con éxito')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    openModalWithInput = (estatus) => {
        const { lead, options } = this.state
        questionAlert2( 'ESCRIBE EL MOTIVO DE RECHAZO', '', () => this.changeEstatusRechazadoAxios({ id: lead.id, estatus: estatus }),
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
    changeEstatusRechazadoAxios = async (data) => {
        const { estatus } = data
        const { access_token } = this.props.authUser
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
            data.motivo = elemento
            await axios.put(`${URL_DEV}v2/leads/crm/lead/estatus/${data.id}`, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
                (response) => {
                    const { history } = this.props
                    doneAlert('El estatus fue actualizado con éxito.')
                    history.push({ pathname: '/leads/crm' });
                },
                (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
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
        const { messages, form, options, lead } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Card className="card-custom card-stretch gutter-b py-2">
                        <Card.Header className="border-bottom-0">
                            <div className="card-toolbar">
                                <Nav className="nav nav-light-info nav-bolder nav-pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first" className="rounded-0">
                                            <span className="nav-icon">
                                                <i className="fas fa-phone-alt"></i>
                                            </span>
                                            <span className="nav-text">
                                                Formulario por llamada de salida
                                            </span>
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second" className="rounded-0">
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
                                                this.showMessages()
                                            : ''
                                        : messages
                                    }
                                    <FormLlamada form = { form } onChange = { this.onChange }
                                        updateTipoProyecto = { this.updateTipoProyecto } options = { options }
                                        openModalWithInput = { this.openModalWithInput }
                                        onSubmit = { 
                                            (e) => {
                                                e.preventDefault();
                                                questionAlert2(
                                                    '¿DESEAS ENVIAR CORREO AL CLIENTE?',
                                                    '',
                                                    () => { this.onSubmit() },
                                                    <form id = 'sendCorreoForm' name = 'sendCorreoForm' >
                                                        <Form.Check type="radio" label="SI" name="sendCorreo"
                                                            className="px-0 mb-2" value = 'si'/>
                                                        <Form.Check type="radio" label="NO" name="sendCorreo"
                                                            className="px-0 mb-2" value = 'no'/>
                                                    </form>
                                                )
                                            }
                                        }
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                <Row className="mx-0">
                                        <Col md={7}>
                                            {
                                                this.allMessages()
                                            }
                                        </Col>
                                        <Col md={5}>
                                            <FormWhatsapp
                                                form={form}
                                                onChange={this.onChange2}
                                                updateTipoProyecto={this.updateTipoProyecto2}
                                                options={options}
                                                onSubmit={this.onSubmit}
                                                openModalWithInput = { this.openModalWithInput }
                                            />
                                        </Col>
                                    </Row>
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

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadLlamadaSalida)