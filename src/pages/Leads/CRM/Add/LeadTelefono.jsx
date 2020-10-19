import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../../components/layout/layout';
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
            email: '',
            tipoProyectoNombre: '',
            origen:''
        },
        tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes:[]
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
        const { form, options, empresa: emp, tipoProyecto: tip } = this.state
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
                return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Buen día. Asesoría comercial, <span className="font-weight-boldest">{empresa.name}</span>, lo atiende {usuario}, <span className="font-weight-boldest"><em>¿Con quién tengo el gusto?</em></span></div>;
            case 'name':
                return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Mucho gusto <span className="font-weight-boldest">{value}, <em>¿Cuál es el motivo de su llamada?</em></span></div>;
            case 'tipoProyecto':
            case 'tipoProyectoNombre':    
                return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">En <span className="font-weight-boldest">{emp.name}</span> somos especialistas en el diseño, construcción y remodelación de  <span className="font-weight-boldest">{form.tipoProyectoNombre}</span><span className="font-weight-boldest">{form.tipo_proyecto}</span>. <span className="font-weight-boldest"><em>¿Su proyecto se trata de diseño o construcción?</em></span></div>;
            case 'diseño':
            case 'obra':
                return <div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Me gustaría conocer más detalles específicos acerca su proyecto <span className="font-weight-boldest"><em>por lo que le solicito me pueda proporcionar su correo electrónico </em></span>para hacerle llegar un cuestionario</div>;
            case 'email':
                return <><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Gracias <span className="font-weight-boldest">{form.name}</span>, en unos minutos le <span className="font-weight-boldest"><em>estaré enviado dicho cuestionario a su correo y además le anexare un documento que será útil para usted </em></span>, en él se describe detalladamente cada servicio que podemos brindarle.</div><div className="bg-light-pink text-pink font-weight-bold py-2 px-4 font-size-lg mb-3 text-justify">Una vez que me haga llegar su información, la analizare y <span className="font-weight-boldest"><em>posteriormente me estaré comunicado con usted.</em></span></div><div className="bg-light-primary text-primary font-weight-bold py-2 px-4 font-size-lg text-justify">Gracias por contactarnos, que tenga un excelente día.</div></>;
            default:
                return ''
        }
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
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
        const { messages, form, options } = this.state
        return (
            <Layout active='leads' {...this.props} >
                <div className="card-custom card-stretch gutter-b py-2 card">
                    <div className="align-items-center border-0 card-header">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">Formulario por llamada</span>
                        </h3>
                    </div>
                    <div className="card-body pt-0">
                        {messages}
                        <Form>
                            <div className="form-group row form-group-marginless mt-4 mb-0">
                                <div className="col-md-4">
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
                                        <div className="col-md-4">
                                            <InputGray
                                                placeholder='NOMBRE DEL LEAD'
                                                withicon={1}
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
                                                placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                                withicon={1}
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
                                                name='empresa'
                                                withicon={1}
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
                                        <div className="col-md-8">
                                            <InputGray
                                                placeholder="COMENTARIO"
                                                withicon={0}
                                                name="comentario"
                                                value={form.comentario}
                                                onChange={this.onChange}
                                                rows={1}
                                                as='textarea'
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <SelectSearchGray
                                                options={options.origenes}
                                                placeholder="SELECCIONA EL ORIGEN PARA EL LEAD"
                                                name="origen"
                                                value={form.origen}
                                                onChange={this.updateOrigen}
                                                iconclass="fas fa-mail-bulk"
                                            />
                                        </div>
                                    </>
                                        : ''
                                }
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LeadTelefono)