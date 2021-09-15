import React, { Component } from 'react'
import { Card, DropdownButton, Dropdown, OverlayTrigger, Tooltip, Form, Col, Row } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import axios from 'axios'
import { toAbsoluteUrl } from "../../../../functions/routers"
import SliderImages from '../../../singles/SliderImages'
import { dayDMY } from "../../../../functions/setters"
import { ItemSlider, ModalSendMail, Modal } from '../../../singles'
import { CreatableMultiselectGray } from '../../../../components/form-components'
import { waitAlert, printResponseErrorAlert, errorAlert, doneAlert} from '../../../../functions/alert'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader } from '../../../../functions/routers'
import { AvanceForm } from '../../../../components/forms'
class Avances extends Component {

    state = {
        tabAvance: '',
        accordion: [],
        formeditado:0,
        modal:{
            avance_cliente:false,
            add_avance:false
        },
        form:{
            correos_avances: [],
            url_avance:'',
            id_avance:0,
            fechaInicio: new Date(),
            fechaFin: new Date(),
            semana: '',
            actividades_realizadas:'',
            avances: [
                {
                    avance: '',
                    descripcion: '',
                    adjuntos: {
                        value: '',
                        placeholder: 'Fotos del avance',
                        files: []
                    }
                }
            ],
            adjuntos: {
                avance: {
                    value: '',
                    placeholder: 'Avance',
                    files: []
                }
            }
        },
        options: {
            correos_clientes:[]
        }
    }

    componentDidUpdate = prev => {
        const { isActive, proyecto } = this.props
        const { isActive: prevActive } = prev
        if(isActive && !prevActive){
            if(proyecto.avances.length === 0){
                this.openFormAvance('new')
            }
        }
    }
    
    setNaviIcon(icon, text) {
        return (
            <span className="navi-icon d-flex align-self-center">
                <div className="d-flex"><i className={`${icon} mr-2`} /></div>
                <div className="navi-text align-self-center">
                    {text}
                </div>
            </span>
        )
    }

    openFormAvance = (type) => {
        this.setState({
            ...this.state,
            tabAvance: type
        })
    }

    handleAccordion = (indiceClick) => {
        const { proyecto: { avances } } = this.props;
        avances.map((element, key) => {
            if (element.id === indiceClick) {
                element.isActive = element.isActive ? false : true
            }else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: avances
        });
    }
    
    openModalEnviarAvance = (avance) => {
        const { modal, options } = this.state
        const { user, proyecto } = this.props
        let { form } = this.state

        form.url_avance = avance.pdf
        modal.avance_cliente = true
        
        form.correos_avances = []
        form.id_avance = avance.id
        let aux_contactos = [];
        if (user.email) {
            form.correos_avances.push({ value: user.email, label: user.email, id: user.id.toString() })
            aux_contactos.push({
                value: user.email,
                label: user.email,
                id: user.id.toString() 
            })
        }
        options.correos_clientes = []
        proyecto.contactos.forEach(contacto => {
            aux_contactos.push({
                value: contacto.correo.toLowerCase(),
                label: contacto.correo.toLowerCase(),
                id: contacto.id.toString()
            })
            return ''
        })
        options.correos_clientes = aux_contactos

        // ELIMINAR OPCIÓN DUPLICADO
        const values = aux_contactos.map(o => o.value)
        const filtered = aux_contactos.filter(({value}, index) => !values.includes(value, index + 1))
        
        options.correos_clientes = filtered
        this.setState({
            ...this.state,
            modal,
            form,
            options
        })
    }
    
    handleCloseModalEnviarAvance = () => {
        const { form, modal } = this.state
        form.correos_clientes = []
        form.url_avance = ''
        modal.avance_cliente = false
        this.setState({...this.state, modal, form })
    }

    handleChangeCreateMSelect = (newValue) => {
        const { form } = this.state
        if(newValue == null){
            newValue = []
        }
        let currentValue = []
        newValue.forEach(valor => {
            currentValue.push({
                value: valor.value,
                label: valor.label,
                id:valor.id
            })
            return ''
        })
        form.correos_avances = currentValue
        this.setState({...this.state, form })
    };

    sendMail = async () => {
        waitAlert();
        const { at, proyecto } = this.props
        const { form } = this.state
        let aux = []
        form.correos_avances.map((contacto) => {
            aux.push(contacto.value)
            return false
        })
        form.correos_avances = aux
        await axios.put(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}/avances/${form.id_avance}`, form, { headers: setSingleHeader(at) }).then(
            (response) => { doneAlert(response.data.message !== undefined ? response.data.message : 'El avance fue enviado con éxito.') }, 
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    // ADD AVANCES
    openFormAvance = (typeform) => {
        const { modal } = this.state
        modal.add_avance = true
        this.setState({
            ...this.state,
            modal,
            formeditado: 0,
            tabAvance:typeform
        })
    }

    handleCloseAvances = () => {
        const { modal } = this.state
        const { onClick } = this.props
        modal.add_avance = false
        this.setState({ ...this.state, modal, form: this.clearForm() })
        onClick('change-tab', 'informacion')
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'avances':
                    form[element] = [{
                        descripcion: '',
                        avance: '',
                        adjuntos: {
                            value: '',
                            placeholder: 'Fotos del avance',
                            files: []
                        }
                    }]
                    break;
                case 'adjuntos':
                    form[element] = {
                        avance: {
                            value: '',
                            placeholder: 'Avance',
                            files: []
                        },
                    }
                    break;
                case 'correos_avances':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            form.adjuntos[element].value = ''
            form.adjuntos[element].files = []
            return false
        })
        return form
    }

    onChangeAvance = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form.avances[key][name] = value
        this.setState({ ...this.state, form })
    }

    onChangeAdjuntoAvance = (e, key, name) => {
        const { form } = this.state
        const { files, value } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form.avances[key][name].value = value
        form.avances[key][name].files = aux
        this.setState({ ...this.state, form })
    }

    clearFilesAvances = (name, key, _key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.avances[_key].adjuntos.files.length; counter++) {
            if (counter !== key) { aux.push(form.avances[_key].adjuntos.files[counter]) }
        }
        if (aux.length < 1) {
            form.avances[_key].adjuntos.files = []
            form.avances[_key].adjuntos.value = ''
        }
        form.avances[_key].adjuntos.files = aux
        this.setState({ ...this.state, form })
    }
    
    addRowAvance = () => {
        const { form } = this.state
        form.avances.push(
            {
                descripcion: '',
                adjuntos: {
                    value: '',
                    placeholder: 'Fotos del avance',
                    files: []
                }
            }
        )
        this.setState({ ...this.state, form })
    }

    deleteRowAvance = () => {
        const { form } = this.state
        form.avances.pop()
        this.setState({
            ...this.state,
            form
        })
    }

    onSubmitNewAvance = e => {
        e.preventDefault()
        waitAlert();
        this.addAvanceFileAxios()
    }

    async addAvanceFileAxios() {
        const { form } = this.state
        const { proyecto, at } = this.props

        console.log(proyecto, 'proyecto add')
        console.log(form, 'form add')
        // const data = new FormData();
        // let aux = Object.keys(form)
        // aux.map((element) => {
        //     switch (element) {
        //         case 'fechaInicio':
        //         case 'fechaFin':
        //             data.append(element, (new Date(form[element])).toDateString())
        //             break
        //         case 'semana':
        //             data.append(element, form[element])
        //             break;
        //         default:
        //             break
        //     }
        //     return false
        // })
        // aux = Object.keys(form.adjuntos)
        // aux.map((element) => {
        //     if (form.adjuntos[element].value !== '') {
        //         for (var i = 0; i < form.adjuntos[element].files.length; i++) {
        //             data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
        //             data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
        //         }
        //     }
        //     return ''
        // })
        // await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/avances/file', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${at}` } }).then(
        //     (response) => {
        //         const { avance, proyecto } = response.data
        //         console.log(response.data, 'response.data')
        //         doneAlert(response.data.message !== undefined ? response.data.message : 'El avance fue adjuntado con éxito.')
        //         var win = window.open(avance.pdf, '_blank');
        //         win.focus();
        //         this.setState({
        //             ...this.state,
        //             form: this.clearForm()
        //         })
        //     },
        //     (error) => {
        //         printResponseErrorAlert(error)
        //     }
        // ).catch((error) => {
        //     errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
        //     console.error(error, 'error')
        // })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    handleChangeAvance = (files, item) => { this.onChangeAdjunto({ target: { name: item, value: files, files: files } }) }

    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    render() {
        const { proyecto } = this.props
        const { modal, form, options, formeditado, tabAvance } = this.state
        return (
            <div>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center">
                        <div className="font-weight-bold font-size-h4 text-dark">Historial de avances</div>
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.openFormAvance('new') }}>
                                    {this.setNaviIcon('las la-camera-retro icon-xl', 'NUEVO AVANCE')}
                                </Dropdown.Item>
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.openFormAvance('attached') }}>
                                    {this.setNaviIcon('las la-paperclip icon-xl', 'ADJUNTAR AVANCE')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            proyecto ?
                                proyecto.avances ?
                                    proyecto.avances.length ?
                                        <div className="d-flex justify-content-center">
                                            <div className="col-md-11">
                                                <div className="accordion accordion-light accordion-svg-toggle">
                                                    {
                                                        proyecto.avances.map((avance, key) => {
                                                            return (
                                                                <Card className="w-auto" key={key}>
                                                                    <Card.Header >
                                                                        <Card.Title className={`rounded-0 ${(avance.isActive) ? 'text-primary2 collapsed' : 'text-dark'}`} onClick={() => { this.handleAccordion(avance.id) }}>
                                                                            <span className={`svg-icon ${avance.isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                                                                            </span>
                                                                            <div className="card-label ml-3 row mx-0 justify-content-between">
                                                                                <div>
                                                                                    <div className="font-size-lg">Semana {avance.semana}</div>
                                                                                    <div className="font-weight-light font-size-sm text-dark-75">{dayDMY(avance.fecha_inicio)} - {dayDMY(avance.fecha_fin)}</div>
                                                                                </div>
                                                                                <div className="align-self-center">
                                                                                    <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>VER PDF</span></Tooltip>}>
                                                                                        <a rel="noopener noreferrer" href={avance.pdf} target="_blank" className={`btn btn-icon ${avance.isActive ? 'btn-color-primary2' : ''}  btn-active-light-primary2 w-30px h-30px mr-2`}>
                                                                                            <i className="las la-file-download icon-xl"></i>
                                                                                        </a>
                                                                                    </OverlayTrigger>
                                                                                    <OverlayTrigger rootClose overlay={<Tooltip><span className='font-weight-bolder'>ENVIAR A CLIENTE</span></Tooltip>}>
                                                                                        <a onClick={() => { this.openModalEnviarAvance(avance) }} className={`btn btn-icon ${avance.isActive ? 'btn-color-primary2' : ''}  btn-active-light-primary2 w-30px h-30px`}>
                                                                                            <i className="las la-envelope icon-xl"></i>
                                                                                        </a>
                                                                                    </OverlayTrigger>
                                                                                </div>
                                                                            </div>
                                                                        </Card.Title>
                                                                    </Card.Header>
                                                                    <Card.Body className={`card-body px-10 ${avance.isActive ? 'collapse show' : 'collapse'}`}>
                                                                        <Row className="mx-0">
                                                                        {
                                                                            avance.actividades !== null?
                                                                            <div className="col-md-12">
                                                                                <div className="w-max-content mx-auto">
                                                                                    <div className="font-weight-bold mb-2 text-center"><span className="bg-light px-3 font-size-lg rounded">Actividades realizadas</span></div>
                                                                                    <ul className="mb-0">
                                                                                        { 
                                                                                            avance.actividades.split('\n').map(( actividad, index) =>  {
                                                                                                return(
                                                                                                    <li key = { index }>{actividad}</li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                <div className="separator separator-dashed my-6"></div>
                                                                                </div>
                                                                            </div>
                                                                            :<></>
                                                                        }
                                                                            <Col md={9} className="mb-5 mx-auto">
                                                                                {
                                                                                    avance.adjuntos.length > 0 ?
                                                                                    <SliderImages elements={avance.adjuntos} />
                                                                                    :
                                                                                    <ItemSlider  items={[{ url: avance.pdf, name: 'ficha_tecnica.pdf' }]}/>
                                                                                }
                                                                            </Col>
                                                                        </Row>
                                                                    </Card.Body>
                                                                </Card>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                    : ''
                                : ''
                        }
                    </Card.Body>
                </Card>
                <ModalSendMail show = { modal.avance_cliente } handleClose = { this.handleCloseModalEnviarAvance } header = '¿DESEAS ENVIAR EL AVANCE?' 
                    validation = 'url_avance !==' url = { form.url_avance } url_text = 'EL AVANCE' sendMail = { this.sendMail } >
                    <div className="col-md-11 mt-5">
                        <div>
                            <CreatableMultiselectGray placeholder = "SELECCIONA/AGREGA EL O LOS CORREOS" iconclass = "flaticon-email"
                                requirevalidation = { 1 } messageinc = "Selecciona el o los correos" uppercase = { false }
                                onChange = { this.handleChangeCreateMSelect } options = { options.correos_clientes } elementoactual = { form.correos_avances } />
                        </div>
                    </div>
                </ModalSendMail>
                <Modal size="lg" title='AVANCES DEL PROYECTO' show={modal.add_avance} handleClose={this.handleCloseAvances}>
                    <AvanceForm form = { form } onChangeAvance = { this.onChangeAvance } onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance }
                        clearFilesAvances = { this.clearFilesAvances } addRowAvance = { this.addRowAvance } deleteRowAvance = { this.deleteRowAvance }
                        onSubmit = { this.onSubmitNewAvance } onChange = { this.onChange } proyecto = { proyecto } sendMail = { this.sendMail }
                        handleChange = { this.handleChangeAvance } formeditado = { formeditado } isNew = { tabAvance === 'attached' ? true : false } />
                </Modal>
            </div>
        )
    }
}

export default Avances