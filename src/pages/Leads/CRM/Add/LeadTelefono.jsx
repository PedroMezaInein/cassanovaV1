import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
import Messages from '../../../../components/chat/Messages'
import { Form } from 'react-bootstrap';
import { InputGray, SelectSearchGray, InputPhoneGray } from '../../../../components/form-components';
import axios from 'axios'
import { errorAlert, forbiddenAccessAlert, waitAlert } from '../../../../functions/alert';
import swal from 'sweetalert';
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
            email: ''
        },
        tipo: '',
        options: {
            empresas: []
        },
        newTipoProyecto: false,
    }

    componentDidMount() {
        this.getOptionsAxios()
        /* const { name: usuario } = this.props.authUser.user
        let aux = []
        aux.push( { username: usuario, message: 'IM Infraestructura Médica, Buenas tardes. ¿En qué puedo ayudarlo?', fromMe: true } )
        aux.push( { username: 'Cliente', message: 'Buenas tardes, ¿Con quién puedo ver lo de un proyecto?', fromMe: false } )
        aux.push( { username: usuario, message: `Lo puedes ver conmigo, soy ${usuario} asesor(a) comercial de IM. Dígame, ¿Cuál es su nombre?`, fromMe: true } )
        this.setState({
            ...this.state,
            messages: aux
        }) */
    }
    updateEmpresa = value => {
        const { options } = this.state
        this.onChange({ target: { name: 'empresa_dirigida', value: value } })
        let empresa = ''
        options.empresas.map((emp) => {
            if (emp.value.toString() === value.toString()) {
                empresa = emp
            }
            return false
        })
        this.setState({
            empresa: empresa
        })
    }
    updateTipoProyecto = value => {
        const { onChange } = this.props
        this.onChange({ target: { name: 'tipoProyecto', value: value } })
        if (value === 'New') {
            this.setState({
                newTipoProyecto: true
            })
        } else {
            this.setState({
                newTipoProyecto: false
            })
        }
    }

    onChange = e => {
        const { name, value, checked, type } = e.target
        const { form, messages } = this.state
        form[name] = value
        if (type === 'checkbox')
            form[name] = checked
        this.setState({
            ...this.state,
            form,
            messages: this.updateMessages(messages, name, value),
            tipo: name
        })
    }

    updateMessages = (messages, name, value) => {
        const { form, options, empresa: emp } = this.state
        const { name: usuario } = this.props.authUser.user
        let aux = false
        let auxVendedor = false
        switch (name) {
            case 'empresa_dirigida':
                messages = []
                let empresa = ''
                options.empresas.map((emp) => {
                    if (emp.value.toString() === value.toString()) {
                        empresa = emp
                    }
                    return false
                })
                messages.push({ username: usuario, message: `Buen día.  Asesoría comercial, ${empresa.name}, lo atiende ${usuario}, ¿Con quién tengo el gusto?`, fromMe: true })
                // messages.push( { username: 'Cliente', message: 'Buenas tardes, ¿Con quién puedo ver lo de un proyecto?', fromMe: false } )
                // messages.push( { username: usuario, message: `Lo puedes ver conmigo, soy ${usuario} asesor(a) comercial de ${empresa.name}. Dígame, ¿Cuál es su nombre?`, fromMe: true } )
                break;
            case 'name':
                messages.map((mensaje) => {
                    if (!mensaje.fromMe) {
                        mensaje.username = value
                    }
                    if (mensaje.tipo === name) {
                        mensaje.message = `Buenos días, mi nombre es ${value}`
                        aux = true
                    }
                    if (mensaje.tipo === 'vendedor-nombre') {
                        mensaje.message = `Mucho gusto ${value}, ¿Cuál es el motivo de su llamada?`
                        auxVendedor = true
                    }
                    return false
                })
                if (aux === false)
                    messages.push({ username: value, message: `Buenos días, mi nombre es  ${value}`, fromMe: false, tipo: name })
                if (auxVendedor === false)
                    messages.push({ username: usuario, message: `Mucho gusto ${value}, ¿Cuál es el motivo de su llamada?`, fromMe: true, tipo: 'vendedor-nombre' })
                if (aux === false)
                    messages.push({ username: 'Cliente', message: 'Tengo un proyecto y me gustaría cotizarlo', fromMe: false })
                if (auxVendedor === false)
                    messages.push({ username: usuario, message: `Excelente, puede indicarme ¿Qué tipo de proyecto es?`, fromMe: true })
                break;
            case 'tipoProyecto':
                let tipo_proyecto = ''
                options.empresas.map((emp) => {
                    if (emp.value.toString() === value.toString()) {
                        tipo_proyecto = emp
                    }
                    return false
                })
                messages.push({ username: 'Cliente', message: `${tipo_proyecto.name}`, fromMe: false })
                messages.push({ username: usuario, message: `En ${emp.name} somos especialistas en el diseño, construcción y remodelación de ${tipo_proyecto.name}.  Me gustaría conocer más detalles específicos acerca su proyecto por lo que le solicito me pueda proporcionar su correo electrónico para hacerle llegar un cuestionario.`, fromMe: true })
                break;
            case 'email':
                // messages.map((mensaje) => {
                //     if (mensaje.tipo === name) {
                //         mensaje.message = `${value}`
                //         aux = true
                //     }
                //     return false
                // })
                if (aux === false) {
                    messages.push({ username: form.name, message: `${value}`, fromMe: false, tipo: name })
                    messages.push({
                        username: usuario, message: `Gracias ${form.name}, en unos minutos le estaré enviado dicho cuestionario a su correo y
                        además le anexare un documento que será útil para usted, en él se describe detalladamente cada servicio que podemos brindarle.`, fromMe: true
                    })
                    messages.push({ username: form.name, message: `Muy bien`, fromMe: false, tipo: name })
                    messages.push({ username: usuario, message: `Una vez que me haga llegar su información, la analizare y posteriormente me estaré comunicado con usted.`, fromMe: true })
                    messages.push({ username: form.name, message: `Hasta luego`, fromMe: false, tipo: name })
                    messages.push({ username: usuario, message: `Gracias por contactarnos, que tenga un excelente día.`, fromMe: true })
                }
                break;
            // case 'empresa':
            //     messages.map((mensaje) => {
            //         if (mensaje.tipo === name) {
            //             mensaje.message = `${value}`
            //             aux = true
            //         }
            //         return false
            //     })
            //     if (aux === false) {
            //         messages.push({ username: form.name, message: `${value}`, fromMe: false, tipo: name })
            //         messages.push({ username: usuario, message: `Dígame ${form.name}, ¿Cuál es el proyecto que desea realizar?`, fromMe: true })
            //     }
            //     break;
            // case 'comentario':
            //     messages.map((mensaje) => {
            //         if (mensaje.tipo === name) {
            //             mensaje.message = `${value}`
            //             aux = true
            //         }
            //         return false
            //     })
            //     if (aux === false) {
            //         messages.push({ username: form.name, message: `${value}`, fromMe: false, tipo: name })
            //         messages.push({ username: usuario, message: `¡Perfecto!`, fromMe: true })
            //         // console.log(emp.name, 'name')
            //         if (emp.name === 'INFRAESTRUCTURA MÉDICA')
            //             messages.push({
            //                 username: usuario, message: `Le comento que nosotros somos especialistas en diseño y construcción de espacios para la salud. 
            //                 Cumplimos con todas las normativas de los esapcios establecidas por las dependencias de gobierno y sobre todo COFEPRIS. Tenemos más de 10 años 
            //                 de experiencia en el mercado y desarrollamos proyectos en toda la república mexicana.`, fromMe: true
            //             })
            //         messages.push({ username: usuario, message: `¿Su proyecto se trata de diseño o construcción?`, fromMe: true })
            //     }
            //     break;
            // case 'diseño':
            // case 'obra':
            //     let tipoProyecto = ''
            //     if (form.diseño)
            //         tipoProyecto = 'Diseño'
            //     if (form.obra)
            //         if (tipoProyecto.length)
            //             tipoProyecto = tipoProyecto + ' y obra'
            //         else
            //             tipoProyecto = 'Obra'
            //     messages.map((mensaje) => {
            //         if (mensaje.tipo === 'diseño' || mensaje.tipo === 'obra') {
            //             mensaje.message = `${tipoProyecto}`
            //             aux = true
            //         }
            //         return false
            //     })
            //     if (aux === false) {
            //         messages.push({ username: form.name, message: `${tipoProyecto}`, fromMe: false, tipo: name })
            //         messages.push({
            //             username: usuario, message: `Bien, ¿Me puede indicar cuál es su correo electrónico? Para hacerle llegar 
            //             un cuestionario de proyectos donde requerimos nos lo pueda responder y adjuntar la información solicitada en el, esto con el fin 
            //             de conocer mas detalles acerca de su proyecto y analizarlos.`, fromMe: true
            //         })
            //     }
            //     break;
            default:
                break;
        }
        return messages
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'documentos/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
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

    render() {
        const { messages, form, options, newTipoProyecto } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario por llamada</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0">
                        {/* <p className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg">
                            Buen día. Asesoría comercial, Infraestructura Médica, lo atiende CARINA, <span className="font-weight-boldest">¿Con quién tengo el gusto?</span>
                        </p> */}
                        <p className="bg-light-primary">
                            {/* Buen día. Asesoría comercial, IM Infraestructura Médica, lo atiende Diana Hernández, <span className="font-weight-boldest">¿Con quién tengo el gusto?</span> */}
                            <Messages messages={messages} />
                        </p>
                        <Form>
                            <div className="form-group row form-group-marginless mt-5 mb-0">
                                <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                    <SelectSearchGray
                                        options={options.empresas}
                                        placeholder="¿A QUÉ EMPRESA VA DIRIGIDA EL LEAD?"
                                        name="empresa_dirigida"
                                        value={form.empresa_dirigida}
                                        onChange={this.updateEmpresa}
                                        iconclass="fas fa-building"
                                    />
                                </div>
                                {
                                    form.empresa_dirigida !== '' ?
                                        <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                            <InputGray
                                                placeholder='NOMBRE DEL LEAD'
                                                withicon={true}
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
                                        // <div className="col-md-4">
                                        //     <InputGray
                                        //         placeholder="TIPO DE PROYECTO"
                                        //         withicon={true}
                                        //         iconclass="fas fa-folder-open"
                                        //         type="text"
                                        //         name="tipoProyecto"
                                        //         value={form.tipoProyecto}
                                        //         onChange={this.onChange}
                                        //     />
                                        // </div>
                                        <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                            <SelectSearchGray
                                                options={options.empresas}
                                                placeholder="SELECCIONA EL TIPO DE PROYECTO"
                                                onChange={this.updateTipoProyecto}
                                                name="tipoProyecto"
                                                value={form.tipoProyecto}
                                            />
                                            {
                                                newTipoProyecto &&
                                                <div className={newTipoProyecto ? 'col-md-3' : 'col-md-4'}>
                                                    <InputGray
                                                        requirevalidation={1}
                                                        name="newTipoProyecto"
                                                        onChange={this.onChange}
                                                        value={form.newTipoProyecto}
                                                        type="text"
                                                        placeholder="NUEVO TIPO DE PROYECTO"
                                                        iconclass={"far fa-folder-open"}
                                                    />
                                                </div>
                                            }
                                        </div>
                                        : ''
                                }
                                {
                                    form.tipoProyecto !== '' ?
                                        <div className="col-md-4">
                                            <InputGray
                                                placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                                withicon={true}
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
                                        <div className="col-md-4">
                                            <InputGray
                                                name='empresa'
                                                value={form.empresa}
                                                placeholder='Empresa'
                                                onChange={this.onChange}
                                                iconclass='fas fa-building'
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.empresa !== '' ?
                                        <div className="col-md-4">
                                            <InputPhoneGray
                                                placeholder="TELÉFONO DE CONTACTO"
                                                withicon={true}
                                                iconclass="fas fa-mobile-alt"
                                                name="telefono"
                                                value={form.telefono}
                                                onChange={this.onChange}
                                                patterns={TEL}
                                                thousandseparator={false}
                                                prefix=''
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.telefono ?
                                        <div className="col-md-12">
                                            <InputGray
                                                placeholder="COMENTARIO"
                                                withicon={false}
                                                name="comentario"
                                                value={form.comentario}
                                                onChange={this.onChange}
                                                rows={3}
                                                as='textarea'
                                            />
                                        </div>
                                        : ''
                                }
                                {
                                    form.comentario !== '' ?
                                        <>
                                            <label className='pl-3 w-auto col-form-label font-weight-bold text-dark-60'>¿Es un proyecto de obra y/o diseño?</label>
                                            <div className="col-md-4">
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
                                        </>
                                        : ''
                                }
                            </div>
                        </Form>
                    </div>
                </div>
                {/* <div className = "row mx-0">
                    <div className = "col-md-4 position-relative border p-2">
                        <Messages messages = { messages } />
                    </div>
                    <div className = "col-md-8 py-3 px-4">
                        <Card className="card-custom">
                            <Card.Header className="align-items-center">
                                <div className="card-title">
                                    <h3 className="card-label">Formulario por correo</h3>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <div className="form-group row form-group-marginless">
                                        <div className="col-md-4">
                                            <SelectSearch options = { options.empresas } placeholder = "¿A qué empresa va dirigida el lead?" name = "empresa_dirigida"
                                                value = { form.empresa_dirigida} onChange = { this.updateEmpresa } iconclass = "fas fa-building"/>
                                        </div>
                                        {
                                            form.empresa_dirigida !== '' ?
                                                <div className="col-md-4">
                                                    <Input name = 'name' value = { form.name } placeholder = 'Nombre del lead' onChange = { this.onChange } iconclass = "far fa-user" />
                                                </div>
                                            :''
                                        }
                                        {
                                            form.name !== '' ?
                                                <div className="col-md-4">
                                                    <Input name = 'empresa' value = { form.empresa } placeholder = 'Empresa' onChange = { this.onChange } 
                                                        iconclass = 'fas fa-building' />
                                                </div>
                                            :''
                                        }
                                        {
                                            form.empresa !== '' ?
                                                <div className="col-md-12">
                                                    <Input placeholder = "COMENTARIO" name = "comentario" value = { form.comentario } 
                                                        onChange = { this.onChange } rows = { 3 } as = 'textarea' />
                                                </div>
                                            : ''
                                        }
                                        {
                                            form.comentario !== '' ?
                                                <div className = "col-md-4">
                                                    <label className = 'col-form-label'>¿Es un proyecto de obra o diseño?</label>
                                                    <div className="d-flex">
                                                        <label className ="checkbox checkbox-outline checkbox-outline-2x checkbox-primary mr-3">
                                                            <input type = "checkbox" onChange = { (e) => this.onChange(e) } name = 'diseño'
                                                                checked = { form.diseño } value = { form.diseño } />
                                                            DISEÑO
                                                            <span></span>
                                                        </label>
                                                        <label className ="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                            <input type = "checkbox" onChange = { (e) => this.onChange(e) } name = 'obra'
                                                                checked = { form.obra } value = { form.obra } />
                                                            Obra
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                    
                                                </div>
                                            :''
                                        }
                                        {
                                            form.diseño || form.obra ?
                                                <div className = "col-md-4">
                                                    <Input type = "email" placeholder="CORREO ELECTRÓNICO DE CONTACTO" name = "email" value = { form.email }
                                                        onChange = { this.onChange } iconclass = "fas fa-envelope"/>
                                                </div>
                                            : ''
                                        }
                                        {
                                            form.email ?
                                                <div className = "col-md-4">
                                                    <InputPhone placeholder = "TELÉFONO DE CONTACTO" name="telefono" value={form.telefono}
                                                        onChange = { this.onChange } iconclass = "fas fa-mobile-alt" patterns = { TEL }
                                                        thousandseparator = { false } prefix = ''/>
                                                </div>
                                            : ''
                                        }
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(LeadTelefono)